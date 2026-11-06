/**
 * Deployment verification script (Node 20+, zero external dependencies).
 * Usage: node scripts/check-deployment.mjs [domain]
 * Default domain: https://foundry-final.onrender.com (or pass custom domain).
 */

const targetUrl = process.argv[2] || "https://foundry-final.onrender.com";

async function runCheck() {
  console.log(`\n🔍 Checking deployment status for: ${targetUrl}\n`);
  let passed = 0;
  let failed = 0;

  async function check(name, fn) {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.log(`❌ [FAIL] ${name} — ${err.message}`);
      failed++;
    }
  }

  // 1. Check HTTPS / base URL
  await check("Base URL accessibility (HTTPS)", async () => {
    const res = await fetch(targetUrl);
    if (!res.ok && res.status !== 404) {
      throw new Error(`HTTP status ${res.status}`);
    }
  });

  // 2. Check /api/health endpoint
  await check("API Health endpoint (/api/health)", async () => {
    const url = `${targetUrl.replace(/\/$/, "")}/api/health`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Health check returned status ${res.status}`);
    }
    const data = await res.json();
    if (!data || (data.status !== "ok" && data.status !== "degraded")) {
      throw new Error(`Invalid health response: ${JSON.stringify(data)}`);
    }
  });

  // 3. Check security headers
  await check("Security headers presence", async () => {
    const res = await fetch(targetUrl);
    const xContentType = res.headers.get("x-content-type-options");
    const xFrame = res.headers.get("x-frame-options");
    if (!xContentType && !xFrame) {
      throw new Error("Missing key security headers (X-Content-Type-Options / X-Frame-Options)");
    }
  });

  console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runCheck().catch((err) => {
  console.error("Check script error:", err);
  process.exit(1);
});
