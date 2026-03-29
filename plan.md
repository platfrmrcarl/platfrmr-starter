1. Project Overview
Build a high-performance Next.js web application integrated with Firebase (Auth & Firestore) and Stripe (Custom Subscriptions). The app features a modern UI using TailwindCSS and DaisyUI with a specific primary brand color.

2. Tech Stack & Configuration
Framework: Next.js (App Router)

Styling: TailwindCSS + DaisyUI

Database: Firebase Firestore

Authentication: Firebase Auth (Google Provider + GitHub Linking)

Payments: Stripe (Custom Checkout Flow)

Deployment: Firebase Hosting + Firebase Functions (for Stripe webhooks)

Theme Configuration
Primary Color: #2563EB
In tailwind.config.js, configure DaisyUI to use a custom theme:

JavaScript
module.exports = {
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#2563EB",
          "primary-content": "#ffffff",
          "secondary": "#f000b8",
          // ... rest of theme
        },
      },
    ],
  },
}
3. Core Features & Architecture
A. Authentication Flow
Sign In: Implement Google Login using Firebase signInWithPopup.

Account Linking: Allow users to link their GitHub account to their existing Firebase profile.

Protected Routes: Create a higher-order component (HOC) or middleware to protect /Dashboard and /Upgrade.

B. Navigation Bar (DaisyUI)
Left: App Logo/Name.

Center: General Navigation Links (e.g., Features, Pricing, About).

Right (Logged Out): "Sign In" button.

Right (Logged In): User Avatar Dropdown containing:

/Dashboard

/Upgrade

/logout (Trigger auth.signOut())

C. Stripe Implementation (Custom Checkout)
Frontend: Create a custom checkout page (/Upgrade) using Stripe Elements or a custom form that calls a Next.js API Route.

Backend: Next.js API route to create a setupIntent or paymentIntent for subscriptions.

Webhooks: Set up a Firebase Function to listen for checkout.session.completed to update user subscription status in Firestore.

4. Database Schema (Firestore)
users/{userId}

uid: string

email: string

displayName: string

photoURL: string

stripeCustomerId: string

subscriptionStatus: 'active' | 'none'

subscription: 'basic' | 'pro'

github_access: string

githubLinked: boolean

5. Implementation Roadmap
Phase 1: Environment Setup
[x] Initialize Next.js with TailwindCSS and DaisyUI.

[x] Configure tailwind.config.js with the primary color #2563EB.

[x] Initialize Firebase Project and enable Auth (Google/GitHub) and Firestore.

Phase 2: Layout & UI
[x] Build the responsive Navbar with DaisyUI components.

[x] Implement the Auth state listener to toggle between Sign In and the Profile Dropdown.

[x] Create landing page and dashboard shells.

Phase 3: Firebase Integration
[x] Set up firebaseConfig.js and context providers for Auth.

[x] Implement "Link GitHub Account" logic in the user settings.

Phase 4: Stripe & Payments
[x] Integrate @stripe/stripe-js and @stripe/react-stripe-js.

[x] Create the custom checkout page UI.

[x] Develop the API route to handle subscription creation.

[x] Secure Firestore rules to only allow "active" subscribers to access specific data.

Phase 5: Deployment
[ ] Configure firebase.json for Next.js hosting.

[ ] Set up environment variables in Firebase/Vercel.

[ ] Deploy.

Custom Instructions for Copilot
"When generating code, ensure all Firebase interactions use the v10+ modular SDK. Use 'use client' directives only where necessary for interactivity. Ensure the primary color #2563EB is applied to all main buttons and active states via the DaisyUI 'btn-primary' class."