'use client';
import ContainerSidebar from "@/components/shared/ContainerSidebar";
import Hero from "./ui/Hero";
import { Button } from "@/components/ui/button";
import Filter from "./ui/Filters";
import { usePokemonContext } from "@/context/PokemonContext";
import PokemonGrid from "./ui/PokemonGrid";
import { sounds } from "@/utils/sounds";
const ClientHomePage = () => {

  return (

    <ContainerSidebar className="space-y-6">
      <Hero />
      <Filter />
      <PokemonGrid />
      <PaginationControls />
    </ContainerSidebar>
  );
};

const PaginationControls = () => {
  const { page, setPage, pokemons } = usePokemonContext();
  const pageSize = 24; // Deve coincidir com o pageSize do PokemonContext
  const totalPages = pokemons?.count ? Math.ceil(pokemons.count / pageSize) : 1;

  const handlePageChange = (targetPage: number) => {
    if (targetPage >= 1 && targetPage <= totalPages && targetPage !== page) {
      sounds.clickPagination.play();
      setPage(targetPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = typeof window !== 'undefined' && window.innerWidth < 640 ? 3 : 4; // Responsivo: 3 no mobile, 5 no desktop
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Ajusta o startPage se estivermos no final
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Adiciona primeira página e reticências se necessário
    if (startPage > 1) {
      pageNumbers.push(
        <Button
          key={1}
          onClick={() => handlePageChange(1)}
          size="sm"
          variant={1 === page ? "default" : "outline"}
          className="min-w-[40px]"
        >
          1
        </Button>
      );
      if (startPage > 2) {
        pageNumbers.push(<span key="start-ellipsis" className="px-2 text-muted-foreground">...</span>);
      }
    }

    // Adiciona páginas visíveis
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          size="sm"
          variant={i === page ? "default" : "outline"}
          className="min-w-[40px]"
        >
          {i}
        </Button>
      );
    }

    // Adiciona última página e reticências se necessário
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(<span key="end-ellipsis" className="px-2 text-muted-foreground">...</span>);
      }
      pageNumbers.push(
        <Button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          size="sm"
          variant={totalPages === page ? "default" : "outline"}
          className="min-w-[40px]"
        >
          {totalPages}
        </Button>
      );
    }

    return pageNumbers;
  };

  if (totalPages <= 1) {
    return null; // Não mostra paginação se houver apenas uma página
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 px-4">
      {/* Controles principais */}
      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 w-full max-w-4xl overflow-x-auto pb-2">
      

        {/* Página anterior */}
        <Button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          size="sm"
          variant="outline"
          className="min-w-[40px] sm:min-w-[60px]"
        >
          <span className="sm:hidden">‹</span>
          <span className="hidden sm:inline">Prev</span>
        </Button>

        {/* Números das páginas */}
        <div className="flex items-center gap-1 mx-2">
          {renderPageNumbers()}
        </div>

        {/* Próxima página */}
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          size="sm"
          variant="outline"
          className="min-w-[40px] sm:min-w-[60px]"
        >
          <span className="sm:hidden">›</span>
          <span className="hidden sm:inline">Next</span>
        </Button>

        
      </div>
      <div className="flex items-center justify-center gap-1 sm:gap-2 w-full max-w-4xl overflow-x-auto pb-2">
          {/* Primeira página */}
        <Button
          onClick={() => handlePageChange(1)}
          disabled={page === 1}
          size="sm"
          variant="outline"
          className="hidden sm:flex min-w-[60px]"
        >
          First
        </Button>
        {/* Última página */}
        <Button
          onClick={() => handlePageChange(totalPages)}
          disabled={page === totalPages}
          size="sm"
          variant="outline"
          className="hidden sm:flex min-w-[60px]"
        >
          Last
        </Button>
      </div>

      {/* Informações da página */}
      <div className="text-sm text-muted-foreground text-center">
        Page {page} of {totalPages} • Total: {pokemons?.count || 0} items ({pageSize} per page)
      </div>
    </div>
  );
};

export default ClientHomePage;