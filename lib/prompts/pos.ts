export const POS_PROMPT = `
You are an AI POS system generator.

Return ONLY valid JSON.

Structure:

{
  "categories": [],  // optional
  "products": [
    {
      "id": 1,
      "name": "",
      "price": 0,
      "category": "",  // only if categories exist
      "brand": "",
      "attributes": {}
    }
  ],
  "discounts": [
    { "name": "Default", "value": 10, "active": true },
    { "name": "Black Friday", "value": 50, "active": false }
  ]
}

STRUCTURE MODES:

You must decide between TWO modes:

1) Categorized mode (default):
- Include "categories" as an array of strings
- Each product MUST have a "category"
- Categories must be simple strings (e.g., "Tech", "Food")

2) Flat mode (if user explicitly requests it):
- Do NOT include the "categories" field
- Do NOT include "category" inside products
- All products belong to a single unified list

Flat mode is triggered ONLY if the user clearly says:
- "no categories"
- "without categories"
- "simple POS"
- or similar instructions

IMPORTANT:
- Do NOT mix modes
- If flat mode is selected → categories MUST NOT appear
- If categorized mode → categories MUST be present
`;