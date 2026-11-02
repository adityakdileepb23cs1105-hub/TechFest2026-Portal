# TechFest 2026 Portal (MERN Full-Stack Application)
### Web Technology Laboratory (23CSB40B) — Experiment 5
**Student Name:** Aditya K Dileep | **Register No:** B23CS1105 | **Semester:** S7 CSE

---

## 1. Application Architecture

```
[ Client Tier ]                [ API Tier ]                     [ Database Tier ]
+---------------------+        +-------------------------+      +------------------------+
|  React 19 SPA       | HTTPS  |  Node.js + Express REST | Mongoose | MongoDB Atlas (Cloud) |
|  (Vite + React      |------->|  - Helmet CSP Headers   |--------->| - Users Collection     |
|   Router + Context) |<-------|  - MongoSanitize (NoSQL)|<---------| - Events Collection    |
|  Hosted: Vercel     |        |  - HttpOnly JWT Cookies |          | - Registrations Coll.  |
|                     |        |  Hosted: Render         |          | - Feedback Collection  |
+---------------------+        +-------------------------+          +------------------------+
```

---

## 2. Cloud Deployment URLs

| Component | Platform | Deployment URL | Status |
| :--- | :--- | :--- | :--- |
| **Frontend (React SPA)** | Vercel / Netlify | `https://techfest2026-portal.vercel.app` | Active (HTTPS) |
| **Backend (REST API)** | Render | `https://techfest2026-api.onrender.com` | Active (HTTPS) |
| **Database** | MongoDB Atlas | `mongodb+srv://cluster0.mongodb.net/techfest` | Active (M0 Replica Set) |

---

## 3. OWASP Security Hardening (Module 5)

1. **NoSQL Injection Mitigation (A03:2021 - Injection):**
   - **Vulnerability:** Unsanitized user requests carrying operator objects (`{"email": {"$gt": ""}}`) can bypass password comparisons.
   - **Fix:** Enabled `express-mongo-sanitize` to strip all `$` and `.` characters from `req.body`, `req.query`, and `req.params`. Strict validation via `express-validator`.
2. **Cross-Site Scripting (XSS) & Content Security Policy (A03:2021):**
   - **Vulnerability:** Injection of malicious script tags (`<script>alert('xss')</script>`) in contact and feedback textareas.
   - **Fix:** Applied Helmet to enforce strict Content Security Policy (CSP). HTML characters are automatically escaped, and React renders text safely as string literals in the DOM.
3. **Session & Cookie Security (A07:2021 - Identification & Authentication Failures):**
   - **Vulnerability:** Storing JWT in standard browser `localStorage` leaves it susceptible to exfiltration by malicious third-party scripts.
   - **Fix:** JWT authentication issued with `httpOnly: true`, `secure: true` (HTTPS only), and `sameSite: 'strict'` cookies to mitigate both XSS exfiltration and Cross-Site Request Forgery (CSRF).
4. **Denial of Service (DoS) Payload Control:**
   - Enforced request body limit of `15kb` on incoming JSON to prevent payload inflation memory starvation attacks.

---

## 4. Performance Optimization Metrics

- **Vite Dynamic Code-Splitting & Lazy Loading:**
  - Integrated `React.lazy()` and `<Suspense>` across non-critical routes (`Gallery`, `Contact`, `Cart`, `MyRegistrations`, `Login`, `Signup`).
  - Bundle split from a monolithic `316.05 kB` chunk into on-demand component chunks (`Gallery.js: 2.72 kB`, `Contact.js: 3.93 kB`, etc.).
- **Asset Optimization:**
  - Native `loading="lazy"` on all gallery and event imagery with explicit dimensions (`width` and `height`) to prevent layout shifts (CLS = 0).

---

## 5. Automated CI/CD Pipeline (GitHub Actions)

Workflow defined in `.github/workflows/ci.yml`:
- **Trigger:** Automatic run on all pushes and pull requests to `main`.
- **Jobs:**
  1. `backend-test`: Node.js 20 environment, dependency caching, Jest & Supertest execution verifying security headers, NoSQL injection neutralization, and 401 unauthenticated route rejections.
  2. `frontend-build`: React 19 production build verifying tree-shaking, syntax validity, and bundle distribution output.
