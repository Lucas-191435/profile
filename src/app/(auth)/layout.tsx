const AuthLayout = async({ children }: { children: React.ReactNode }) => {

  return (
    <div className="px-6">
        {children}
    </div>
  );
}

export default AuthLayout;