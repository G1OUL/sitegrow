import { spawn } from 'child_process';
import http from 'http';

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function waitForServer(port = 3000, maxRetries = 25, delayMs = 400) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await request({ hostname: 'localhost', port, path: '/', method: 'GET' });
      if (res.statusCode === 200) {
        return true;
      }
    } catch {
      // server still starting
    }
    await new Promise(r => setTimeout(r, delayMs));
  }
  return false;
}

async function runSuite() {
  console.log('====================================================');
  console.log('SiteGrow Verification & QA Test Suite');
  console.log('====================================================\n');

  console.log('Starting Next.js production server for testing...');
  const child = spawn('npx.cmd', ['next', 'start'], { stdio: 'pipe', shell: true });

  const isUp = await waitForServer(3000, 30, 400);
  if (!isUp) {
    console.error('Server failed to start on port 3000 within timeout.');
    child.kill('SIGTERM');
    process.exit(1);
  }
  console.log('Server is ready on http://localhost:3000\n');

  let passedAll = true;

  try {
    // 1. Verify App Routes
    console.log('--- 1. Testing Application Routes ---');
    const routes = [
      { path: '/', name: 'Landing Page' },
      { path: '/audit', name: 'Audit Tool' },
      { path: '/dashboard', name: 'Dashboard' },
      { path: '/recommendations', name: 'Recommendations Board' },
      { path: '/reports', name: 'Reports Index' },
      { path: '/reports/audit_apex_sample', name: 'Report by ID' },
      { path: '/reports/artisanhearth-demo.com', name: 'Report by Domain' },
      { path: '/settings', name: 'Settings Screen' },
    ];

    for (const r of routes) {
      const res = await request({ hostname: 'localhost', port: 3000, path: r.path, method: 'GET' });
      const ok = res.statusCode === 200 && res.body.includes('SiteGrow');
      if (!ok) passedAll = false;
      console.log(`  [${ok ? 'PASS' : 'FAIL'}] ${r.name} (${r.path}) -> HTTP ${res.statusCode} (${res.body.length} bytes)`);
    }

    // 2. Verify Live Public Audit
    console.log('\n--- 2. Testing Live Public Audit Flow ---');
    const validRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/audit',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify({ url: 'https://example.com' }));

    const validJson = JSON.parse(validRes.body);
    const validOk = validRes.statusCode === 200 && validJson.success && validJson.audit?.cleanUrl === 'example.com';
    if (!validOk) passedAll = false;
    console.log(`  [${validOk ? 'PASS' : 'FAIL'}] Valid URL (https://example.com) -> Score: ${validJson.audit?.overallScore}, Latency: ${validJson.audit?.metrics?.responseTimeMs}ms`);

    // Verify measurement labels
    if (validJson.audit?.checks) {
      const measured = validJson.audit.checks.filter(c => c.type === 'measured');
      const estimated = validJson.audit.checks.filter(c => c.type === 'estimated');
      const unavailable = validJson.audit.checks.filter(c => c.type === 'unavailable');
      const labelsOk = measured.length >= 10 && estimated.length >= 1 && unavailable.length >= 1;
      if (!labelsOk) passedAll = false;
      console.log(`  [${labelsOk ? 'PASS' : 'FAIL'}] Honesty Labels: ${measured.length} Measured, ${estimated.length} Estimated, ${unavailable.length} Unavailable`);
    }

    // 3. Verify Error & Negative Cases
    console.log('\n--- 3. Testing Error Handling & Edge Cases ---');
    
    // Bad format
    const badRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/audit',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify({ url: 'not_valid_url_$$$' }));
    const badJson = JSON.parse(badRes.body);
    const badOk = badRes.statusCode === 400 && !badJson.success;
    if (!badOk) passedAll = false;
    console.log(`  [${badOk ? 'PASS' : 'FAIL'}] Invalid URL format -> HTTP ${badRes.statusCode} ("${badJson.error}")`);

    // Unreachable domain
    const unreachRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/audit',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify({ url: 'https://unreachable-nonexistent-domain-test-12345.com' }));
    const unreachJson = JSON.parse(unreachRes.body);
    const unreachOk = (unreachRes.statusCode === 400 || unreachRes.statusCode === 502) && !unreachJson.success;
    if (!unreachOk) passedAll = false;
    console.log(`  [${unreachOk ? 'PASS' : 'FAIL'}] Unreachable domain -> HTTP ${unreachRes.statusCode} ("${unreachJson.error}")`);

    // 4. Verify SSRF Defenses & Private Network Blocking
    console.log('\n--- 4. Testing SSRF & Private Network Defenses ---');
    const blockedTargets = [
      { url: 'http://127.0.0.1:8080', name: 'IPv4 Loopback (127.0.0.1)' },
      { url: 'http://localhost:3000', name: 'Localhost Domain' },
      { url: 'http://[::1]:3000', name: 'IPv6 Loopback ([::1])' },
      { url: 'http://169.254.169.254/latest/meta-data', name: 'AWS Metadata (169.254.169.254)' },
      { url: 'http://192.168.1.1', name: 'Private Subnet (192.168.0.0/16)' },
      { url: 'http://10.0.0.1', name: 'Private Subnet (10.0.0.0/8)' },
      { url: 'http://172.16.0.1', name: 'Private Subnet (172.16.0.0/12)' },
      { url: 'http://mydevice.local', name: 'Internal TLD (.local)' },
    ];

    for (const t of blockedTargets) {
      const res = await request({
        hostname: 'localhost',
        port: 3000,
        path: '/api/audit',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, JSON.stringify({ url: t.url }));
      const json = JSON.parse(res.body);
      const isBlocked = (res.statusCode === 400 || res.statusCode === 502) && !json.success;
      if (!isBlocked) passedAll = false;
      console.log(`  [${isBlocked ? 'PASS' : 'FAIL'}] ${t.name} -> Blocked (${res.statusCode})`);
    }

    // 5. Verify Demo Mode
    console.log('\n--- 5. Testing Demo Mode Fallbacks ---');
    const demoRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/audit',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify({ url: 'https://apexplumbing-demo.com' }));
    const demoJson = JSON.parse(demoRes.body);
    const demoOk = demoRes.statusCode === 200 && demoJson.success && demoJson.audit?.isDemo === true;
    if (!demoOk) passedAll = false;
    console.log(`  [${demoOk ? 'PASS' : 'FAIL'}] Demo Domain (apexplumbing-demo.com) -> isDemo: ${demoJson.audit?.isDemo}, Score: ${demoJson.audit?.overallScore}`);

    console.log('\n====================================================');
    console.log(`Test Result: ${passedAll ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
    console.log('====================================================');
  } catch (err) {
    console.error('Test execution error:', err);
    passedAll = false;
  } finally {
    child.kill('SIGTERM');
    process.exit(passedAll ? 0 : 1);
  }
}

runSuite();
