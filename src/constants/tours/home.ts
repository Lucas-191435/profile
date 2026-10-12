import { TourDefinition } from "./types";

export const homeTour: TourDefinition = {
  id: "home",
  version: 1,
  title: "Pokédex",
  steps: [
    {
      target: "[data-tour='home-search']",
      title: "Busca",
      content: "Digite o nome de um pokémon para encontrá-lo rapidamente.",
    },
    {
      target: "[data-tour='home-filters']",
      title: "Filtros",
      content:
        "Filtre por tipo e por região. Ficou com dúvida? Passe o mouse (ou toque) no ícone ⓘ para ver como cada filtro funciona.",
    },
    {
      target: "[data-tour='home-grid']",
      title: "Pokémons",
      content: "Clique em um card para ver os detalhes do pokémon (status, movimentos e evoluções) e capturá-lo para a sua coleção.",
      placement: "top",
    },
    {
      target: "[data-tour='home-pagination']",
      title: "Paginação",
      content: "Navegue entre as páginas da Pokédex.",
      placement: "top",
    },
  ],
};
