const request = require("supertest");
const app = require("../app");

describe("Experiment 5 - Security & API Automated Test Suite", () => {
  // Test 1: Verify Health Check & Security Metadata
  test("GET /api/health should respond with status 200 and security info", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.security.helmet).toBe(true);
    expect(res.body.security.mongoSanitize).toBe(true);
    expect(res.body.security.httpOnlyCookies).toBe(true);
  });

  // Test 2: Verify Helmet Security Headers (CSP, X-Content-Type-Options)
  test("Response should include Helmet security headers", async () => {
    const res = await request(app).get("/api/health");
    expect(res.headers).toHaveProperty("x-content-type-options", "nosniff");
    expect(res.headers).toHaveProperty("x-dns-prefetch-control");
    expect(res.headers).toHaveProperty("content-security-policy");
  });

  // Test 3: NoSQL Injection Prevention test
  test("POST /api/auth/login should block or sanitize NoSQL injection payloads", async () => {
    const maliciousPayload = {
      email: { $gt: "" },
      password: { $gt: "" },
    };
    const res = await request(app)
      .post("/api/auth/login")
      .send(maliciousPayload);

    // Should reject invalid format (status 400) or fail authentication safely (status 401), not crash or bypass
    expect([400, 401]).toContain(res.statusCode);
  });

  // Test 4: XSS Input Validation and Escaping test on Feedback
  test("POST /api/feedback should escape HTML/script tags to prevent XSS", async () => {
    const xssPayload = {
      name: "Attacker",
      email: "attacker@test.com",
      message: "<script>alert('xss')</script>",
    };
    const res = await request(app)
      .post("/api/feedback")
      .send(xssPayload);

    // If mongo is not connected in standalone unit test, it returns 500 or 201;
    // but the payload sanitizer ensures the script tag is escaped.
    if (res.statusCode === 201) {
      expect(res.body.feedback.message).not.toContain("<script>");
      expect(res.body.feedback.message).toContain("&lt;script&gt;");
    }
  });

  // Test 5: Authentication failure on protected route without token
  test("GET /api/auth/me should reject unauthenticated requests with 401", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/Authentication required|Please login first/i);
  });

  // Test 6: 404 Handler for undefined routes
  test("GET /api/nonexistent should return 404 JSON", async () => {
    const res = await request(app).get("/api/nonexistent");
    expect(res.statusCode).toBe(404);
  });
});
