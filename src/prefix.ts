export function isValidPrefix(str: string): boolean {
  if (str.length > 63) {
    return false;
  }

  let code;
  let i;
  let len;

  for (i = 0, len = str.length; i < len; i += 1) {
    code = str.charCodeAt(i);
    if (!(code > 96 && code < 123)) {
      // lower alpha (a-z)
      return false;
    }
  }
  return true;
}
