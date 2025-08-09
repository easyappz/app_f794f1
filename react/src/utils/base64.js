export const ONE_MB = 1024 * 1024;

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    } catch (e) {
      reject(e);
    }
  });
}

function getBase64Data(value) {
  const s = String(value || '');
  const commaIndex = s.indexOf(',');
  if (s.startsWith('data:') && commaIndex !== -1) {
    return s.slice(commaIndex + 1);
  }
  return s;
}

export function estimateBase64Bytes(value) {
  const data = getBase64Data(value);
  const len = data.length;
  if (!len) return 0;
  let padding = 0;
  const last = data.charAt(len - 1);
  const prev = data.charAt(len - 2);
  if (last === '=') padding += 1;
  if (prev === '=') padding += 1;
  const bytes = Math.floor((len * 3) / 4) - padding;
  return bytes > 0 ? bytes : 0;
}
