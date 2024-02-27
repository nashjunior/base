export function formatarDateTime(date: Date | undefined | null): string | void {
  if (!date) return
  return date.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}
