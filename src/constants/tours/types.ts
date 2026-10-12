import { Step } from "react-joyride";

export type TourStep = Step & {
  /** Só aparece em telas >= 768px (ex.: sidebar fixa, chat). */
  desktopOnly?: boolean;
  /** Só aparece em telas < 768px (ex.: botão hambúrguer). */
  mobileOnly?: boolean;
  /** Só aparece para usuários com role TEST. */
  testOnly?: boolean;
};

export type TourDefinition = {
  id: string;
  /** Suba a versão quando o roteiro mudar de forma relevante: o tour volta a aparecer para todos. */
  version: number;
  /** Nome da página, usado na etapa de transição quando o tour global encadeia neste. */
  title: string;
  steps: TourStep[];
};
