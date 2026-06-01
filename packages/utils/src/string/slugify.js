function isWordChar(char) {
  if (char.length !== 1) {
    return false;
  }
  const code = char.charCodeAt(0);
  return (
    (code >= 48 && code <= 57) || (code >= 97 && code <= 122) || code === 95
  );
}
function isSeparatorChar(char) {
  return char === ' ' || char === '_' || char === '-';
}
/**
 * Converts text to a URL slug in linear time (no nested quantifiers on user input).
 */
export function slugify(text) {
  const lower = text.toLowerCase();
  let slug = '';
  let needsSeparator = false;
  for (const char of lower) {
    if (!isWordChar(char) && !isSeparatorChar(char)) {
      continue;
    }
    if (isSeparatorChar(char)) {
      if (slug.length > 0) {
        needsSeparator = true;
      }
      continue;
    }
    if (needsSeparator) {
      slug += '-';
      needsSeparator = false;
    }
    slug += char;
  }
  return slug;
}
