'use client';
import ContainerSidebar from "@/components/shared/ContainerSidebar";
import { Input } from "@/components/ui/input";
import { useGetItems } from "@/services/queries/useItem";
import { Package, Search } from "lucide-react";
import FiltersItems from "./ui/FiltersItems";

import { useState } from "react";
import { IItem } from "@/types/Item";
import ItemGrid from "./ui/ItemGrid";
import { useDebounce } from "@/hooks/useDebounce";
import ItemModal from "./ui/ItemModal";
import { useIsMobile } from "@/hooks/useMobile";
import { useItemContext } from "@/context/ItemContext";
import { sounds } from "@/utils/sounds";
import { Button } from "@/components/ui/button";

const ItemPage = () => {
  // const [activeCategory, setActiveCategory] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<IItem | null>(null);
  // const { data } = useGetItems({ page: 1, pageSize: 50, categoryId: activeCategory, query: debouncedSearch });

  const { items, activeCategory, handleCategoryChange, querySearch, handleSearchChange } = useItemContext();
  return (
    <ContainerSidebar className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold tracking-wide text-foreground">Itens</h1>
        <p className="text-muted-foreground font-body mt-1">Explore todos os itens disponíveis no mundo Pokémon.</p>
      </div>

      <FiltersItems 
        activeCategory={activeCategory} 
        setActiveCategory={handleCategoryChange} 
        search={querySearch}
        setSearch={handleSearchChange}
        />

      {items?.rows.length === 0 && (
        <div className="text-center py-12 text-muted-foreground font-body">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Nenhum item encontrado.</p>
        </div>
      )}

      <ItemGrid items={items?.rows || []} setSelectedItem={setSelectedItem}  selectedItem={selectedItem} />
      <PaginationControls />
      <ItemModal selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
    </ContainerSidebar>
  );
}

const PaginationControls = () => {
  const isMobile = useIsMobile();
  const { page, setPage, items } = useItemContext();
  const pageSize = 24; // Deve coincidir com o pageSize do ItemContext
  const totalPages = items?.count ? Math.ceil(items.count / pageSize) : 1;

  const handlePageChange = (targetPage: number) => {
    if (targetPage >= 1 && targetPage <= totalPages && targetPage !== page) {
      sounds.clickPagination.play();
      setPage(targetPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = isMobile ? 3 : 4; // Responsivo: 3 no mobile, 4 no desktop
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    // eslint-disable-next-line prefer-const
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
       <div className="sm:hidden flex flex-wrap items-center justify-center gap-1 sm:gap-2 w-full max-w-4xl overflow-x-auto pb-2">
        {/* Página anterior */}
        <Button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}

          className="min-w-[40px] sm:min-w-[60px]"
        >
          Prev
        </Button>
        {/* Próxima página */}
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}

          className="min-w-[40px] sm:min-w-[60px]"
        >
         Next
        </Button>
       </div>
       
      {/* Controles principais */}
      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 w-full max-w-4xl overflow-x-auto pb-2">

        {/* Página anterior */}
        <Button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}

          className="min-w-[40px] sm:min-w-[60px] hidden sm:inline"
        >
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
 
           className="min-w-[40px] sm:min-w-[60px] hidden sm:inline"
        >
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
        Page {page} of {totalPages} • Total: {items?.count || 0} items ({pageSize} per page)
      </div>
    </div>
  );
};

export default ItemPage;