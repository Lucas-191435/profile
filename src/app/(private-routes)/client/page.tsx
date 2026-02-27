'use client';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const ClientHomePage = () => {
  const {logout} = useAuth();
  return (
    <div>
        <h1>Client Home Page</h1>
        <Button onClick={logout}>Logout</Button>
    </div>
  );
}

export default ClientHomePage;