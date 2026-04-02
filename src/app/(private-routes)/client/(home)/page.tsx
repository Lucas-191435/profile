'use client';
import ContainerSidebar from "@/components/shared/ContainerSidebar";
import Hero from "./ui/Hero";
import { Button } from "@/components/ui/button";
import Filter from "./ui/Filters";
import { PokemonProvider, usePokemonContext } from "@/context/PokemonContext";
import PokemonGrid from "./ui/PokemonGrid";
const ClientHomePage = () => {

  return (
    <PokemonProvider>
      <ContainerSidebar className="space-y-6">
        <Hero />
        <Filter />
        <PokemonGrid />
        <PaginationControls />
      </ContainerSidebar>
    </PokemonProvider>
  );
};

const PaginationControls = () => {
  const { page, setPage, pokemons } = usePokemonContext();

  const handleNextPage = () => {
    if (pokemons?.count && page < Math.ceil(pokemons.count / 20)) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div className="flex flex-col items-center justify-center ">
    <div className="flex items-center justify-between mt-4 gap-3">
      <Button onClick={handlePreviousPage} disabled={page === 1}>Previous</Button>
      <Button onClick={handleNextPage}>Next</Button>
    </div>
      <h1>{pokemons?.count}</h1>

    </div>
  );
};

export default ClientHomePage;