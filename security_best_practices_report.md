# Kayolla Homes Security Report

## Scope

I audited the current app for production readiness, security issues, AI handling, admin access, public form handling, and PWA setup.

## Findings Fixed

### 1. Browser-side Gemini secret exposure

The app no longer exposes the Gemini API key to the client bundle. The browser now talks to server endpoints, while the server keeps the key private.

- Server-side AI is initialized in [`server.ts`](./server.ts#L87).
- Public search uses `/api/search` in [`server.ts`](./server.ts#L441).
- Public chat uses `/api/chat` in [`server.ts`](./server.ts#L492).
- The frontend chatbot now calls the server instead of instantiating Gemini in the browser: [`src/components/Chatbot.tsx`](./src/components/Chatbot.tsx#L25).
- Property search now calls the server-backed search API: [`src/services/geminiService.ts`](./src/services/geminiService.ts#L1).

### 2. Unauthenticated admin access

The admin panel is now Firebase-authenticated and email-allowlisted.

- Firebase client config lives in [`src/lib/firebase.ts`](./src/lib/firebase.ts#L4).
- The admin panel requires sign-in and blocks non-allowlisted accounts in [`src/components/AdminPanel.tsx`](./src/components/AdminPanel.tsx#L187).
- Admin uploads send a Firebase ID token to the server in [`src/components/AdminPanel.tsx`](./src/components/AdminPanel.tsx#L104).
- The backend verifies the token in [`server.ts`](./server.ts#L189).

### 3. Public forms were simulated only

Contact and viewing requests now post to real server endpoints and are stored server-side.

- Contact submissions use `/api/contact` in [`src/components/Contact.tsx`](./src/components/Contact.tsx#L35).
- Viewing requests use `/api/viewings` in [`src/components/ViewingScheduler.tsx`](./src/components/ViewingScheduler.tsx#L26).
- The server stores both submission types with rate limiting in [`server.ts`](./server.ts#L380).

### 4. XSS risk from HTML injection in the hero title

I removed the `dangerouslySetInnerHTML` usage and replaced it with safe React rendering.

- Safe hero title rendering is now in [`src/components/Hero.tsx`](./src/components/Hero.tsx#L5).

### 5. PWA installability

The app is now installable as a PWA and registers a service worker.

- Service worker registration is in [`src/main.tsx`](./src/main.tsx#L7).
- The manifest and app icons are linked in [`index.html`](./index.html#L9).

## Residual Risks

These are not code breaks, but they still matter for production:

- Firebase Auth must be configured in the project and the admin email allowlist must be correct.
- The Gemini API key now stays server-side, but you still need to keep it out of logs and deployment screenshots.
- App Check is not added yet, so public endpoints can still be spammed if you expose the site broadly.
- The admin panel is secure only as long as the Firebase account and allowlist remain tightly controlled.

## Verification

- `npm run lint` passed.
- `npm run build` passed.
