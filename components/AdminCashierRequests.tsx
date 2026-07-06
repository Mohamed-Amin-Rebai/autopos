"use client";

import { useEffect, useState } from "react";

export default function AdminCashierRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const res = await fetch("/api/cashier-requests");

        if (!res.ok) {
          throw new Error("Failed to load requests");
        }

        const data = await res.json();
        setRequests(data);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  if (loading) {
    return <div>Loading cashier requests...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
      <h2 className="text-lg font-semibold mb-4">
        Pending Cashier Requests
      </h2>

      {requests.length === 0 && (
        <p className="text-sm text-gray-500">
          No pending requests.
        </p>
      )}

      <div className="space-y-3">
        {requests.map((request) => (
          <div
            key={request.id}
            className="border rounded-xl p-3"
          >
            <div>
              <p>
                <strong>POS:</strong> {request.posId}
              </p>

              <p>
                <strong>Requested Cashiers:</strong>{" "}
                {request.requestedCashiers}
              </p>

              <p>
                <strong>Status:</strong> {request.status}
              </p>
            </div>

            <button
              className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg"
              onClick={async () => {
                const res = await fetch(
                    "/api/cashier-requests/approve",
                    {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        requestId: request.id,
                    }),
                    }
                );

                const data = await res.json();

                console.log(data);
                }}
            >
              Approve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}