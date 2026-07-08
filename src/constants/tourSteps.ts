import { Step } from "react-joyride";

export const tourSteps: Step[] = [
  {
    target: "[data-tour='welcome']",
    title: "Bem-vindo ao Projeto Portfólio",
    content:
      "Bem-vindo ao meu projeto de portfólio! Aqui você encontrará uma visão geral das minhas habilidades, projetos e experiências. Explore e descubra mais sobre o meu trabalho.",
    // disableBeacon: true,
    placement: "center",
  },
  {
    target: "[data-tour='btn-sound']",
    title: "Botão de Som",
    content:
      "Ative ou desative os sons do aplicativo conforme sua preferência. Isso permite uma experiência personalizada e confortável enquanto você explora o portfólio.",
    placement: "bottom",
  },
  {
    target: "[data-tour='btn-linkedin']",
    title: "LinkedIn",
    content:
      "Aqui você pode acessar meu perfil no LinkedIn para conhecer minha trajetória profissional.",
    placement: "bottom",
  },
  {
    target: "[data-tour='btn-github']",
    title: "GitHub",
    content:
      "Aqui você pode acessar meu perfil no GitHub para explorar meus projetos.",
    placement: "bottom",
  },
  {
    target: "[data-tour='btn-curriculum']",
    title: "Currículo",
    content:
      "Aqui você pode acessar meu currículo para conhecer minha formação e experiências profissionais.",
    placement: "bottom",
  },
  {
    target: "[data-tour='home']",
    title: "Página Inicial",
    content:
      "Esta é a página inicial, onde você pode explorar a pokedex e conhecer mais sobre os pokémons. Navegue pelos cards para descobrir informações detalhadas sobre cada um deles.",
    placement: "right",
  },
   {
    target: "[data-tour='my-pokemon']",
    title: "Meu Pokémon",
    content:
      "Aqui você pode ver os detalhes do seu Pokémon. Montar o seu melhor time e montar os golpes para derrotar os adversários.",
    placement: "right",
  },
  {
    target: "[data-tour='profile']",
    title: "Meu Perfil",
    content:
      "Aqui você pode ver os detalhes do seu perfil. Atualize suas informações e gerencie suas preferências.",
    placement: "right",
  },
  {
    target: "[data-tour='itens']",
    title: "Itens",
    content:
      "Aqui você pode ver os detalhes dos seus itens. Gerencie seus recursos e utilize-os estrategicamente.",
    placement: "right",
  },
  {
    target: "[data-tour='regions']",
    title: "Regiões",
    content:
      "Ainda está em desenvolvimento",
    placement: "right",
  },
];

export const mobileTourSteps: Step[] = [
  {
    target: "[data-tour='welcome']",
    title: "Bem-vindo ao Projeto Portfólio",
    content:
      "Bem-vindo ao meu projeto de portfólio! Aqui você encontrará uma visão geral das minhas habilidades, projetos e experiências. Explore e descubra mais sobre o meu trabalho.",
    // disableBeacon: true,
    placement: "center",
  },
  {
    target: "[data-tour='btn-sound']",
    title: "Botão de Som",
    content:
      "Ative ou desative os sons do aplicativo conforme sua preferência. Isso permite uma experiência personalizada e confortável enquanto você explora o portfólio.",
    placement: "bottom",
  },
  {
    target: "[data-tour='btn-linkedin']",
    title: "LinkedIn",
    content:
      "Aqui você pode acessar meu perfil no LinkedIn para conhecer minha trajetória profissional.",
    placement: "bottom",
  },
  {
    target: "[data-tour='btn-github']",
    title: "GitHub",
    content:
      "Aqui você pode acessar meu perfil no GitHub para explorar meus projetos.",
    placement: "bottom",
  },
  {
    target: "[data-tour='btn-curriculum']",
    title: "Currículo",
    content:
      "Aqui você pode acessar meu currículo para conhecer minha formação e experiências profissionais.",
    placement: "bottom",
  },
];

export const tourConfig = {
  continuous: true,
  run: false,
  showProgress: true,
  showSkipButton: true,
  disableOverlayClose: true,
  disableCloseOnEsc: false,
  hideCloseButton: true,
  scrollToFirstStep: true,
  spotlightClicks: true,
  styles: {
    options: {
      primaryColor: "hsl(0, 85%, 55%)", // Cor primária do seu tema
      backgroundColor: "#FFFFFF",
      textColor: "#374151",
      arrowColor: "#FFFFFF",
      overlayColor: "rgba(0, 0, 0, 0.4)",
      spotlightShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
      beaconSize: 36,
    },
    tooltip: {
      borderRadius: 8,
      fontSize: "16px",
      padding: "20px",
      maxWidth: "400px",
    },
    tooltipContainer: {
      textAlign: "left" as const,
      fontWeight: "600",
    },
    tooltipTitle: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "12px",
    },
    buttonNext: {
      backgroundColor: "hsl(0, 85%, 55%)",
      fontSize: "16px",
      fontWeight: "500",
      padding: "8px 16px",
      borderRadius: "6px",
    },
    buttonBack: {
      color: "#6B7280",
      fontSize: "16px",
      fontWeight: "500",
      padding: "8px 16px",
    },
    buttonSkip: {
      color: "#6B7280",
      fontSize: "16px",
      fontWeight: "500",
    },
  },
  locale: {
    back: "Voltar",
    close: "Fechar",
    last: "Finalizar",
    next: "Próximo",
    skip: "Pular",
    nextLabelWithProgress: "Próximo - Passo {step} de {steps}",
  },
};
