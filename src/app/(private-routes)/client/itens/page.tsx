'use client';
import ContainerSidebar from "@/components/shared/ContainerSidebar";
import { Input } from "@/components/ui/input";
import { useGetItems } from "@/services/queries/useItem";
import { Package, Search } from "lucide-react";
import FiltersItems from "./ui/FiltersItems";

import { useState } from "react";
import { IItem } from "@/types/Item";
import ItemGrid from "./ui/ItemGrid";

const ClientHomePage = () => {
  const { data } = useGetItems({ page: 1, pageSize: 20 });
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<IItem | null>(null);
  console.log(data);
  return (
    <ContainerSidebar className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold tracking-wide text-foreground">Itens</h1>
        <p className="text-muted-foreground font-body mt-1">Explore todos os itens disponíveis no mundo Pokémon.</p>
      </div>

      <FiltersItems activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

      {data?.rows.length === 0 && (
        <div className="text-center py-12 text-muted-foreground font-body">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Nenhum item encontrado.</p>
        </div>
      )}

      <ItemGrid items={data?.rows || []} />
    </ContainerSidebar>
  );
}

export default ClientHomePage;