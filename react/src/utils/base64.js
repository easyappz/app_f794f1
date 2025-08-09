export const ONE_MB = 1048576;

export function estimateBase64Bytes(value) {
  if (!value) return 0;
  const i = value.indexOf(',');
  const data = i >= 0 ? value.slice(i + 1) : value;
  const len = data.length;
  let padding = 0;
  if (data.endsWith('==')) padding = 2;
  else if (data.endsWith('=')) padding = 1;
  const bytes = Math.floor((len * 3) / 4) - padding;
  return bytes > 0 ? bytes : 0;
}

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
