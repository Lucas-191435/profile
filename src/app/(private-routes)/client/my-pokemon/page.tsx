'use client';
import ContainerSidebar from "@/components/shared/ContainerSidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
const ClientHomePage = () => {
  const {logout} = useAuth();
  return (
    <ContainerSidebar>
        <h1>Client Home Page1</h1>
        <Button onClick={logout}>Logout</Button>
    </ContainerSidebar>
  );
}

export default ClientHomePage;