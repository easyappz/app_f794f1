export const ONE_MB = 1024 * 1024;

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = (e) => reject(e);
      reader.readAsDataURL(file);
    } catch (e) {
      reject(e);
    }
  });
}

export function estimateBase64Bytes(input) {
  let s = String(input || '');
  const comma = s.indexOf(',');
  if (comma >= 0) s = s.slice(comma + 1);
  const len = s.length;
  const padding = s.endsWith('==') ? 2 : (s.endsWith('=') ? 1 : 0);
  const bytes = Math.floor((len * 3) / 4) - padding;
  return bytes > 0 ? bytes : 0;
}
