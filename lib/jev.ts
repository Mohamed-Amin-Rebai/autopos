const API_URL =
  "https://api.typesafe.ai/v1/systemone";


// lib/jev.ts
type JevChoice = {
  type: "choice";
  choice: string;
  confidence: number;
  probabilities: Record<string, number>;
};
type JevNoul = { type: "noul"; noul: number };
type JevScore = {
  type: "score";
  score: number;
  confidence: number;
  legend: Record<string, string>;
  probabilities: Record<string, number>;
};

export type JevResult = {
  answers: {
    department?: JevChoice;
    urgency?: JevNoul;
    frustration?: JevScore;
  };
};


export async function classifyTicket(message: string): Promise<JevResult> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.TYPESAFE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "jev-latest",

      state: message,

      questions: {
        department: {
          type: "choice",
          instructions: "Which team should handle this",
          criteria: {
            technical: "Bugs and platform issues",
            cashiers: "Cashier account and session issues",
            analytics: "Reports and analytics issues",
            billing: "Subscriptions and payments issues",
            feature_request: "Feature suggestions",
          },
        },

        urgency: {
          type: "noul",
          instructions: "Does this need immediate attention?",
        },

        frustration: {
          type: "score",
          instructions: "Customer frustration level",
          criteria: [
            "Calm",
            "Frustrated",
            "Very upset",
          ],
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(
      "JEV classification failed"
    );
  }

  return response.json() as Promise<JevResult>;
}

export function deriveJevFields(result: JevResult | null | undefined) {
  const a = result?.answers ?? {};
  return {
    department: a.department?.choice,
    urgency:
      typeof a.urgency?.noul === "number" ? a.urgency.noul >= 0.5 : undefined,
    frustration: (() => {
      const p = a.frustration?.probabilities;
      if (!p) return undefined;
      const entries = Object.entries(p) as [string, number][];
      if (!entries.length) return undefined;
      const [best] = entries.reduce((x, y) => (y[1] > x[1] ? y : x));
      const n = parseInt(best, 10);
      return Number.isNaN(n) ? undefined : n;
    })(),
  };
}