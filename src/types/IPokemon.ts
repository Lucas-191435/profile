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