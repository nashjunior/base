export function utf8ParaLatin1(input: string): string {
  const accentsMap = new Map([
    ['Á', 'A'],
    ['É', 'E'],
    ['Í', 'I'],
    ['Ó', 'O'],
    ['Ú', 'U'],
    ['À', 'A'],
    ['È', 'E'],
    ['Ì', 'I'],
    ['Ò', 'O'],
    ['Ù', 'U'],
    ['Â', 'A'],
    ['Ê', 'E'],
    ['Î', 'I'],
    ['Ô', 'O'],
    ['Û', 'U'],
    ['Ä', 'A'],
    ['Ë', 'E'],
    ['Ï', 'I'],
    ['Ö', 'O'],
    ['Ü', 'U'],
    ['Ã', 'A'],
    ['Õ', 'O'],
    ['á', 'a'],
    ['é', 'e'],
    ['í', 'i'],
    ['ó', 'o'],
    ['ú', 'u'],
    ['à', 'a'],
    ['è', 'e'],
    ['ì', 'i'],
    ['ò', 'o'],
    ['ù', 'u'],
    ['â', 'a'],
    ['ê', 'e'],
    ['î', 'i'],
    ['ô', 'o'],
    ['û', 'u'],
    ['ä', 'a'],
    ['ë', 'e'],
    ['ï', 'i'],
    ['ö', 'o'],
    ['ü', 'u'],
    ['ã', 'a'],
    ['õ', 'o'],
    ['ç', 'c'],
    ['ñ', 'n'],
    ['Ç', 'C'],
    ['Ñ', 'N'],
  ])

  function removeAccents(str: string) {
    return str
      .split('')
      .map((letter) => accentsMap.get(letter) || letter)
      .join('')
  }

  function cleanString(input2: string) {
    let output = ''
    for (let i = 0; i < input2.length; i += 1) {
      if (input2.charCodeAt(i) <= 127) {
        output += input2.charAt(i)
      }
    }
    return output
  }

  const step1 = removeAccents(input)
  return cleanString(step1)
}
