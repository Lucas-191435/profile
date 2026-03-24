import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORIES, ItemCategoryColor } from "@/constants/items";
import { IItem } from "@/types/Item";
import Image from "next/image";

type ItemGridProps = {
    items: IItem[];
    setSelectedItem: (item: IItem | null) => void;
    selectedItem: IItem | null;
}
const ItemGrid = ({ items, setSelectedItem, selectedItem }: ItemGridProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {items.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="card-pokemon text-left group cursor-pointer flex items-center gap-3"
                >
                    <div className="relative w-12 h-12 rounded-lg bg-secondary/80 flex items-center justify-center shrink-0 border border-border group-hover:border-primary/50 transition-colors">
                        <Image src={item.sprite} alt={item.name} className="w-8 h-8 pixelated" fill loading="lazy" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-display text-sm font-semibold text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground font-body truncate">{item.effect}</p>
                        <div className="mt-1 flex items-center gap-2">
                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 border ${ItemCategoryColor[item.pokeItemPocketId]}`}>
                                {CATEGORIES.find(c => c.key === item.pokeItemPocketId)?.label}
                            </Badge>
                            {item.price > 0 && (
                                <span className="text-[10px] text-muted-foreground">₽{item.price.toLocaleString()}</span>
                            )}
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
}

export default ItemGrid;