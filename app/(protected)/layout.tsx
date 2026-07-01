import Header from "@/components/Header";
import { getOrCreateUser } from "@/lib/getOrCreateUser";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getOrCreateUser();

  return (
    <>
      <Header role={user?.role || "user"} />
      {children}
    </>
  );
}