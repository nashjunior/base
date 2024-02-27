import { ValueTransformer } from 'typeorm'

export class TimestampColumnTransformer implements ValueTransformer {
  to(value: Date): Date | null {
    return value || null
  }

  from(value: Date | string | null): string | null {
    if (!value) return null
    const date = value instanceof Date ? value : new Date(value)

    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date)
  }
}
