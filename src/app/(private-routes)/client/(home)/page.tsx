'use client';
import ContainerSidebar from "@/components/shared/ContainerSidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useGetPokemons } from "@/services/queries/usePokemon";
import Hero from "./ui/Hero";
const ClientHomePage = () => {
  const {logout} = useAuth();
  const { data: pokemons } = useGetPokemons();
  // console.log("pokemons", pokemons);
  return (
    <ContainerSidebar>
        <Hero />
    </ContainerSidebar>
  );
}

export default ClientHomePage;