export function formatarArrayDatas(objArray: any[]): any[] {
  const formatoFull = (date: Date) =>
    date.toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })
  const formatoShort = (date: Date) =>
    date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
  const formatoLong = (date: Date) =>
    date.toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })

  const arrayFormatado = objArray.map((obj) => {
    const objFormatado: any = {}

    Object.keys(obj).forEach((prop) => {
      if (obj[prop] instanceof Date) {
        objFormatado[prop] = {
          full: formatoFull(obj[prop]),
          long: formatoLong(obj[prop]),
          short: formatoShort(obj[prop]),
          timestamp: obj[prop].getTime(),
        }
      } else {
        objFormatado[prop] = obj[prop]
      }
    })

    return objFormatado
  })

  return arrayFormatado
}
