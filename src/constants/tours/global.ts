import { TourDefinition } from "./types";

export const globalTour: TourDefinition = {
  id: "global",
  version: 2,
  title: "Visão geral",
  steps: [
    {
      target: "[data-tour='welcome']",
      title: "Bem-vindo ao Projeto Portfólio",
      content:
        "Este é o meu projeto de portfólio: uma Pokédex com coleção, times e batalhas PvP em tempo real. Vou te mostrar rapidamente onde fica cada coisa.",
      placement: "center",
    },
    {
      target: "[data-tour='welcome']",
      title: "Você está com um treinador de teste",
      content:
        "Contas de teste podem explorar tudo e batalhar, mas não conseguem editar dados (coleção, times, golpes e perfil). Os botões de edição aparecem travados com um cadeado.",
      placement: "center",
      testOnly: true,
    },
    {
      target: "[data-tour='home']",
      title: "Pokédex",
      content:
        "A página inicial: explore todos os pokémons, busque pelo nome e filtre por tipo ou região.",
      placement: "right",
      desktopOnly: true,
    },
    {
      target: "[data-tour='my-pokemon']",
      title: "Meu Pokémon",
      content:
        "Sua coleção de pokémons. Aqui você monta até três times e escolhe os golpes que cada um usa na batalha.",
      placement: "right",
      desktopOnly: true,
    },
    {
      target: "[data-tour='profile']",
      title: "Meu Perfil",
      content: "Seu treinador: avatar, descrição e estatísticas de vitórias e derrotas.",
      placement: "right",
      desktopOnly: true,
    },
    {
      target: "[data-tour='itens']",
      title: "Itens",
      content: "Todos os itens do mundo Pokémon, separados por categoria.",
      placement: "right",
      desktopOnly: true,
    },
    {
      target: "[data-tour='regions']",
      title: "Regiões",
      content: "Ainda em desenvolvimento. Em breve você vai poder explorar as regiões por aqui.",
      placement: "right",
      desktopOnly: true,
    },
    {
      target: "[data-tour='mobile-menu']",
      title: "Menu",
      content:
        "Abra o menu para navegar entre Pokédex, Meu Pokémon, Meu Perfil, Itens e Regiões.",
      placement: "bottom",
      mobileOnly: true,
    },
    {
      target: "[data-tour='btn-battle']",
      title: "Batalha",
      content:
        "Crie uma sala de batalha PvP ou entre em uma existente. Sem oponente? Dá para batalhar contra a CPU usando um treinador de teste.",
      placement: "bottom",
    },
    {
      target: "[data-tour='btn-curriculum']",
      title: "Currículo",
      content: "Meu currículo, com formação e experiências profissionais.",
      placement: "bottom",
    },
    {
      target: "[data-tour='btn-github']",
      title: "GitHub",
      content: "Meu perfil no GitHub, com o código deste e de outros projetos.",
      placement: "bottom",
    },
    {
      target: "[data-tour='btn-linkedin']",
      title: "LinkedIn",
      content: "Meu perfil no LinkedIn, com a minha trajetória profissional.",
      placement: "bottom",
    },
    {
      target: "[data-tour='btn-sound']",
      title: "Som",
      content: "Liga e desliga a música e os efeitos sonoros.",
      placement: "bottom",
    },
    {
      target: "[data-tour='chat']",
      title: "Chat",
      content: "Converse em tempo real com outros treinadores conectados.",
      placement: "left",
      desktopOnly: true,
    },
    {
      target: "[data-tour='btn-tour']",
      title: "Tour guiado",
      content:
        "Sempre que quiser, refaça este tour ou veja o tour da página atual, que explica as funcionalidades dela em detalhe.",
      placement: "bottom",
    },
  ],
};
