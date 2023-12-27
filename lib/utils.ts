import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateDaysRemaining(deadline: Date | undefined) {
  if (!deadline) {
    return 0
  }

  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)
  const deadlineDate = new Date(deadline)
  deadlineDate.setHours(0, 0, 0, 0)

  const diff = deadlineDate.getTime() - currentDate.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

export function createRange<T>(
  length: number,
  initializer: (index: number) => T
): T[] {
  return [...new Array(length)].map((_, index) => initializer(index))
}
