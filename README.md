# 🚀 AutoPOS — AI-Powered POS Generator & Editor

AutoPOS is an intelligent web application that allows users to generate a fully functional Point of Sale (POS) system from a simple text description, and then dynamically modify it in real-time using an AI assistant.

It combines AI generation, structured data modeling, dynamic UI rendering, and conversational interaction into a single powerful platform.

---

## ✨ Features

### 🧠 AI POS Generation
- Generate a complete POS system using natural language
- Supports multiple business types (tech, food, clothing, etc.)
- Automatically structures:
  - Products
  - Categories
  - Business-specific attributes

---

### 🔀 Dual Mode System
AutoPOS supports two structural modes:

- **Categorized Mode:**
  - Products grouped by categories
  - Sidebar navigation

- **Flat Mode:**
  - No categories
  - All products displayed in one unified list

> Mode is determined dynamically based on the user prompt.

---

### 💬 AI Assistant (Conversational Editing)
- Modify the POS system through natural language
- Example commands:
  - `add product keyboard`
  - `remove category Accessories`
  - `change price of Laptop Pro`

---

### ✅ Confirmation System
- Every AI action is previewed before execution
- Safe modifications through:
    AI → plan → user confirmation → execution

---

### 🧾 Version History System
- Automatically saves each valid POS state
- View history of changes
- Select a version and restore it manually

---

### ⚡ Real-Time UI Updates
- UI updates instantly based on AI-modified JSON
- Fully data-driven frontend architecture

---

### 🖼️ Image Support
- Upload:
- Logo
- Product images
- Dynamically rendered in UI

---

### 📤 Export Functionality
- Export current POS as JSON
- Reusable configuration for other systems

---

## 🧱 Tech Stack

### Frontend
- **Next.js (React)**
- Tailwind CSS
- TypeScript

---

### Backend
- Next.js API routes
- Gemini AI (Google Generative AI)

---

### AI Layer
- Prompt engineering for:
- Generation
- Planning
- Controlled updates

---

## 🧠 System Architecture
Frontend (React / Next.js)
↓
API Routes (/generate, /plan-pos, /update-pos)
↓
Gemini AI (LLM)
↓
Structured JSON (POS Data)
↓
Dynamic UI Rendering

---

## 🔄 Data Flow

### Generation
User Prompt → AI → Structured JSON → UI Render

### Editing
User Instruction
→ AI Plan
→ User Confirmation
→ AI Update
→ New JSON
→ UI Update

---

## 📊 Data Model

Example:

```json
{
  "logo": "Tech Store",
  "categories": ["Computers", "Accessories"],
  "products": [
    {
      "id": 1,
      "name": "Laptop Pro 15",
      "price": 3500,
      "category": "Computers",
      "brand": "TechBrand",
      "attributes": {
        "RAM": "16GB",
        "Storage": "512GB SSD"
      }
    }
  ],
  "actions": ["add_to_cart", "apply_discount", "checkout"]
}

## ⚠️ Current Limitations

While AutoPOS provides a powerful AI-driven POS generation experience, there are a few current limitations:

* AI-generated content may occasionally misinterpret ambiguous or vague instructions
* Best results are achieved with clear and specific prompts
* Data persistence is currently limited to browser storage (localStorage)
* Generated POS systems are intended for prototyping and demonstration purposes
* No authentication or multi-user collaboration support yet

---

## 🔮 Roadmap

Planned improvements for future versions include:


### 🧠 AI Improvements

* Better intent recognition
* More accurate modification planning
* Context-aware business customization

### 👤 User Management

* User authentication
* Project saving and loading
* Cloud synchronization

### 💳 Business Features

* Stripe payment integration
* Inventory management
* Sales analytics and reporting

### 🎨 Customization

* Theme generation based on business type
* Custom branding options
* Advanced layout customization

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/autopos.git
cd autopos
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_api_key_here
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Open the Application

Navigate to:

```text
http://localhost:3000
```

---

## 💡 Example Prompts

Try generating POS systems with prompts such as:

* `tech store`
* `restaurant POS system`
* `clothing shop with sizes`
* `electronics store with categories`
* `tech store without categories`

---

## 👨‍💻 Author

**Mohamed Amin Rebai**

Software Engineering Student | Full-Stack Developer | AI Enthusiast

Built with Next.js, TypeScript, Tailwind CSS, and Gemini AI.
