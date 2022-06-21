/**
 * Check if the input is contains characters we can't save
 * @param str The input to check
 * @returns Whether the input is allowed
 */
export function isAllowed(str: string): boolean {
  return str !== undefined && str.indexOf(`"`) < 0 && str.indexOf(`\\`) < 0;
}

/**
 * Convert a regular string into a JSON compatible string
 * @param str The string to convert
 * @returns The string with all escape characters converted
 */
export function stringify(str: string): string {
  return str.replaceAll("\n", "[ENTER]");
}

/**
 * Convert a JSON compatible string into a regular string
 * @param str The string to convert
 * @returns The string with all escape characters converted
 */
export function parse(str: string): string {
  return str.replaceAll("[ENTER]", "\n");
}
