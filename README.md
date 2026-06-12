# support-crm — Production Help Desk Ticketing CRM System

An elegant, high-contrast, production-ready **Full-Stack customer support ticketing CRM system** built to handle ticket lifecycle management, sequential ticket ID sequencing, real-time database indexing, search queries, filter states, and internal diagnostic auditing logs.

The platform executes inside a synchronized **Node Express API server + Vite React front-facing SPA engine** on Port 3000, with persistent cloud storage backed by **MongoDB Atlas** database tables via **Mongoose**.

---

## 🎨 Design Theme & Core Paradigms
- **Typography Selection**: Loaded with elegant **Inter** sans-serif font for professional, scannable SaaS content paired with **JetBrains Mono** for structural ticket identifiers (`TKT-001`, `TKT-002`).
- **SaaS Layout**: Utilizing a vibrant **Indigo and Blue color palette**, with high-contrast text sizing, rounded cards, fluid responsive grids, hover indicators, and custom micro-animations.
- **Architectural Honesty**: True professional design without telemetry simulation or artificial terminal lines. All labels are human-friendly and functional.

---

## 🚀 Key Feature Modules

1. **Auto-Sequencing Ticket Generator**: Ensures every ticket opening gets matched with a sequential identifier (e.g. `TKT-001`, `TKT-008`), counting active cluster records safely.
2. **Support Operations command**: Dashboard cards calculate status counts (Total, Open, In Progress, Closed) live, doubling as filter triggers.
3. **Multi-Scope Search bar**: Enables instant search-as-you-type filtering running across `ticketId`, `customerName`, `customerEmail`, `subject`, and `description`.
4. **Diagnostic Escalation Logs**: Supports appending support logs and notes inside nested MongoDB ticket objects while enabling support engineers to modify case status.

---

## 📁 Project Architecture & Components

```
/
├── .env.example            # Environment variables setup template
├── .gitignore              # Version controls exclude lists
├── package.json            # Node scripts & dependencies configurations
├── server.ts               # Express full-stack API router and static assets engine
│
└── src/
    ├── App.tsx             # Client-side soft navigation router root
    ├── index.css           # Global typography, layers, and animations configuration
    ├── main.tsx            # React application renderer root
    │
    ├── lib/
    │   └── mongodb.ts      # Lazy-loaded cached connection manager for MongoDB
    │
    ├── models/
    │   └── Ticket.ts       # Mongoose ticket database model schema
    │
    ├── components/
    │   ├── Navbar.tsx      # System header with branding and action routes
    │   ├── DashboardCards.tsx # Statistics counters matching status segments
    │   ├── SearchBar.tsx   # Magnified search entry box with inline clearing triggers
    │   ├── StatusFilter.tsx # Status selection drop-downs
    │   ├── TicketTable.tsx # Polished table grid with rows and action triggers
    │   ├── StatusBadge.tsx # Custom color-badge mapping helper
    │   ├── LoadingSpinner.tsx # Rotating spinning elements & skeleton loaders
    │   └── EmptyState.tsx  # Dynamic zero-state vectors
    │
    └── pages/
        ├── DashboardView.tsx # Dashboard command view
        ├── CreateTicketView.tsx # Client case submit forms with email verification
        └── TicketDetailView.tsx # Core case manager view with updating logs
```

---

## 🏗️ Local Development Setup

To compile and launch the ticket CRM on your local workstation, run the following steps:

### 1. Retrieve & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Parameters
Create a file named `.env` or `.env.local` inside the workspace root folder:
```env
# MongoDB Atlas Database connection URI
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/support_crm?retryWrites=true&w=majority"
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to operate inside your browser.

---

## 🌐 Complete API Reference Guides

| Endpoint | Method | Parameters / Body Schema | Functional Utility |
|:---|:---|:---|:---|
| `/api/tickets` | **GET** | `status` (string, optional)<br>`search` (string, optional) | Fetches tickets matching status search parameter logs. |
| `/api/tickets` | **POST** | `{ customerName, customerEmail, subject, description }` | Saves a new customer support ticket to Atlas and returns the assigned ID. |
| `/api/tickets/:ticketId` | **GET** | URL Path variable | Retrieves complete descriptive ticket details, timeline, and staff note cards. |
| `/api/tickets/:ticketId` | **PUT** | `{ status, noteText? }` | Transitions ticket state and appends optional staff diagnostics. |

---

## ☁️ Vercel Deployment Instructions

### Step 1: Prepare Server Entry (Optional `vercel.json` Setup)
Vercel allows hosting full-stack Express applications. Create a `vercel.json` configuration file at the server root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.cjs",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "dist/server.cjs"
    },
    {
      "src": "/(.*)",
      "dest": "$1"
    }
  ]
}
```

### Step 2: Push to Git Host
Initialize git, commit all directories, and upload to your private GitHub/GitLab repository:
```bash
git init
git add .
git commit -m "feat: complete support-crm Ticketing platform"
```

### Step 3: Configure Vercel Dashboard
1. Select "Import Project" on your Vercel Dashboard.
2. Link your Git repository.
3. In the **Environment Variables** segment, configure:
   - `MONGODB_URI`: `<Your MongoDB Cluster connection string>`
4. Click **Deploy**. Vercel will build the frontend assets, set up cloud serverless functions on `/api/*`, and serve the CRM to users instantly!
