import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function formatCondition(condition: string) {
  // Simple formatter for condition strings
  return condition
    .replace(/&&/g, " AND ")
    .replace(/\|\|/g, " OR ")
    .replace(/==/g, " = ")
    .replace(/!=/g, " ≠ ")
    .replace(/</g, " < ")
    .replace(/>/g, " > ")
    .replace(/<=/g, " ≤ ")
    .replace(/>=/g, " ≥ ")
    .trim()
}

export function generateId() {
  return Math.random().toString(36).substring(2, 11)
}

export function parseCondition(condition: string) {
  // Simple parser for condition strings
  const parts = condition.split(/\s+(?:&&|\|\|)\s+/)
  return parts.map(part => {
    const operators = ['>=', '<=', '!=', '==', '>', '<', '=']
    for (const op of operators) {
      if (part.includes(op)) {
        const [field, ...valueParts] = part.split(op)
        return {
          field: field.trim(),
          operator: op,
          value: valueParts.join(op).trim().replace(/^['"]|['"]$/g, '')
        }
      }
    }
    return null
  }).filter(Boolean)
}

export function isValidJson(str: string) {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

export function formatActionName(action: string) {
  return action
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
