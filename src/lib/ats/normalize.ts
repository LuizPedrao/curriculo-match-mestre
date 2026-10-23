/** Lowercase, strip accents, turn punctuation into spaces (keeps + and #), collapse spaces. */
export function normalize(text: string): string {
  return ` ${text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9+#]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;
}

/** Whole-word / whole-phrase containment on normalized text (no accidental substrings). */
export function containsPhrase(normalizedText: string, normalizedPhrase: string): boolean {
  const p = normalizedPhrase.trim();
  if (!p) return false;
  return normalizedText.includes(` ${p} `);
}
