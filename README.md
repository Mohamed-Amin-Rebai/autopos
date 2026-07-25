# 🚀 AutoPOS

### AI-Powered POS Generator, Manager & Cashier Management Platform

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-green)
![Prisma](https://img.shields.io/badge/Prisma-2D3748)
![Clerk](https://img.shields.io/badge/Auth-Clerk-purple)
![Gemini](https://img.shields.io/badge/AI-Gemini-orange)

AutoPOS is an AI-powered SaaS platform that enables users to generate, customize, manage and operate fully functional Point of Sale (POS) systems using natural language.

The platform combines:

- 🤖 AI POS Generation
- 💬 Conversational POS Editing
- 👨‍💼 Cashier Management
- 📊 Analytics & Reporting
- 🔔 Notification System
- 🧾 Smart Receipt Generation
- 🔐 Authentication & Role-Based Access Control
- ⚡ Dynamic Real-Time Interfaces

into one complete end-to-end business management solution.

---

# ✨ Key Features

## 🧠 AI POS Generation

Generate complete POS systems from simple prompts.

Examples:

```text
tech store
restaurant POS system
electronics store
clothing shop with sizes
coffee shop management system
```

The AI automatically creates:

- Products
- Categories
- Attributes
- Pricing
- Inventory Structure
- Business Metadata

All generated in structured JSON format.

---

## 🔀 Dual POS Modes

### Categorized Mode

Perfect for stores with large inventories.

Features:

- Category sidebar
- Organized product display
- Better navigation

Examples:

- Electronics Stores
- Clothing Shops
- Supermarkets

---

### Flat Mode

Perfect for small businesses.

Features:

- Single product list
- No category management
- Faster checkout workflow

Examples:

- Cafés
- Snacks
- Small Shops

---

# 💬 Conversational Editing

Modify an existing POS using natural language.

Examples:

```text
Add product keyboard
Remove category Accessories
Change Laptop Pro price to 4200
Add product image support
```

Workflow:

```text
User Request
      ↓
AI Planning
      ↓
User Confirmation
      ↓
Database Update
      ↓
UI Refresh
```

This ensures that business data is never modified accidentally.

---

# 🧾 POS Version History

Track all modifications performed on a POS.

Features:

- Snapshot-based history
- Historical versions
- Restore previous versions
- Audit trail of AI modifications

---

# 🖼️ Product Image Support

Products can contain images.

Features:

- Custom uploads
- Dynamic rendering
- Integrated product cards

---

# 📤 POS Export

Export generated POS systems as JSON.

Benefits:

- Portability
- Backup
- Reusability
- Migration support

---

# 👤 Authentication System

## Clerk Authentication

Secure authentication using Clerk.

Supported methods:

- Email Login
- Google OAuth
- Session Management
- Protected Routes

---

## User Synchronization

Each authenticated user is automatically synced into MongoDB.

Stored fields include:

```text
clerkId
email
role
```

---

# 🛡️ Role Based Access Control (RBAC)

## 👤 User

Can:

- Generate POS systems
- Edit POS systems
- Save POS systems
- Access personal dashboard

---

## 👨‍💼 Manager

Can:

- Manage POS systems
- Request cashiers
- Access analytics
- Receive notifications
- Manage assigned cashiers

---

## 👑 Admin

Can:

- Access admin dashboard
- View all users
- View all POS systems
- Approve cashier requests
- Reject cashier requests
- Manage all platform orders

---

## 💼 Cashier

Can:

- Login through dedicated cashier portal
- Process customer orders
- Manage cart operations
- Generate receipts
- Perform checkout operations

---

# 👨‍💼 Cashier Management System

## Cashier Requests Workflow

Managers can request new cashiers directly from the platform.

Workflow:

```text
Manager
    ↓
Cashier Request
    ↓
Admin Review
    ↓
Approve / Reject
    ↓
Credentials Generated
```

---

## Cashier Configuration

Each cashier can be configured with:

- Opening Cash
- Shift Start Time
- Shift End Time
- Active / Disabled Status
- IP Restriction

---

## Secure Cashier Authentication

Each approved cashier receives:

- Unique username
- Secure password
- Dedicated access URL

Protected using:

- Session Cookies
- Expiration Validation
- POS Ownership Checks

---

# 💳 Checkout System

Features:

- Product Cart
- Quantity Management
- Discounts
- Multiple Payment Options
- Order Creation

---

## Order Status

Orders can be:

```text
Pending
Paid
```

---

## Idempotency Protection

Duplicate payment submissions are prevented using idempotency keys.

Benefits:

- No duplicate orders
- No duplicate receipts
- Safe retry behavior

---

# 🧾 Receipt System

Professional receipt generation after checkout.

Contains:

- Receipt Number
- Products Purchased
- Payment Method
- Cashier Information
- Timestamp
- Totals

Features:

- Dedicated receipt page
- Secure receipt access
- Print support

---

# 🔔 Notification System

Managers receive real-time notifications for important actions.

Examples:

- Cashier request approval
- Cashier request rejection
- Administrative actions

Features:

- Unread badge counter
- Read status tracking
- In-app notification center

---

# 📊 Analytics Dashboard

Each POS system includes analytics reporting.

Metrics include:

### Revenue Analytics

- Total Revenue
- Daily Revenue
- Revenue Trends

### Order Analytics

- Total Orders
- Average Order Value
- Order Statistics

### Product Analytics

- Top Selling Products
- Product Revenue

### Category Analytics

- Top Categories
- Category Revenue

### Cashier Analytics

- Cashier Revenue
- Orders per Cashier
- Average Order per Cashier

### Activity Analytics

- Busiest Hours
- Usage Patterns

---

# 👤 User Dashboard

Users can:

- View all POS systems
- See revenue
- Review orders
- Monitor active cashiers
- Access management tools

---

# 👑 Admin Dashboard

Administrators can:

- View platform users
- Access POS systems
- Review orders
- Approve requests
- Reject requests
- Monitor platform activity

---

# 🔒 Security Features

## Authentication

- Clerk Authentication
- Protected Routes
- Session Validation

---

## Authorization

- Role Based Access Control
- Admin-Only Endpoints
- Manager Restrictions

---

## Cashier Security

- Session Management
- Route Protection
- IP Restrictions
- Shift Scheduling

---

## Payment Security

- Idempotency Keys
- Order Validation
- Receipt Protection

---

# 🧱 Technology Stack

## Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Lucide Icons

---

## Backend

- Next.js API Routes
- Prisma ORM
- MongoDB Atlas

---

## Authentication

- Clerk

---

## AI Layer

- Google Gemini AI

Used for:

- POS Generation
- POS Planning
- POS Modification
- Controlled Updates

---

# 🧠 System Architecture

```text
Frontend (Next.js)
        ↓
Protected Pages
        ↓
API Routes
        ↓
RBAC Layer
        ↓
Prisma ORM
        ↓
MongoDB

        ↓

Gemini AI
(POS Generation & Editing)

        ↓

Dynamic POS UI
Analytics
Cashier System
Orders
Receipts
Notifications
```

---

# 🔄 Data Flow

## POS Generation

```text
Prompt
   ↓
Gemini AI
   ↓
Structured POS JSON
   ↓
Database
   ↓
UI Rendering
```

---

## POS Editing

```text
User Instruction
      ↓
AI Planning
      ↓
Confirmation
      ↓
Database Update
      ↓
UI Refresh
```

---

## Cashier Workflow

```text
Manager Request
      ↓
Admin Review
      ↓
Approval
      ↓
Credentials Generation
      ↓
Cashier Access
```

---

# 📊 Example POS Model

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

# 🚀 Installation

## Clone Project

```bash
git clone https://github.com/Mohamed-Amin-Rebai/autopos.git
cd autopos
```

## Install Dependencies

```bash
npm install
```

## Configure Environment

```env
DATABASE_URL=

GEMINI_API_KEY=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

## Generate Prisma Client

```bash
npx prisma generate
```

## Start Development Server

```bash
npm run dev
```

---

# 🐳 Docker

Build and run using Docker:

```bash
docker compose up --build
```

---

# ☁️ Deployment

- Frontend → Vercel
- Database → MongoDB Atlas
- Authentication → Clerk
- AI → Gemini

---

# 👨‍💻 Author

## Mohamed Amin Rebai

Software Engineering Student

Full-Stack Developer • AI Systems Builder

---

⭐ If you found this project interesting, consider starring the repository.