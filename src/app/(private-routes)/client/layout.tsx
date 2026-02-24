import { nextAuthOptions } from "@/lib/nextAuthOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const ClientLayout = async({ children }: { children: React.ReactNode }) => {
      const session = await getServerSession(nextAuthOptions);

  if (!session) {
    redirect("/login");
  }
  return (
    <div>
        <h1>Client Layout</h1>
        {children}
    </div>
  );
}

export default ClientLayout;