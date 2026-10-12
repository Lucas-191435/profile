import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CATEGORIES } from "@/constants/items";
import { InfoPopover } from "@/components/shared/InfoPopover";

type FiltersItemsProps = {
    activeCategory: number;
    setActiveCategory: (category: number) => void;
    search: string;
    setSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const FiltersItems = ({ activeCategory, setActiveCategory, search, setSearch }: FiltersItemsProps) => {
    return (
        <>
            <div className="relative max-w-md" data-tour="items-search">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar item..."
                    value={search}
                    onChange={(e) => setSearch(e)}
                    className="pl-10 bg-secondary border-border font-body"
                />
            </div>

            {/* Category Tabs */}
            <div className="flex items-start gap-1" data-tour="items-categories">
            <Tabs className="flex-1" value={activeCategory.toString()} onValueChange={(v) => setActiveCategory(parseInt(v))}>
                <TabsList className="bg-secondary/50 border border-border !w-full xl:!max-w-2/3 md:w-auto !grid !grid-cols-3 sm:!grid-cols-5 md:!grid-cols-5 lg:!grid-cols-9 !h-auto gap-1 p-1">
                    {CATEGORIES.map((cat) => (
                        <TabsTrigger
                            key={cat.key}
                            value={cat.key.toString()}
                            className="justify-start lg:justify-center !flex-none !whitespace-normal gap-1.5 text-xs font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground !min-w-0 !max-w-none"
                        >
                            {cat.icon}
                            {cat.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <InfoPopover title="Categorias">
                <p>Cada aba mostra só os itens daquela categoria (Medicina, Poké Balls, Batalha etc.). Em <b>Todos</b> aparecem todos os itens.</p>
                <p>A busca por nome é feita dentro da categoria selecionada.</p>
            </InfoPopover>
            </div>

        </>
    );
}

export default FiltersItems;