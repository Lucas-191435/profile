import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Dispatch, SetStateAction } from "react";

type ModalFiltersProps = {

            selectedTypes: string[];
            setSelectedTypes: Dispatch<SetStateAction<string[]>>;
            selectedGen: number | null;
            setSelectedGen: Dispatch<SetStateAction<number | null>>;
}

const ModalFilters = ({  selectedTypes, setSelectedTypes, selectedGen, setSelectedGen }: ModalFiltersProps) => {

    const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

    return (
        <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the dimensions for the layer.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
    )
}

export default ModalFilters;