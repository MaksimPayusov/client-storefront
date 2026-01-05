// Утилиты для работы с темой магазина

// Типы тем из админки
export type ThemeName =
  | 'Классика Dark'
  | 'Минимализм'
  | 'Эко / Беж'
  | 'Океан'
  | 'Лес'
  | 'Неон';

// Конфигурация тем
export const themeConfig: Record<ThemeName, {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  buttonBg: string;
  buttonText: string;
}> = {
  'Классика Dark': {
    primaryColor: '#000000',       // Фон
    secondaryColor: '#ffffff',     // Акцент
    backgroundColor: '#000000',    // Основной фон
    textColor: '#ffffff',          // Текст
    accentColor: '#ffffff',        // Акцентные элементы
    buttonBg: '#ffffff',           // Фон кнопок
    buttonText: '#000000',         // Текст кнопок
  },
  'Минимализм': {
    primaryColor: '#ffffff',       // Фон
    secondaryColor: '#000000',     // Акцент
    backgroundColor: '#ffffff',    // Основной фон
    textColor: '#000000',          // Текст
    accentColor: '#000000',        // Акцентные элементы
    buttonBg: '#000000',           // Фон кнопок
    buttonText: '#ffffff',         // Текст кнопок
  },
  'Эко / Беж': {
    primaryColor: '#78350f',       // bg-amber-900
    secondaryColor: '#fef3c7',     // bg-amber-100
    backgroundColor: '#fefce8',    // Светлый фон (amber-50)
    textColor: '#1c1917',          // Текст (gray-900)
    accentColor: '#78350f',        // Акцентные элементы
    buttonBg: '#78350f',           // Фон кнопок
    buttonText: '#ffffff',         // Текст кнопок
  },
  'Океан': {
    primaryColor: '#172554',       // bg-blue-950
    secondaryColor: '#22d3ee',     // bg-cyan-400
    backgroundColor: '#f0f9ff',    // Светлый фон (blue-50)
    textColor: '#0c4a6e',          // Текст (blue-900)
    accentColor: '#22d3ee',        // Акцентные элементы
    buttonBg: '#172554',           // Фон кнопок
    buttonText: '#ffffff',         // Текст кнопок
  },
  'Лес': {
    primaryColor: '#052e16',       // bg-green-950
    secondaryColor: '#a3e635',     // bg-lime-400
    backgroundColor: '#f0fdf4',    // Светлый фон (green-50)
    textColor: '#14532d',          // Текст (green-800)
    accentColor: '#a3e635',        // Акцентные элементы
    buttonBg: '#052e16',           // Фон кнопок
    buttonText: '#ffffff',         // Текст кнопок
  },
  'Неон': {
    primaryColor: '#3b0764',       // bg-purple-950
    secondaryColor: '#f472b6',     // bg-pink-400
    backgroundColor: '#faf5ff',    // Светлый фон (purple-50)
    textColor: '#581c87',          // Текст (purple-900)
    accentColor: '#f472b6',        // Акцентные элементы
    buttonBg: '#3b0764',           // Фон кнопок
    buttonText: '#ffffff',         // Текст кнопок
  },
};

// Получить тему по имени
export function getThemeByName(name: ThemeName) {
  return themeConfig[name];
}

// Применяем CSS-переменные темы к document
export function applyThemeToDocument(theme: {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  accentColor: string
}) {
  if (typeof document === 'undefined') return

  const root = document.documentElement

  root.style.setProperty('--color-primary', theme.primaryColor)
  root.style.setProperty('--color-secondary', theme.secondaryColor)
  root.style.setProperty('--color-background', theme.backgroundColor)
  root.style.setProperty('--color-text', theme.textColor)
  root.style.setProperty('--color-accent', theme.accentColor)
}

// Получаем CSS-переменные для использования в стилях
export function getThemeVariables(theme: {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  accentColor: string
}) {
  return {
    '--color-primary': theme.primaryColor,
    '--color-secondary': theme.secondaryColor,
    '--color-background': theme.backgroundColor,
    '--color-text': theme.textColor,
    '--color-accent': theme.accentColor,
  } as React.CSSProperties
}