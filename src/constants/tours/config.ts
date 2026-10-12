import { Locale, Options, Props } from "react-joyride";

const PRIMARY = "hsl(0, 85%, 55%)";

export const tourOptions: Partial<Options> = {
  buttons: ["skip", "back", "primary"],
  showProgress: true,
  overlayClickAction: "next",
  dismissKeyAction: "close",
  blockTargetInteraction: true,
  skipBeacon: true,
  primaryColor: PRIMARY,
  backgroundColor: "#FFFFFF",
  textColor: "#374151",
  arrowColor: "#FFFFFF",
  overlayColor: "rgba(0, 0, 0, 0.5)",
  width: 380,
  zIndex: 1000,
};

export const tourStyles: Props["styles"] = {
  tooltip: {
    borderRadius: 8,
    fontSize: 15,
    padding: 20,
  },
  tooltipContainer: {
    textAlign: "left",
  },
  tooltipTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 8,
  },
  buttonPrimary: {
    backgroundColor: PRIMARY,
    fontSize: 15,
    fontWeight: 500,
    padding: "8px 16px",
    borderRadius: 6,
  },
  buttonBack: {
    color: "#6B7280",
    fontSize: 15,
    fontWeight: 500,
  },
  buttonSkip: {
    color: "#6B7280",
    fontSize: 15,
    fontWeight: 500,
  },
};

export const tourLocale: Locale = {
  back: "Voltar",
  close: "Fechar",
  last: "Finalizar",
  next: "Próximo",
  nextWithProgress: "Próximo ({current} de {total})",
  skip: "Pular",
};
