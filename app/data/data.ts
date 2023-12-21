// Define the structure of a color theme
export type ColorThemeVariant = {
  primary: string
  secondary: string
  bg: string
}

// Enum for color keys
export enum ColorKey {
  default = 'default',
  blue = 'blue',
  green = 'green',
  rose = 'rose',
  // Add other keys as needed
}

// Type for the mapping between ColorKey and Tailwind class names
export type ColorMap = {
  [key in ColorKey]?: ColorThemeVariant
}

// Color mapping
export const colorMap: ColorMap = {
  blue: {
    primary: 'theme-blue-primary',
    secondary: 'theme-blue-secondary',
    bg: 'theme-blue-bg',
  },
  green: {
    primary: 'theme-green-primary',
    secondary: 'theme-green-secondary',
    bg: 'theme-green-bg',
  },
  rose: {
    primary: 'theme-rose-primary',
    secondary: 'theme-rose-secondary',
    bg: 'theme-rose-bg',
  },
  default: {
    primary: 'theme-default-primary',
    secondary: 'theme-default-secondary',
    bg: 'theme-default-bg',
  },
  // Add other color mappings...
}
