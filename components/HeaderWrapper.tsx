import Header from "./Header";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

export default async function HeaderWrapper() {
  const user = await getOrCreateUser();

  return (
    <Header
      role={
        (user?.role as
          | "user"
          | "manager"
          | "admin") ?? ""
      }
    />
  );
}