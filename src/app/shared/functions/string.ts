export function sanitize(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 *
 * @param search Sanitize Search
 * @param text
 * @returns
 */
export function search(text: string, search: string) {
  search = sanitize(search)?.toLocaleLowerCase();
  text = sanitize(text)?.toLocaleLowerCase();

  return text.indexOf(search) >= 0;
}
