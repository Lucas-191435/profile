export interface IPokemon {
  number: number; // Número do Pokémon
  name: string; // Nome do Pokémon
  types: string[]; // Tipos do Pokémon
  abilities: string[]; // Habilidades do Pokémon
  region: string; // Região do Pokémon
  height: number; // Altura do Pokémon (em decímetros)
  weight: number; // Peso do Pokémon (em hectogramas)
  img1: string; // URL da primeira imagem
  img2: string; // URL da segunda imagem
  img3: string; // URL da terceira imagem
};


interface PokemonDescription {
  version: string,
  description: string;
}

interface EvolutionChainItem {
  name: string;
  id: number;
  level: number | null;
}

interface PokemonSprite {
  label: string;
  url: string;
}

interface PokemonStat {
  name: string;
  value: number;
}

export interface IPokemonComplete {
  number: number;
  name: string;
  types: string[];
  abilities: string[];
  region: string;
  height: number;
  weight: number;
  img1: string;
  img2: string;
  img3: string;
  descriptions: PokemonDescription[];
  evolutionChain: EvolutionChainItem[];
  sprites: PokemonSprite[];
  regions: string[];
  stats: PokemonStat[];
}