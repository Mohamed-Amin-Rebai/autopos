# 🚀 AutoPOS

### AI-Powered POS Generator & Editor

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Green)
![Prisma](https://img.shields.io/badge/Prisma-2D3748)
![Clerk](https://img.shields.io/badge/Auth-Clerk-purple)
![Gemini](https://img.shields.io/badge/AI-Gemini-orange)

AutoPOS is an AI-powered SaaS platform that enables users to generate, customize, and manage fully functional Point of Sale (POS) systems using natural language.

The platform combines:

* 🤖 AI Generation
* 💬 Conversational Editing
* 🔐 Authentication & RBAC
* 📊 Analytics Dashboards
* ⚡ Real-Time Updates
* 🧾 Version History

into one complete end-to-end solution.

---

# ✨ Core Features

## 🧠 AI POS Generation

Generate complete POS systems from simple prompts:

```text
tech store
restaurant POS
clothing shop with sizes
electronics store with categories
```

The AI automatically creates:

* Products
* Categories
* Business attributes
* Structured JSON data

---

## 🔀 Dual POS Modes

### Categorized Mode

* Products grouped by categories
* Sidebar navigation
* Better for large inventories

### Flat Mode

* Single unified product list
* No categories required
* Faster workflow for small businesses

> POS structure is automatically determined from the user's prompt.

---

## 💬 Conversational Editing

Modify an existing POS using natural language:

```text
add product keyboard
remove category Accessories
change price of Laptop Pro
```

No manual configuration required.

---

## ✅ Safe Confirmation Workflow

Every AI action is reviewed before execution.

```text
User Request
      ↓
AI Plan
      ↓
User Confirmation
      ↓
Database Update
      ↓
UI Refresh
```

This prevents unwanted modifications.

---

### 🧾 Version History
- Track POS changes over time
- Restore previous versions
- Stored in database with history snapshots

---

### ⚡ Real-Time UI Updates
- Instant frontend updates based on JSON state
- Fully data-driven POS UI

---

### 🖼️ Image Support
- Upload custom:
  - Product images
- Dynamically rendered in UI

---

### 📤 Export Functionality
- Export POS configuration as JSON
- Reusable and portable

---

## 👤 Authentication & Users

### 🔐 Clerk Authentication
- Secure login & signup
- Google OAuth support
- Session & user management handled by Clerk

---

### 🧑 User Database Sync
- Each Clerk user is synced to your database
- Stored with:
  - `clerkId`
  - `email`
  - `role`

---

### 🛡️ Role-Based Access (RBAC)

- **User**
  - Can create and manage their own POS
  - Access personal dashboard

- **Admin**
  - Access all users
  - View all POS systems
  - Manage all orders

---

## 📊 Dashboard System

### 👤 User Dashboard
- View all owned POS systems
- See:
  - Order count
  - Revenue
- Open POS instantly

---

### 👑 Admin Dashboard
- View all users
- Explore each user’s POS systems
- Inspect orders per POS
- Mark orders as paid

---

## 💳 Payment Logic

- Orders can be:
  - ✅ Paid
  - ⏳ Pending

- Admin can:

Mark pending → paid

- UI updates instantly (no reload)

---

## 🔒 API Security

- Protected routes using Clerk middleware
- Admin-only endpoints secured:
  - `/api/orders/update`
  - `/api/users`

- Unauthorized users cannot:
  - Modify order status
  - Access admin data

---

## 🧱 Tech Stack

### Frontend
- **Next.js (App Router)**
- React (Client & Server Components)
- Tailwind CSS
- TypeScript

---

### Backend
- Next.js API Routes
- Prisma ORM
- MongoDB

---

### AI Layer
- Gemini AI (Google Generative AI)
- Prompt engineering for:
  - Generation
  - Planning
  - Controlled updates

---

### Auth
- Clerk (Authentication & Sessions)

---

## 🧠 Architecture


Frontend (Next.js App Router)
↓
API Routes (Server)
↓
Clerk Auth + Prisma DB
↓
Gemini AI (LLM)
↓
Structured JSON (POS Data)
↓
Dynamic UI Rendering

---

## 🔄 Data Flow

### Generation

Prompt → AI → JSON → DB → UI

### Editing

Instruction → AI Plan → Confirm → Update → UI

### Orders

User action → API → DB → Dashboard

---

## 📊 Example Data Model

```json
{
  "categories": ["Computers", "Accessories"],
  "products": [
    {
      "id": 1,
      "name": "Laptop Pro 15",
      "price": 3500,
      "category": "Computers",
      "attributes": {
        "RAM": "16GB",
        "Storage": "512GB SSD"
      }
    }
  ]
}
```

---

## 🚀 Getting Started

1. Clone
git clone https://github.com/your-username/autopos.git
cd autopos

2. Install
npm install

3. Environment
GEMINI_API_KEY=your_api_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...`

4. Run
npm run dev

---

## 💡 Example Prompts

```text
tech store
restaurant POS system
clothing shop with sizes
electronics store with categories
flat POS no categories
```

---

## ☁️ Deployment

- Frontend: Vercel
- Database: MongoDB Atlas
- Authentication: Clerk
- AI: Gemini

---

## 👨‍💻 Author

**Mohamed Amin Rebai**

Software Engineering Student  
Full-Stack Developer  
AI Systems Builder

⭐ If you found this project interesting, consider starring the repository.