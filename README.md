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

---

## ⚠️ Limitations

- AI responses may occasionally misinterpret vague instructions  
- Requires clear and precise command phrasing for best results  
- No persistent database (data stored in memory / localStorage only)  

---

## 🔮 Future Improvements

- 🔁 Undo & redo system  
- 🔍 Visual difference (diff) between versions  
- 🧠 Improved AI intent detection  
- 👤 User accounts & project persistence  
- 💳 Payment integration (Stripe)  
- 🎨 UI theming based on business type  

---

## 🚀 Getting Started


1. Clone the repository
git clone https://github.com/your-username/autopos.git

2. Install dependencies
npm install

3. Setup environment variables
Create: .env.local

Add:
GEMINI_API_KEY=your_api_key_here

4. Run the app
npm run dev

💡 Example Prompts
tech store
restaurant POS system
clothing shop with sizes
tech store without categories

👨‍💻 Author
Mohamed Amin Rebai
