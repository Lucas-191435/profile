import { nextAuthOptions } from "@/lib/nextAuthOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const LoginLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(nextAuthOptions);

  if (session) {
    redirect("/client");
  }
  return (
    <div>
      <h1>Login Layout</h1>
      {children}
    </div>
  );
}

export default LoginLayout;