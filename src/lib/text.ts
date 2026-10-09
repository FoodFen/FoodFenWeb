// Lowercases and strips Vietnamese diacritics so "gia bao" matches "Gia Bảo".
export function fold(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd')
}
