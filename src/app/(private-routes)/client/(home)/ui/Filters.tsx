import SearchBar from "./SearchBar";
import ModalFilters from "./ModalFilters";
import { InfoPopover } from "@/components/shared/InfoPopover";

const Filter = () => {
    return (
        <div className="flex flex-row gap-3 items-center">
            <SearchBar />
            <div className="flex items-center gap-1" data-tour="home-filters">
                <ModalFilters />
                <InfoPopover title="Como funcionam os filtros">
                    <p>Escolha um ou mais <b>tipos</b> e <b>regiões</b> e clique em <b>Aplicar</b>.</p>
                    <p>Os filtros se combinam com a busca por nome. O número no botão mostra quantos filtros estão ativos.</p>
                </InfoPopover>
            </div>
        </div>
    )
}

export default Filter;
