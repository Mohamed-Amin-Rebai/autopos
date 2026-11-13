import { GoogleGenAI, Type } from "@google/genai";
import type { POSData, Product } from "@/lib/types";

const POS_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    categories: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    products: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.NUMBER },
          name: { type: Type.STRING },
          price: { type: Type.NUMBER },
          category: { type: Type.STRING },
          brand: { type: Type.STRING },
          image: { type: Type.STRING },
          attributes: { type: Type.OBJECT },
        },
        required: ["id", "name", "price"],
      },
    },
    discounts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          value: { type: Type.NUMBER },
          active: { type: Type.BOOLEAN },
        },
        required: ["name", "value", "active"],
      },
    },
  },
  required: ["products"],
};

const PLAN_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    message: { type: Type.STRING },
  },
  required: ["message"],
};

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  return new GoogleGenAI({ apiKey });
}

async function generateStructuredText(
  prompt: string,
  responseSchema: object,
): Promise<string> {
  const response = await getClient().models.generateContent({
    model: process.env.GEMINI_MODEL ?? "gemini-2.0-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const text = response.text?.trim();
  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return text;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePOSData(text: string): POSData {
  const parsed: unknown = JSON.parse(text);
  if (!isRecord(parsed) || !Array.isArray(parsed.products)) {
    throw new Error("Gemini returned an invalid POS structure");
  }

  const products: Product[] = parsed.products.map((product) => {
    if (!isRecord(product)) {
      throw new Error("Gemini returned an invalid product");
    }

    if (
      typeof product.id !== "number" ||
      typeof product.name !== "string" ||
      typeof product.price !== "number"
    ) {
      throw new Error("Gemini returned an incomplete product");
    }

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      category: typeof product.category === "string" ? product.category : "",
      ...(typeof product.brand === "string" ? { brand: product.brand } : {}),
      ...(typeof product.image === "string" ? { image: product.image } : {}),
      ...(isRecord(product.attributes) ? { attributes: product.attributes } : {}),
    };
  });

  if (
    parsed.categories !== undefined &&
    (!Array.isArray(parsed.categories) ||
      !parsed.categories.every((category) => typeof category === "string"))
  ) {
    throw new Error("Gemini returned invalid categories");
  }

  if (
    parsed.discounts !== undefined &&
    (!Array.isArray(parsed.discounts) ||
      !parsed.discounts.every((discount) => {
        return isRecord(discount) &&
          typeof discount.name === "string" &&
          typeof discount.value === "number" &&
          typeof discount.active === "boolean";
      }))
  ) {
    throw new Error("Gemini returned invalid discounts");
  }

  return {
    products,
    categories: Array.isArray(parsed.categories) ? parsed.categories : [],
    ...(Array.isArray(parsed.discounts)
      ? { discounts: parsed.discounts }
      : {}),
  };
}

export async function generatePOS(prompt: string): Promise<POSData> {
  const text = await generateStructuredText(prompt, POS_RESPONSE_SCHEMA);
  return parsePOSData(text);
}

export async function planPOS(prompt: string): Promise<string> {
  const text = await generateStructuredText(prompt, PLAN_RESPONSE_SCHEMA);
  const parsed: unknown = JSON.parse(text);

  if (!isRecord(parsed) || typeof parsed.message !== "string" || !parsed.message.trim()) {
    throw new Error("Gemini returned an invalid plan");
  }

  return parsed.message;
}
