# Kayolla Homes Property Management

Production-ready real estate and property management site with:

- Firebase-backed admin authentication
- Firestore-backed content storage
- Server-side AI assistant and property search
- Public contact and viewing request persistence
- PWA install support

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy [.env.example](./.env.example) to `.env` and fill in the Firebase and Gemini values.
3. Run the app:
   ```bash
   npm run dev
   ```

## Firebase Setup

- Create a Firebase project.
- Enable Google sign-in in Firebase Authentication.
- Add your admin email addresses to `VITE_ALLOWED_ADMIN_EMAILS`.
- Set the Firebase web client values in the `VITE_FIREBASE_*` variables.
- Create a Firebase service account for the server and set `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, and `FIREBASE_STORAGE_BUCKET`.

## Production Notes

- The admin panel requires Firebase Auth in production.
- `GEMINI_API_KEY` is used only on the server.
- Public forms and viewing requests are rate limited and stored server-side.
- The app is installable as a PWA from the browser toolbar.
