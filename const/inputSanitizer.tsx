/**
 * Check if the given string is allowed to be put in an input field
 * @param str The string to check
 * @returns Whether the string is allowed in an input field
 */
export function isAllowed(str: string): boolean {
  return (
    str !== undefined &&
    str.trim().length > 0 &&
    str.indexOf(`"`) < 0 &&
    str.indexOf(`\\`) < 0
  );
}
