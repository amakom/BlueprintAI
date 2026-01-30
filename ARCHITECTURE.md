# BlueprintAI Product Architecture

## 1. High-Level Architecture

BlueprintAI follows a modern **Monorepo-style Modular Architecture** within a Next.js application.

```mermaid
graph TD
    Client[Client Browser]
    CDN[Vercel Edge Network]
    
    subgraph "Next.js App (Server & Client)"
        Auth[Auth Service (NextAuth)]
        API[API Routes / Server Actions]
        SSR[Server Side Rendering]
        RSC[React Server Components]
    end
    
    subgraph "Data & Services"
        DB[(PostgreSQL - Prisma)]
        Cache[(Redis / KV)]
        AI[AI Service Adapter]
        Storage[Object Storage (S3/R2)]
        Pay[Stripe Payment]
    end
    
    subgraph "External Providers"
        OpenAI[OpenAI API]
        Anthropic[Anthropic API]
    end

    Client --> CDN --> SSR
    Client -- "Interactivity" --> RSC
    RSC -- "Data Fetch" --> DB
    RSC -- "GenAI" --> AI
    AI --> OpenAI
    AI --> Anthropic
    API --> DB
    API --> Pay
```

### Core Components
- **Frontend**: Next.js 15+ (App Router), Tailwind CSS, Shadcn UI, React Flow (for diagrams), Tiptap/ProseMirror (for rich text).
- **Backend**: Next.js Server Actions for mutations, Route Handlers for webhooks/streaming.
- **Database**: PostgreSQL managed via Prisma ORM.
- **Real-time**: WebSocket layer (e.g., Pusher or PartyKit) for collaborative editing.
- **AI Engine**: Abstraction layer handling prompt engineering, context management, and provider switching (OpenAI/Anthropic).

---

## 2. Folder Structure

We use a **Feature-based** folder structure to ensure scalability and maintainability.

```
app/
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router (Pages & Layouts)
│   │   ├── (auth)/         # Auth routes (login, register)
│   │   ├── (dashboard)/    # App dashboard routes
│   │   │   ├── projects/
│   │   │   ├── [teamSlug]/
│   │   ├── api/            # API Route Handlers (webhooks, etc.)
│   │   └── page.tsx        # Landing page
│   ├── components/         # Shared UI components
│   │   ├── ui/             # Design system (buttons, inputs)
│   │   ├── layout/         # Header, Sidebar
│   ├── features/           # Feature-specific logic
│   │   ├── auth/           # Auth components & hooks
│   │   ├── editor/         # PRD Editor logic
│   │   ├── canvas/         # Visual flow logic
│   │   ├── ai/             # AI generation services
│   │   └── billing/        # Stripe integration
│   ├── lib/                # Core utilities
│   │   ├── prisma.ts       # DB client
│   │   ├── utils.ts        # Helper functions
│   │   └── ai-client.ts    # AI provider setup
│   ├── types/              # TypeScript definitions
│   └── styles/             # Global styles
```

---

## 3. Key Entities & Relationships

### Users & Teams (RBAC)
- **User**: Global identity.
- **Team**: The billing unit and workspace. Users belong to Teams via `TeamMember`.
- **Role**: `OWNER`, `ADMIN`, `EDITOR`, `VIEWER`.

### Projects & Content
- **Project**: Container for PRDs and flows. Belongs to a Team.
- **Document**: The core artifact. Can be of type `PRD` (text-heavy) or `FLOW` (visual).
- **Block/Content**: The actual data. Stored as structured JSON to support rich text and canvas nodes.
- **Comment**: Anchored to specific blocks or coordinates in a document.

### AI & Versioning
- **GenerationLog**: Audit trail of AI usage (prompts/outputs) for billing and debugging.
- **Version**: Snapshot of a Document at a point in time.

---

## 4. Scalability Considerations

### Database
- **Indexing**: Heavy indexing on `teamId` and `projectId` for multi-tenancy isolation.
- **Connection Pooling**: Use Prisma Accelerate or PgBouncer for serverless environments.

### Performance
- **RSC (React Server Components)**: Minimize client bundle size by rendering non-interactive content on the server.
- **Optimistic UI**: Immediate feedback for user actions (e.g., creating a block) while saving in the background.
- **Streaming**: AI responses are streamed to the client to reduce perceived latency.

### Collaboration
- **CRDTs (Conflict-free Replicated Data Types)**: (Future) For real-time simultaneous editing (using Yjs).
- **Granular Locking**: (MVP) Optimistic locking or block-level locking to prevent overwrites.

### AI Cost Management
- **Token Usage Tracking**: Log input/output tokens per Team to enforce quotas.
- **Caching**: Cache common AI responses (e.g., "Explain this technical term") using Redis.
