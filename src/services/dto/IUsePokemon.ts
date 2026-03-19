import { IPokemon } from "@/types/IPokemon";

export type IGetPokemons = {
    pokemon: IPokemon[];
    count: number;
}

export type IFindUniquePokemon = IPokemon;