import { TourDefinition } from "./types";

export const myPokemonTour: TourDefinition = {
  id: "my-pokemon",
  version: 1,
  title: "Meu Pokémon",
  steps: [
    {
      target: "[data-tour='test-banner']",
      title: "Modo somente leitura",
      content:
        "Você entrou com um treinador de teste. Dá para ver a coleção, os times e os golpes, mas não editar. Os botões de edição ficam travados com um cadeado.",
      testOnly: true,
    },
    {
      target: "[data-tour='mp-collection']",
      title: "Minha Coleção",
      content: "Todos os pokémons que você capturou ficam aqui.",
    },
    {
      target: "[data-tour='mp-remove']",
      title: "Remover da coleção",
      content: "O X no canto do card solta o pokémon e o remove da sua coleção.",
    },
    {
      target: "[data-tour='mp-teams-tabs']",
      title: "Times",
      content:
        "Você tem três times: Alpha, Beta e Gamma. Na hora da batalha, escolhe qual deles vai lutar.",
    },
    {
      target: "[data-tour='mp-edit-team']",
      title: "Editar time",
      content:
        "Clique em Editar para adicionar ou trocar os pokémons dos 6 slots do time e depois em Salvar.",
    },
    {
      target: "[data-tour='mp-team-slots']",
      title: "Golpes",
      content:
        "Clique em um pokémon do time para ver os golpes dele. Cada pokémon leva até 4 golpes por time, e são eles que você usa na batalha.",
      placement: "top",
    },
  ],
};
