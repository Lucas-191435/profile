import { IItem } from "@/types/Item";

type ItemGridProps = {
    items: IItem[];
}
const ItemGrid = ({ items }: ItemGridProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {items.map((item) => (
                <div key={item.id} className="bg-secondary rounded-lg p-4 flex flex-col items-center text-center">
                    <img src={item.sprite} alt={item.name} className="w-16 h-16 mb-2" />
                    <h3 className="font-body font-medium text-sm">{item.name}</h3>
                </div>
            ))}
        </div>
    );
}

export default ItemGrid;