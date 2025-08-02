
#  VISTYO - _AI POWERED SAAS._

_Role-based, context-aware YouTube productivity platform_

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react&style=flat-square)]() [![Vite](https://img.shields.io/badge/Vite-7.0.5-646CFF?logo=vite&style=flat-square)]() [![Appwrite](https://img.shields.io/badge/Appwrite-17.2.0-pink?logo=appwrite&style=flat-square)]() [![Stripe](https://img.shields.io/badge/Stripe-18.3.0-635BFF?logo=stripe&style=flat-square)]() [![Cohere AI](https://img.shields.io/badge/Cohere_AI-Command_r_Plus-red?logo=cohere&logoColor=white&style=flat-square)]()  [![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.1.11-06B6D4?logo=tailwindcss&style=flat-square)]() [![React Hook Form](https://img.shields.io/badge/react--hook--form-7.61.1-FFCC00?style=flat-square)]() [![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.8.2-764ABC?logo=redux&style=flat-square)]() [![Lucide React](https://img.shields.io/badge/lucide--react-0.525.0-000000?style=flat-square)]() [![DOMPurify](https://img.shields.io/badge/DOMPurify-3.2.6-009688?logo=dompurify&logoColor=white&style=flat-square)]() 

## Technical Vision

Vistyo is built with the explicit goal of transforming YouTube from a generalized, engagement-optimized platform into a **role-scoped, task-focused content workflow system**. This transformation is not UI-deep but infrastructural — it includes a **purpose-built database schema** that I designed and modeled to support role-based filtering, access control, and analytics at scale. Layering **contextual filters, server-side plan enforcement, semantic relevance validation, and temporal access trust**, the system delivers a controlled, predictable, and user-intent-respecting experience.

Unlike superficial client-side wrappers, Vistyo enforces its rules where they count — in **backend services and access control layers** — ensuring no amount of client-side state tampering can bypass its gating logic.

The architecture is crafted with:

-   **Service-Oriented Modular Encapsulation**, where all domain logic (roles, plans, history, search) is centralized, making the system highly maintainable and test-friendly.
    
-   **Defensive Authorization Strategies**, preventing unauthorized data mutations and ensuring plan restrictions are immutable from the client.
    
-   **Operational Observability**, integrating telemetry at both infrastructure and code levels to monitor real-world performance, user behaviors, and system bottlenecks.
    
##  Problem & Solution Framing

### **Problem 1 — Irrelevant & Distracting Content**

YouTube’s recommendation engine is optimized for _engagement metrics_, not _user objectives_. For professionals, this creates a constant stream of irrelevant videos, leading to **context loss, productivity collapse, and wasted hours**.

**Solution:** Vistyo introduces **Role Definitions** that bind every search and recommendation to **predefined keywords and channel filters**, keeping results locked to your current task context.



### **Problem 2 — Weak or Superficial Access Control**

Many systems rely on UI-based plan restrictions that can be bypassed with basic client-side manipulations, making feature access **insecure and unreliable**.

**Solution:** Vistyo enforces **Plan-Based Access Control (PBAC)** at the **service layer** and in the **database schema** itself, making unauthorized access **structurally impossible**, regardless of client changes.


### **Problem 3 — Search Hijacking & Query Drift**

Even when a user starts with intent, open-ended search often leads to **irrelevant results and distraction spirals**.

**Solution:** Vistyo applies **Semantic Relevance Filtering** — backed by Cohere AI — to validate queries against the active role’s context, blocking off-topic requests before they even reach YouTube’s API.

### **Problem 4 — Exploitable Feature Privileges**

History tracking, search archives, and other premium-only features are often enforced only in the frontend, leaving them vulnerable to manipulation.

**Solution:** Vistyo integrates **Temporal Trust Windows** and **Backend Access Validation**, ensuring that even time-based privileges are securely tied to plan level, role, and context — enforced entirely server-side.

### **Problem 5— Unstructured & Unsearchable Viewing History**

On YouTube, history is a **flat, unstructured list** with no role association or intelligent filtering. This makes it **impossible to revisit relevant videos in context** after a few days of active use.

**Solution:** Vistyo stores **searches and watch history with role metadata**, enabling **context-aware history recall** and efficient filtering — with cursor-based pagination for scalability.

## System Architecture Overview

### Design Principles Driving Vistyo:

-   **Separation of Concerns (SoC):** UI rendering, application state, business domain logic, and backend infrastructure are decoupled into distinct layers.
    
-   **Backend-Centric Plan Enforcement (PBAC):** Plan checks and access gating are embedded within backend service calls, removing trust from the client layer.
    
-   **Fail-Fast Validation Patterns:** The system immediately exits operations with invalid input, unauthorized state, or missing data integrity.
    
-   **Efficient Data Access Models:** Cursor-based pagination and API request batching ensure scalable interaction with external content sources like YouTube.
    
-   **Security by Design:** Defense-in-depth strategy with input sanitization, API proxying, and strict data validation guards against common attack vectors like XSS or API key leakage.
    

## Architecture Diagram
```
vistyo/
├── public/                                      # Static public assets (custom_font, etc.)
│
├── src/                                         # Source code root
│
│   ├── appwrite/                                # Appwrite service layer abstractions
│   │   ├── auth.js                              # Authentication flows
│   │   ├── client.js                            # Appwrite SDK client instance
│   │   └── Databases.js                         # Plan-aware domain logic (roles, history, filters, checkout)
│   │
│   ├── assets/                                  
│   │   └── Logo.png                             # Static assets (logos etc.)
│   │
│   ├── cohereAI/                                # AI layer (semantic relevance filtering)
│   │   └── queryRelevance.js                    # Functions to validate search relevance contextually
│   │
│   ├── components/                              # Reusable atomic UI components (Cards, Inputs, Buttons)
│   │   ├── Button.jsx                           # Generic button component
│   │   ├── Comment.jsx                          # Comment display component (future scope)
│   │   ├── FeatureCard.jsx                      # Home page feature tiles
│   │   ├── Footer.jsx                           # App Footer UI
│   │   ├── Header.jsx                           # App Header & Navigation bar
│   │   ├── Input.jsx                            # Reusable input field component
│   │   ├── PlanCard.jsx                         # Pricing plan display card
│   │   ├── PublicRoute.jsx                      # Route guard
│   │   ├── RoleCard.jsx                         # Role-specific video cards (channel/keyword scoped)
│   │   └── VideoGrid.jsx                        # Responsive video grid layout
│   │
│   ├── config/                                  
│   │   └── config.js                            # Environment-specific config variables
│   │
│   ├── context/                                 # Global context providers (Theme, UI)
│   │   └── ThemeProvider.jsx                    # Theme switching (light/dark mode)
│   │
│   ├── hooks/                                   # Custom React hooks for business logic orchestration
│   │   └── useAutoSearch.js                     # Auto-trigger search suggestions while typing
│   │
│   ├── pages/                                   # Route-level components (aggregating UI & logic)
│   │   ├── History.jsx                          # User watch history page (plan-gated)
│   │   ├── Home.jsx                             # Landing page
│   │   ├── index.js                             # Central export for page components
│   │   ├── Login.jsx                            # User login form
│   │   ├── NotFound.jsx                         # 404 Not Found fallback page
│   │   ├── Pricing.jsx                          # Pricing plans page
│   │   ├── Roles.jsx                            # Role management (create/edit roles)
│   │   ├── Search.jsx                           # Role-based YouTube search page
│   │   ├── Signup.jsx                           # User registration page
│   │   ├── ThankYou.jsx                         # Post-checkout success confirmation
│   │   └── VideoPlayer.jsx                      # Embedded YouTube player with filters applied
│   │
│   ├── store/                                   # Redux slices for global state management
│   │   ├── authSlice.js                         # Authentication & user metadata slice
│   │   ├── roleSlice.js                         # Role & keyword management slice
│   │   └── videoSlice.js                        # Search results & video state slice
│   │
│   ├── youtube/                                 # YouTube API integration & utilities
│   │   └── ytapi.js                             # Batched fetching, search, autocomplete proxy hooks
│   │
│   ├── App.jsx                                  # Root component; layout scaffolding
│   ├── main.css                                 # Tailwind CSS entry file
│   └── main.jsx                                 # React app bootstrap & Vite mount point
│
├── .env.sample                                  # Example environment config (rename to .env for local use)
├── .gitignore                                   # Git ignored files
├── .prettierrc                                  # Prettier formatting configuration
├── eslint.config.js                             # ESLint configuration for linting standards
├── index.html                                   # HTML entry point (served by Vercel)
├── package.json                                 # Project metadata & dependency tree
├── package-lock.json                            # Exact dependency versions (lockfile)
├── README.md                                    # Project README documentation
├── vercel.json                                  # Vercel deployment config (rewrites, headers, etc.)
└── vite.config.js                               # Vite build & dev server
```

##  Complete Tech Stack Breakdown

**Frontend** 
`React 19` · `Vite 7` · `Tailwind CSS 4` · `react-hook-form` · `lucide-react` · `DOMPurify`

**State & Routing**   
`Redux Toolkit` · `React Redux 9` · `React Router DOM 7`

**Backend (BaaS)**   
`Appwrite Auth` · `Appwrite Databases` · `Appwrite Functions`

**Payments**   
`Stripe Checkout` · `Stripe Webhooks`

**External Data**   
`YouTube Data API v3` · `Suggest API Proxy`

**Observability**   
`@vercel/analytics` · `@vercel/speed-insights`


## Key Engineering Features & Patterns

### 1. **Service-Oriented Backend Encapsulation**

All domain logic, including plan validations, role mutations, history retrievals, and payment orchestration, resides within a centralized `Databases.js` service. This abstraction ensures a clean, predictable API surface and encapsulates business-critical logic away from UI layers.

### 2. **Plan-Based Access Control (PBAC)**

Features such as role creation, history access, search functionalities, and trusted-view privileges are guarded by backend plan validations. This eliminates any possibility of access circumvention via client-side hacks or API misuse.

### 3. **Semantic Context Enforcement**

Roles are scoped with channel filters and keywords to maintain content relevance. An optional AI-powered relevance validator ensures user queries align with their defined roles, effectively eliminating off-topic distractions.

### 4. **Trusted-View Temporal Logic**

A trusted-view window of 10 minutes is enforced for users, ensuring the YouTube API cannot be abused through URL manipulation. Only users who have genuinely clicked to play the video are allowed to continue watching.

### 5. **Cursor Pagination & API Request Batching**

To optimize API usage and handle large datasets (history, search listings), the system employs cursor-based pagination combined with batched YouTube API requests, improving both UX and performance under API rate limits.

### 6. **Defensive Coding & Data Integrity**

-   Duplicate Role Prevention (case-insensitive match)
    
-   Cascade Deletion: Deleting a role automatically cleans up its associated keywords and filters.
    
-   Parallel State Fetching: Uses `Promise.all` to resolve plan state, roles, and filters efficiently in parallel.
    
-   Robust Input Validation: All service calls validate user state, plan, and data integrity upfront.
    

### 7. **XSS Mitigation & Content Safety**

Before rendering any dynamic HTML content fetched externally (e.g., YouTube titles, descriptions, User's inputs), DOMPurify sanitizes it to ensure no XSS vulnerabilities exist, upholding security best practices.

### 8. **Observability & Developer Experience**

Vistyo is instrumented with Vercel's observability suite (`@vercel/analytics`, `@vercel/speed-insights`) alongside a development pipeline enriched with ESLint, Prettier, and Tailwind CSS plugins, ensuring both code quality and real-world performance tracking.


##  Appwrite Functions (Serverless Microservices)

**Create Checkout Session**

Initiates a Stripe Checkout Session after verifying user identity, current plan, and selected upgrade plan. Embeds user metadata (userId, planType, contact email) and returns a safe session URL.

**Stripe Webhook Handler**

Listens to subscription lifecycle events from Stripe, reconciles plan state in Appwrite DB, and handles upgrades, downgrades, and cancellations. Implements signature verification to ensure webhook authenticity.

**Google Suggestions API**

Proxies Google's Suggest API to handle CORS, sanitize inputs, and abstract API key exposure away from the client. Normalizes output for frontend consumption.




##  Development Scripts

```bash
npm run dev       # Runs local development server with hot-reload via Vite
npm run build     # Builds production-ready optimized assets
npm run preview   # Previews the production build locally
npm run lint      # Runs ESLint checks to maintain code quality and consistency
```

## Deployment Strategy & Infrastructure Details


**Hosting Platform**

Vercel — Edge-optimized static delivery with CDN-backed caching and CI/CD integration

**Backend Execution**

Appwrite Functions serve business-critical logic, Stripe webhooks, and API proxying workflows

**Observability Tools**

Real User Monitoring  via Vercel Analytics and performance diagnostics through Speed Insights

**CI/CD Compatibility**

Tailwind/Vite build scripts designed for seamless environment separation and branch preview workflows

## Highlights

-   Architected and implemented a **service-layer PBAC enforcement system**, ensuring plan-based feature restrictions are unbypassable from the frontend.
    
-   Designed a **semantic filtering mechanism** for query validation, with optional AI-based relevance models for context preservation.
    
-   Engineered a **trusted-view temporal access logic**, providing tiered content access windows without compromising on plan integrity.
    
-   Developed **Stripe billing orchestration**, integrating lifecycle events through secure webhook reconciliation.
    
-   Optimized content workflows with **cursor-based pagination and batch API handling** for high-volume YouTube data.
    
-   Enforced **XSS-safe rendering practices** using DOMPurify across all dynamic content render paths.
    
-   Embedded **observability and telemetry** directly into infrastructure using Vercel’s analytics suite and structured logging strategies.
    
-   Maintained robust **Developer Experience (DX)** through a well-instrumented development pipeline featuring linting, formatting, and build automation.
    
Here's a professional revision with distinct headings and concise content:

## Implementation Guide

### System Requirements
- **Node.js** 18+
- **Appwrite** project (Auth + Database + Functions)
- **Stripe** account with active Price IDs
- **YouTube Data API** key
- **Cohere API** key

### Dependency Installation
```bash
git clone https://github.com/ParthAhuja4/vistyo.git
cd vistyo
npm install
```

### Environment Configuration
Configure with your credentials using .env.sample

### Local Execution
```bash
npm run dev  # Starts development server with hot reload
```
###  Production Build
```bash
npm run build    # Create optimized build
npm run preview  # Test production build locally
```

### Code Validation
```bash
npm run lint  # Execute ESLint for standards compliance
```

###  Appwrite Functions Deployment
Deploy these core functions with environment variables:
1. `create-checkout-session` (Stripe integration)
2. `stripe-webhook` (Subscription lifecycle)
3. `autocomplete` (YouTube Suggest API proxy)

## Contact

**Developer:** Parth Ahuja  
**GitHub:** [@ParthAhuja4](https://github.com/ParthAhuja4)  
**Email:** [parthahuja006@gmail.com](mailto:parthahuja006@gmail.com)
**Linked In:** [Parth Ahuja](https://www.linkedin.com/in/parthahuja4/)
