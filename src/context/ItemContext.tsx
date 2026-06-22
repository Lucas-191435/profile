import React, { createContext, useContext, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { IGetItems } from "@/services/dto/IUseItem";
import { useGetItems } from "@/services/queries/useItem";

// Define the shape of the context
interface ItemContextType {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    activeCategory: number;
    querySearch: string;
    items: IGetItems | undefined; 
    isLoading: boolean;
    error: any; 
    handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCategoryChange: (categoryId: number) => void;
}

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export const ItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [page, setPage] = useState(1);
    const [activeCategory, setActiveCategory] = useState<number>(0);
    const pageSize = 24;
    const [querySearch, setQuerySearch] = useState("");
    const debouncedSearch = useDebounce(querySearch, 500);
    const { data: items, isLoading, error } = useGetItems({ page, pageSize, categoryId: activeCategory, query: debouncedSearch });

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuerySearch(e.target.value);
        if (page !== 1) {
            setPage(1);
        }
    }

    const handleCategoryChange = (categoryId: number) => {
        setActiveCategory(categoryId);
        if (page !== 1) {
            setPage(1);
        }
    }

    return (
        <ItemContext.Provider value={{
            page,
            setPage,
            querySearch,
            handleSearchChange,
            items,
            isLoading,
            error,
            activeCategory,
            handleCategoryChange
        }}>
            {children}
        </ItemContext.Provider>
    );
};

export const useItemContext = () => {
    const context = useContext(ItemContext);
    if (!context) {
        throw new Error("useItemContext must be used within an ItemProvider");
    }
    return context;
};