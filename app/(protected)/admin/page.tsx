import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import AdminUI from "./AdminUI";

export default async function AdminPage() {
  const user = await getOrCreateUser();

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  return <AdminUI />;
}