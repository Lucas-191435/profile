import { Dispatch, SetStateAction } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePokemonContext } from "@/context/PokemonContext";

const SearchBar = () => {
    const {setQuerySearch, querySearch} = usePokemonContext();
    return (
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar Pokémon..."
            value={querySearch}
            onChange={(e) => setQuerySearch(e.target.value)}
            className="pl-10 bg-secondary border-border font-body focus-visible:ring-primary"
          />
        </div>
    )
}

export default SearchBar;