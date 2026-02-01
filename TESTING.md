# BlueprintAI Comprehensive Testing Guide

This guide provides step-by-step instructions to test all implemented features of BlueprintAI, including the new Engineering Spec Generator and Visual Canvas enhancements.

## Prerequisites

1.  **Environment Variables**: Ensure your `.env` file is set up with database credentials and JWT secret.
    *   For Billing to work, you need `FLUTTERWAVE_PUBLIC_KEY` and `FLUTTERWAVE_SECRET_KEY`.
2.  **Database**: Ensure migrations are applied (`npx prisma db push`).
3.  **Server**: Run the development server (`npm run dev`).

---

## 1. Authentication & Onboarding

### A. Sign Up & Login
1.  Navigate to `/signup`.
2.  Create a new account.
3.  Verify you are redirected to the dashboard.
4.  Log out and log back in via `/login`.

### B. Workspace Setup
1.  Verify a default team is created for you.
2.  Navigate to `/settings` to see your profile and team details.

---

## 2. Project Management

### A. Create Project
1.  On the Dashboard, click **"New Project"**.
2.  Enter a name (e.g., "Mobile App MVP").
3.  Verify the project card appears on the dashboard.

### B. Project Navigation
1.  Click on a project card.
2.  Verify you land on the **Canvas** view by default.
3.  Check the top navigation bar for project title and "Share" button.

---

## 3. Visual Canvas & Flow Building

### A. Drag & Drop Library (NEW)
1.  On the Canvas page, look for the **"Library"** sidebar on the left.
2.  **Nodes**: Drag a "User Story" or "Screen" node.
3.  **Frames**: Drag a "Mobile App", "Web App", or "Social Post" frame to create a screen with preset dimensions.

### B. Design Properties (NEW)
1.  Select a **Screen Node** on the canvas.
2.  Look at the **Properties Panel** on the right.
3.  **Dimensions**: Click "iPhone" or "Desktop" buttons to resize instantly.
4.  **Color**: Use the color picker to change the background color.
5.  **Image**: Click the upload box to add an image (e.g., a UI design screenshot) to the screen.

### C. Connecting Nodes
1.  Hover over the handle (dot) on the right side of a node.
2.  Click and drag to another node's handle (left side).
3.  Verify a connection line (edge) is drawn.

### C. AI User Flow Generation
1.  Click the **"AI Generate"** button (Sparkles icon) in the top toolbar.
2.  Select **"User Flow"**.
3.  Enter a prompt (e.g., "Checkout flow for an e-commerce app").
4.  Click **"Generate"**.
5.  Verify a sequence of nodes (User Story -> Screen -> Actions) appears.

---

## 4. Engineering Specs (NEW)

### A. Access Specs
1.  In the Project view, look for the View Toggle (top right).
2.  Switch from **"Canvas"** or **"Strategy"** to **"Specs"**.
3.  Verify you see the Specification Editor.

### B. Generate Specs with AI
1.  Ensure you have some content on your Canvas (nodes/edges).
2.  Click the **"Generate Spec"** button (Sparkles icon).
3.  Wait for the AI to analyze your canvas and generate a Markdown specification.
4.  Verify the editor populates with sections like "Overview," "User Flows," and "Data Models."

### C. Edit & Save
1.  Manually edit the generated text.
2.  Click **"Save Changes"**.
3.  Refresh the page to verify persistence.

### D. Export
1.  Click the **"Download"** button.
2.  Verify a `.md` file is downloaded to your machine.

---

## 5. Strategy Dashboard

### A. AI OKR Generation
1.  Switch the View Toggle to **"Strategy"**.
2.  Select the **"OKRs"** sub-tab.
3.  Click **"Generate with AI"**.
4.  Verify new Objectives and Key Results cards appear.

### B. AI Persona Generation
1.  Select the **"Personas"** sub-tab.
2.  Click **"Generate Personas"**.
3.  Verify 2-3 mock personas appear with avatars.

---

## 6. Billing & Subscription

### A. View Billing Settings
1.  Click your avatar -> **Settings** -> **Billing**.
2.  Verify current plan is "Free".

### B. Upgrade Flow (Requires Keys)
1.  Click **"Upgrade Now"**.
2.  Select **"Pro"** or **"Team"**.
3.  Complete the Flutterwave payment (test mode).
4.  Verify redirection to success page and plan update.

---

## 7. Admin & System

### A. Access Admin Panel
1.  Navigate to `/admin` (requires OWNER role).
2.  Verify you see the Admin Dashboard with system stats.

### B. Check Logs
1.  Navigate to `/admin/logs`.
2.  Verify you see recent system events (e.g., Auth, AI Usage).

---

## Troubleshooting

-   **"Monthly limit reached"**: As an OWNER, you should bypass limits. If testing as a regular user, check the database `AIUsageLog` table.
-   **Empty Spec Generation**: Ensure you have nodes on the canvas before generating a spec. The AI needs context to write the document.
-   **Drag & Drop Not Working**: Ensure you are dragging from the sidebar directly onto the grid area.
