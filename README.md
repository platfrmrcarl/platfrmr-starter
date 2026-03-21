# SaaSStarter Boilerplate

Reusable starter for SaaS applications with:

- Next.js App Router + TypeScript + Tailwind CSS
- Firebase Auth (email/password + Google)
- Firestore user profile creation and sync
- Protected dashboard shell
- Stripe subscriptions (Checkout + Billing Portal + Webhook)
- Firestore subscription status tracking
- Feature gating for premium functionality

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Firebase (`firebase`, `firebase-admin`)
- Stripe

## Folder Structure

```text
src/
  app/
    api/stripe/
      checkout/route.ts
      portal/route.ts
      webhook/route.ts
    dashboard/
      account/page.tsx
      billing/page.tsx
      layout.tsx
      page.tsx
    forgot-password/page.tsx
    login/page.tsx
    pricing/page.tsx
    signup/page.tsx
    globals.css
    layout.tsx
    page.tsx
    providers.tsx
  components/
    auth/protected-route.tsx
    billing/billing-actions.tsx
    layout/dashboard-shell.tsx
    layout/top-nav.tsx
    premium/premium-feature.tsx
    pricing/pricing-cards.tsx
  hooks/
    use-auth.ts
  lib/
    auth-server.ts
    billing-client.ts
    stripe.ts
    utils.ts
    firebase/
      admin.ts
      client.ts
  providers/
    auth-provider.tsx
  types/
    subscription.ts
    user-profile.ts
```

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Copy env template and fill values:

```bash
cp .env.example .env.local
```

3. Run development server:

```bash
npm run dev
```

## Firebase Setup

1. Create a Firebase project.
2. Enable Authentication providers:
   - Email/Password
   - Google
3. Create Firestore database.
4. Generate Firebase Web App config and set all `NEXT_PUBLIC_FIREBASE_*` vars.
5. Create a service account key and set:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY` (keep newline escapes as `\\n`)

### Firestore Rules (Required)

If login succeeds but you see `permission-denied` for profile reads, publish rules that allow each authenticated user to read/write only their own document in `users/{uid}`.

Use [firestore.rules](firestore.rules):

```bash
npm run firebase:deploy:rules
```

The repo already includes [firebase.json](firebase.json) and [.firebaserc](.firebaserc), so the command deploys against the configured default Firebase project.

## Stripe Setup

1. Create a Stripe product + recurring monthly price.
2. Set:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_MONTHLY_PRICE_ID`
   - `NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID`
3. Start local dev server and Stripe webhook forwarding:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

4. Copy webhook signing secret from Stripe CLI output to:
   - `STRIPE_WEBHOOK_SECRET`

## How Billing Works

1. Authenticated user triggers Checkout from pricing or billing page.
2. API route creates/fetches Stripe customer, then creates Checkout session.
3. Stripe webhook receives subscription events.
4. Webhook updates Firestore user doc fields:
   - `subscriptionStatus`
   - `stripeCustomerId`
   - `stripeSubscriptionId`
   - `stripePriceId`
5. Frontend auth provider listens to Firestore profile updates and enables premium features in real time.

## Reuse Guide

To adapt this boilerplate for a new SaaS:

1. Replace brand copy and colors in app pages/components.
2. Swap `PremiumFeature` with your gated features.
3. Add additional tiers/prices in Stripe and pricing UI.
4. Extend Firestore user profile schema for your domain.
5. Add product-specific pages under `src/app`.

## Useful Scripts

- `npm run dev`: Start local development server
- `npm run build`: Production build
- `npm run start`: Run production server
- `npm run lint`: Lint project
