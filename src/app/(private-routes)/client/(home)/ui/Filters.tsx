import SearchBar from "./SearchBar";


import ModalFilters from "./ModalFilters";

const Filter = () => {
    return (
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <SearchBar />
            {/* <ModalFilters
                selectedTypes={selectedTypes}
                setSelectedTypes={setSelectedTypes}
                selectedGen={selectedGen}
                setSelectedGen={setSelectedGen} /> */}
        </div>
    )
}

export default Filter;