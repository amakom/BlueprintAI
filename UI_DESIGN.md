# BlueprintAI UI Design System

## 1. Core Visual Identity

**Philosophy**: "Bold Clarity." High contrast, purposeful use of color, distraction-free creative spaces.

### Color Palette
- **Navy (Primary)**: `#0B1F33` - Used for sidebar, headers, primary text, and active states.
- **Cyan (Accent/Brand)**: `#2EE6D6` - Used for primary actions, active highlights, and AI indicators.
- **Cloud (Background)**: `#F6F8FB` - Used for the main canvas background and panel backgrounds.
- **Amber (Warning/Attention)**: `#FFB703` - Used for alerts, comments, and "beta" features.
- **White**: `#FFFFFF` - Cards, inputs, and content surfaces.

### Typography
- **Font**: Inter (Clean, legible, variable weight).
- **Headings**: Bold, tight tracking.
- **UI Text**: Medium weight for readability.

---

## 2. Layout Structure

The application follows a **3-Column Layout** for the main workspace:

1.  **Left Sidebar (Navigation & Context)**
    *   **Width**: 240px (Collapsible).
    *   **Content**: Team switcher, Global Nav (Home, Projects, Settings), Project Tree (Documents, Flows).
    *   **Style**: Navy background, White/Grey text. High contrast to separate "navigation" from "work".

2.  **Center Stage (Infinite Canvas / Editor)**
    *   **Width**: Flexible (flex-1).
    *   **Content**: The active document (PRD text editor or Visual Flow canvas).
    *   **Style**: Cloud background. Floating toolbar at the bottom center.

3.  **Right Panel (AI Assistant & Properties)**
    *   **Width**: 300px (Collapsible).
    *   **Content**: Chat interface for "BlueprintAI", properties panel for selected items.
    *   **Style**: White background with soft border.

---

## 3. Component List

### Atoms
- **Button**: 
  - `Primary`: Cyan background, Navy text (Bold).
  - `Secondary`: White background, Navy border.
  - `Ghost`: Transparent, Navy text.
- **Icon**: Lucid React icons (Stroke width 2px).
- **Badge**: Rounded pill shape, used for status (Draft, Review, Approved).

### Molecules
- **NavItem**: Icon + Label. Hover state: slight opacity change or Cyan highlight.
- **UserCard**: Avatar + Name + Role.
- **ProjectCard**: Thumbnail + Title + Last Edited + Team.

### Organisms
- **GlobalSidebar**: The main navigation container.
- **CanvasToolbar**: Floating action bar (Select, Text, Shape, AI Generate).
- **AIChatPanel**: Message list + Input area with "Generate" actions.

---

## 4. UX Rationale

1.  **Separation of Concerns**: 
    - Dark Sidebar = "Where am I?" 
    - Light Canvas = "What am I doing?" 
    - Right Panel = "Help me do it."
    
2.  **Infinite Canvas First**: 
    - Traditional PRDs are linear. BlueprintAI starts visual. The infinite canvas encourages non-linear thinking before locking down specs.

3.  **Contextual AI**: 
    - The AI panel is not a modal; it lives *alongside* the work. Users can drag generated content from the chat directly onto the canvas.

4.  **Bold vs. Minimal**: 
    - We use bold colors (Navy/Cyan) for structure and navigation, but keep the actual workspace (Canvas) minimal to avoid visual noise.
