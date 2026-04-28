export interface IMyPokemon {
    id: string;
    nickname: string | null;
    pokemon: {
        id: string;
        name: string;
        img1: string;
        types: string;
    };
}

export interface TeamSlot {
  pokemonId: string | null;
  moves: string[];
}

export interface Team {
  name: string;
  slots: TeamSlot[];
}