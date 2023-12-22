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
  orange = 'orange',
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
  orange: {
    primary: 'theme-orange-primary',
    secondary: 'theme-orange-secondary',
    bg: 'theme-orange-bg',
  },
}

import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from '@radix-ui/react-icons'

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

export const statuses = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: QuestionMarkCircledIcon,
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: CircleIcon,
  },
  {
    value: 'in progress',
    label: 'In Progress',
    icon: StopwatchIcon,
  },
  {
    value: 'done',
    label: 'Done',
    icon: CheckCircledIcon,
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: CrossCircledIcon,
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'low',
    icon: ArrowDownIcon,
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: ArrowRightIcon,
  },
  {
    label: 'High',
    value: 'high',
    icon: ArrowUpIcon,
  },
]
