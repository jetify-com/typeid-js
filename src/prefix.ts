export function isValidPrefix(str: string): boolean {
  if (str.length > 63) {
    return false;
  }

  let code;
  let i;
  let len;

  for (i = 0, len = str.length; i < len; i += 1) {
    code = str.charCodeAt(i);
    const isLowerAtoZ = code > 96 && code < 123;
    const isUnderscore = code === 95;

    // first and last char of prefix can only be [a-z]
    if ((i === 0 || i === len - 1) && !isLowerAtoZ) {
      return false;
    }

    if (!(isLowerAtoZ || isUnderscore)) {
      return false;
    }
  }
  return true;
}
