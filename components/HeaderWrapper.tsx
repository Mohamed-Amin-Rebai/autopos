"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Header from "./Header";

type HeaderRole = "" | "user" | "manager" | "admin";

export default function HeaderWrapper() {
  const { isLoaded, isSignedIn } = useUser();
  const [role, setRole] = useState<HeaderRole>("");

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    let cancelled = false;

    fetch("/api/me")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Role request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((data: { role?: HeaderRole }) => {
        if (!cancelled) {
          setRole(data.role ?? "");
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Header role sync failed:", error);
          setRole("");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn]);

  return <Header role={isSignedIn ? role : ""} />;
}