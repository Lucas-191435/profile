type LogFn = (...args: unknown[]) => void;

const isProd = process.env.MODE === 'production'; // ajustar conforme o ambiente real

export const log: LogFn = (...args) => {
  // eslint-disable-next-line no-console
  if (!isProd) console.log(...args);
};

export const info: LogFn = (...args) => {
  if (!isProd) console.info(...args);
};

export const warn: LogFn = (...args) => {
  // manter warn em prod pode ser útil — aqui deixei sempre ativo
  // eslint-disable-next-line no-console
  console.warn(...args);
};

export const error: LogFn = (...args) => {
  // sempre ativo; em prod você pode enviar para Sentry/LogService também
  console.error(...args);
};
