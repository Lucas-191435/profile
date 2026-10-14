import { Suspense } from "react";
import LoginComponentPage from "./ui";

export default function LoginPage() {
    // Suspense exigido pelo useSearchParams no client component
    return (
        <Suspense>
            <LoginComponentPage />
        </Suspense>
    )
}
