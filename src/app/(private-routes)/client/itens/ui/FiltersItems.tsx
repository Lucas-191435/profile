import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CATEGORIES } from "@/constants/items";

type FiltersItemsProps = {
    activeCategory: number;
    setActiveCategory: (category: number) => void;
    search: string;
    setSearch: (search: string) => void;
}
const FiltersItems = ({ activeCategory, setActiveCategory, search, setSearch }: FiltersItemsProps) => {
    return (
        <>
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar item..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-secondary border-border font-body"
                />
            </div>

            {/* Category Tabs */}
            <Tabs value={activeCategory.toString()} onValueChange={(v) => setActiveCategory(parseInt(v))}>
                <TabsList className="bg-secondary/50 border border-border flex-wrap h-auto gap-1 p-1">
                    {CATEGORIES.map((cat) => (
                        <TabsTrigger key={cat.key} value={cat.key.toString()} className="gap-1.5 text-xs font-body data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                            {cat.icon}
                            {cat.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

        </>
    );
}

export default FiltersItems;