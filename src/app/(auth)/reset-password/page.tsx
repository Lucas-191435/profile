import { Suspense } from "react"
import ResetPasswordComponentPage from "./ui"

const ResetPasswordPage = () => {
    return (
        <Suspense>
            <ResetPasswordComponentPage />
        </Suspense>
    )
}

export default ResetPasswordPage