import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import CashierUI from "./CashiersUI";

export default async function CashiersPage() {
  const user = await getOrCreateUser();

  if (!user || (user.role !== "manager" && user.role !== "admin")) {
    redirect("/");
  }

  return <CashierUI />;
}