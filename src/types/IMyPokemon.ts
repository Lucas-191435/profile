export interface IMyPokemon {
    id: string;
    nickname: string | null;
    pokemonId: string;
    teamAlpha: boolean;
    teamBeta: boolean;
    teamGamma: boolean;
    teamAlphaMove: string[] | null;
    teamBetaMove: string[] | null;
    teamGammaMove: string[] | null;
    userId: string;
    pokemon: {
        id: string;
        pokeId: number;
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