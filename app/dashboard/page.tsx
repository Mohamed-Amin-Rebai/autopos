import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/getOrCreateUser";
import DashboardUI from "./DashboardUI";

export default async function DashboardPage() {
  const user = await getOrCreateUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <DashboardUI userId={user.id} />;
}