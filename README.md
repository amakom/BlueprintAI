# BlueprintAI

BlueprintAI is an AI-augmented visual PRD and product design platform. It combines PRD creation, visual canvases, user flows, and AI-assisted specs into a single, cohesive tool.

## Core Principles
- **Visual & Intuitive**: Design-first approach to product requirements.
- **Clean & Modern**: Bold UI inspired by top-tier creative tools.
- **AI-First**: AI assists but the user remains in control.
- **Production-Ready**: built on a scalable, modern stack.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Payments**: Stripe (Integration planned)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   - Configure `DATABASE_URL` in `.env`
   - Configure `OWNER_EMAIL` in `.env` (Optional: for Admin access)
   - Run migrations: `npx prisma migrate dev`

3. Run the development server:
   ```bash
   npm run dev
   ```

## Features
- **Visual Canvas**: Interactive user flow diagramming with drag-and-drop component library.
  - **Design Tools**: Figma-like interface with Frames (Mobile, Web), Image Uploads, and Custom Styling.
- **Strategy Dashboard**: Track OKRs, Personas, and Competitors with AI generation.
- **Engineering Specs**: AI-generated technical specifications based on your visual flows.
- **Role-Based Access**: Granular permissions for Owners, Team Members, and Viewers.
- **Billing System**: Integrated subscription management (Free, Pro, Team) via Flutterwave.
- **Admin System**: Comprehensive dashboard for system monitoring and user management.

