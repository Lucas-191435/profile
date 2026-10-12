import SearchBar from "./SearchBar";
import ModalFilters from "./ModalFilters";

const Filter = () => {
    return (
        <div className="flex flex-row gap-3 items-center">
            <SearchBar />
            <ModalFilters />
        </div>
    )
}

export default Filter;
