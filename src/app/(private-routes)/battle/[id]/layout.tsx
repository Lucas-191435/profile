import { nextAuthOptions } from "@/lib/nextAuthOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Providers } from "./providers";

const BattleLayout = async ({ children }: { children: React.ReactNode }) => {
    const session = await getServerSession(nextAuthOptions);
    if (!session) {
        redirect("/login");
    }

    return (
        <>
            <Providers>
                {children}
            </Providers>
        </>
    );
}

export default BattleLayout;