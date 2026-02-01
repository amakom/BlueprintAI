# BlueprintAI Testing Guide

This guide provides step-by-step instructions to test the implemented features of BlueprintAI, including Strategy Dashboard, Visual Canvas AI, and Billing.

## Prerequisites

1.  **Environment Variables**: Ensure your `.env` file is set up with database credentials and JWT secret.
    *   For Billing to work, you need `FLUTTERWAVE_PUBLIC_KEY` and `FLUTTERWAVE_SECRET_KEY`.
2.  **Database**: Ensure migrations are applied (`npx prisma db push`).
3.  **Server**: Run the development server (`npm run dev`).

---

## 1. Strategy Dashboard (AI Generation)

### A. AI OKR Generation
1.  Navigate to a Project.
2.  Click on the **"Strategy"** tab (toggle at the top right if needed).
3.  Select the **"OKRs"** sub-tab.
4.  Click the **"Generate with AI"** button (Sparkles icon).
5.  Wait for the AI to generate Objectives and Key Results.
6.  Verify that new cards appear.
7.  **Scroll Test**: Verify you can scroll up and down if many OKRs are generated.
8.  **Persistence**: Refresh the page. The generated OKRs should remain.

### B. AI Persona Generation
1.  In the **"Strategy"** tab, select the **"Personas"** sub-tab.
2.  Click **"Generate Personas"**.
3.  Wait for 2-3 mock personas to appear with avatars (Dicebear).
4.  **Persistence**: Refresh the page. The personas should remain.

---

## 2. Visual Canvas (AI User Flow)

1.  Navigate to the **"Canvas"** tab of a project.
2.  Click the **"AI Generate"** button (Sparkles icon) in the top toolbar.
3.  Select **"User Flow"**.
4.  Enter a prompt (e.g., "Login flow for a mobile app").
5.  Click **"Generate"**.
6.  Verify that a sequence of nodes (User Story -> Screen -> Actions) appears on the canvas.
7.  **Drag & Drop**: Move the nodes around to verify they are interactive.

---

## 3. Billing & Subscription

### A. View Billing Settings
1.  Click your avatar in the top right -> **Settings**.
2.  Navigate to **Billing**.
3.  Verify it shows your current plan (likely "Free").

### B. Upgrade Flow
1.  Click **"Upgrade Now"** or **"View Plans"**.
2.  Select the **"Pro"** or **"Team"** plan.
3.  **Note**: This requires valid Flutterwave keys in `.env`.
    *   If keys are present, it will redirect to Flutterwave payment page.
    *   After payment, it redirects back to `/settings/billing?status=success`.
4.  Verify the success message appears and the plan updates (mock update in dev if using test cards).

---

## 4. Role-Based Limits (Owner Bypass)

### A. Verify Owner Privileges
1.  Log in as the **Owner** (the user created during setup).
2.  Navigate to **Strategy** or **Canvas**.
3.  Generate AI content repeatedly (more than 5 times).
4.  Verify you **do NOT** see a "Monthly limit reached" error. Owners have unlimited access.

### B. Verify Team Limits (Optional)
1.  Create a new user (or use a different browser).
2.  As a "Free" plan user, generate content 5 times.
3.  On the 6th attempt, verify you see the limit reached error.

---

## Troubleshooting

-   **"Monthly limit reached" for Owner**: Ensure the `reset-limits.ts` script was run or the API changes are applied. The system now checks `user.role === 'OWNER'` to bypass limits.
-   **Billing Error**: "Failed to initiate payment" usually means missing Flutterwave keys. Check your server console for warnings.
