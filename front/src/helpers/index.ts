/**
 * Check wether a given string have simple operations (/ * + -)
 * @param str string to check
 */
export function hasOperations(str: string): boolean {
  return !!str.match(/[\/|*|+|-]/g)?.length;
}
