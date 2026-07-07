/**
 * Utilitários para gerenciar o tour em desenvolvimento
 *
 * Para resetar o tour e testar o primeiro acesso:
 * - Abra o console do navegador (F12)
 * - Digite: resetTourForTesting()
 * - Recarregue a página
 */

export const resetTourForTesting = () => {
  if (typeof window === "undefined") return;

  try {
    // Remove todas as chaves relacionadas ao tour
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("pokedex_tour")) {
        localStorage.removeItem(key);
      }
    });

    // console.log("✅ Tour resetado! Recarregue a página para testar o primeiro acesso.");

    // Opcional: recarregar automaticamente
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (error) {
    console.error("Erro ao resetar tour:", error);
  }
};

export const checkTourStatus = () => {
  if (typeof window === "undefined") return;

  const keys = Object.keys(localStorage);
  const tourKeys = keys.filter((key) => key.startsWith("pokedex_tour"));

  // console.log("📊 Status do Tour:");
  tourKeys.forEach((key) => {
    // console.log(`${key}: ${localStorage.getItem(key)}`);
  });

  if (tourKeys.length === 0) {
    // console.log("🆕 Nenhum tour foi completado ainda.");
  }
};

// Expor globalmente para uso no console
if (typeof window !== "undefined") {
  (window as any).resetTourForTesting = resetTourForTesting;
  (window as any).checkTourStatus = checkTourStatus;
}
