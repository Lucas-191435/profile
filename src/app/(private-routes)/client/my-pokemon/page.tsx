'use client';
import ContainerSidebar from "@/components/shared/ContainerSidebar";

const ClientHomePage = () => {

  return (
    <ContainerSidebar className="flex justify-center items-center ">
        <div className="flex flex-col items-center justify-center gap-4 h-full min-h-[700px] border-2 border-red-500 w-full rounded-3xl" >
            <h1 className="text-3xl font-bold">Meu Pokemon</h1>
            <p className="">A pagina ainda está em desenvolvimento. Por favor, tenha compreensão.</p>
        </div>
    </ContainerSidebar>
  );
}

export default ClientHomePage;