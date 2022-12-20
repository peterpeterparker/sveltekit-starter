// Source: https://stackoverflow.com/a/70891826/5404186
export const digestMessage = (message?: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  return crypto.subtle.digest('SHA-256', data);
};

export const sha256ToBase64String = (sha256: Iterable<number>): string =>
  btoa([...sha256].map((c) => String.fromCharCode(c)).join(''));

export const sha256 = async (blob: Blob): Promise<string> => {
  const uint8Array = new Uint8Array(await blob.arrayBuffer());
  const hashBuffer = await crypto.subtle.digest('SHA-256', uint8Array);

  // https://stackoverflow.com/a/74573524/5404186
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((h) => h.toString(16).padStart(2, '0')).join('');
}