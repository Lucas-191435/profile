import loginBg from "@/assets/images/login-bg.jpg";

const AuthLayout = async({ children }: { children: React.ReactNode }) => {

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 relative"
      style={{
        backgroundImage: `url(${loginBg.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
  
        {children}
    </div>
  );
}

export default AuthLayout;