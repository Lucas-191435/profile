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
