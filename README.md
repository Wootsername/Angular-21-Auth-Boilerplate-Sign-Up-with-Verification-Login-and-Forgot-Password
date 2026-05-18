# 🔐 Angular 21 Auth System — Frontend

Full-stack authentication system frontend built with **Angular 21 + Bootstrap 5**.

Features: Email sign-up with verification, JWT login/logout, refresh tokens (httpOnly cookie), forgot/reset password, role-based authorization (User & Admin), admin panel for account management.

## Live URLs

| Service | URL |
|---------|-----|
| **Frontend (Netlify)** | `https://jolly-valkyrie-e7a535.netlify.app` |
| **Backend API (Render)** | `https://auth-system-backend-j7xw.onrender.com` |
| **API Docs (Swagger)** | `https://auth-system-backend-j7xw.onrender.com/api-docs` |

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Run with Fake Backend (Stage A — no API needed)
The fake backend is already enabled in `src/app/app.module.ts`.

```bash
npm start
```

This opens the app at `http://localhost:4200` with:
- Accounts stored in `localStorage`
- "Emails" shown as alerts in the UI
- First registered account becomes Admin

### 3. Run with Real Backend (Stage B)
1. Comment out `fakeBackendProvider` in `src/app/app.module.ts`:
   ```ts
   // provider used to create fake backend
   // fakeBackendProvider
   ```
2. Make sure the backend is running at `http://localhost:4000`
3. Run the app:
   ```bash
   npm start
   ```

### 4. Production Build (for Netlify deployment)
1. Update `src/environments/environment.prod.ts` with your Render backend URL:
   ```ts
   apiUrl: 'https://YOUR-BACKEND.onrender.com'
   ```
2. Build:
   ```bash
   ng build --configuration production
   ```
3. Deploy the `dist/angular-15-example/` folder to Netlify
4. The `_redirects` file is auto-included for SPA deep-link routing

## Evaluation Flow

### Stage A — Fake Backend Testing
1. ✅ Enable `fakeBackendProvider` in `app.module.ts`
2. ✅ Register a new account → "Verification email" appears as alert
3. ✅ Click the verification link → account verified
4. ✅ Login → redirected to home page
5. ✅ First account = Admin → can access `/admin` panel
6. ✅ Second account = User → restricted from `/admin`

### Stage B — Integration Testing (Real Backend)
1. ✅ Comment out `fakeBackendProvider`
2. ✅ Register on live Netlify site → verification email sent via Ethereal
3. ✅ Click Ethereal preview link (from Render logs) → `isVerified = true` in Aiven MySQL
4. ✅ Login → inspect browser Application tab:
   - `refreshToken` = httpOnly cookie (not visible in JS)
   - `jwtToken` = in memory (BehaviorSubject), NOT in localStorage
5. ✅ First account (Admin) → can access `/admin`
6. ✅ Second account (User) → redirected from `/admin`

## How Authentication Works

This app uses **two tokens**:

| Token | Storage | Lifetime | Purpose |
|-------|---------|----------|---------|
| **JWT Access Token** | In-memory (`BehaviorSubject`) | 15 minutes | `Authorization: Bearer <token>` header |
| **Refresh Token** | httpOnly cookie | 7 days | Silently refresh JWT before it expires |

### Login Flow
1. User submits email + password
2. Backend returns account details + `jwtToken` in response body
3. Backend sets `refreshToken` as httpOnly cookie
4. Angular stores account in `BehaviorSubject` (memory only)
5. JWT interceptor attaches `Authorization: Bearer ...` to API calls

### Auto-Refresh Flow
1. On app start, `APP_INITIALIZER` calls `refreshToken()` to restore session
2. After login, a timer refreshes the JWT 1 minute before expiry
3. The error interceptor retries failed 401 requests after refreshing

## Project Structure

```
src/app/
├── _components/     → AlertComponent (shared)
├── _helpers/        → Guards, interceptors, fake backend, validators
├── _models/         → Account, Role, Alert types
├── _services/       → AccountService, AlertService
├── account/         → Login, Register, Verify, Forgot/Reset Password
├── admin/           → Admin panel (list/manage users)
├── home/            → Home page
├── profile/         → User profile pages
├── app.module.ts    → Root module with fake backend toggle
└── app-routing.module.ts → Routes with AuthGuard + role restrictions
```

## API Endpoints (called by AccountService)

| Method | Path | Description |
|--------|------|-------------|
| POST | /accounts/authenticate | Login |
| POST | /accounts/refresh-token | Refresh JWT |
| POST | /accounts/revoke-token | Logout |
| POST | /accounts/register | Register |
| POST | /accounts/verify-email | Verify email |
| POST | /accounts/forgot-password | Forgot password |
| POST | /accounts/validate-reset-token | Validate reset token |
| POST | /accounts/reset-password | Reset password |
| GET | /accounts | List all (Admin) |
| GET | /accounts/:id | Get account |
| POST | /accounts | Create account (Admin) |
| PUT | /accounts/:id | Update account |
| DELETE | /accounts/:id | Delete account |

## Netlify Deployment

1. Connect your GitHub repo to Netlify
2. **Build command**: `ng build --configuration production`
3. **Publish directory**: `dist/angular-15-example`
4. The `_redirects` file (`/* /index.html 200`) is auto-included in the build
