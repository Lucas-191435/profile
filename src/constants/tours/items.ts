import { TourDefinition } from "./types";

export const itemsTour: TourDefinition = {
  id: "items",
  version: 1,
  title: "Itens",
  steps: [
    {
      target: "[data-tour='items-search']",
      title: "Busca",
      content: "Digite o nome de um item para encontrá-lo.",
    },
    {
      target: "[data-tour='items-categories']",
      title: "Categorias",
      content:
        "Filtre os itens por categoria. Passe o mouse (ou toque) no ícone ⓘ para saber mais.",
    },
    {
      target: "[data-tour='items-grid']",
      title: "Itens",
      content: "Clique em um item para ver o efeito e os detalhes dele.",
      placement: "top",
    },
  ],
};
