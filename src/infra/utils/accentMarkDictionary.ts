import { HTMLCharacterToCharacterMap } from '@modules/scrapingProducts/domain/entities';

const accentMarkDictionary: HTMLCharacterToCharacterMap = {
  '&Aacute;': 'Á',
  '&aacute;': 'á',
  '&eacute;': 'é',
  '&Eacute;': 'É',
  '&iacute;': 'í',
  '&Iacute;': 'Í',
  '&oacute;': 'ó',
  '&Oacute;': 'Ó',
  '&uacute;': 'ú',
  '&Uacute;': 'Ú',
  '&ntilde;': 'ñ',
  '&iquest;': '¿',
  '&bull;': '',
  '&gt;': '>',
  '&deg;': '°',
};

export const removeHTMLTags = (input: string) => {
  return input
    .replace(/<[^>]*>|&nbsp;|\r+/g, '')
    .replace(/\n+/g, ' ')
    .replace(
      /&[aeiou]acute;|&[AEIOU]acute;|&bull;|&ntilde;|&iquest;|&gt;|&deg;/g,
      (match) => accentMarkDictionary[match]
    )
    .trim();
};
