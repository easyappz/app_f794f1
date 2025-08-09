const ONE_MB = 1024 * 1024;

function isString(v) {
  return typeof v === 'string';
}

function normalize(s) {
  return isString(s) ? s.trim() : s;
}

function isValidEmailBasic(email) {
  if (!isString(email)) return false;
  const e = normalize(email).toLowerCase();
  if (e.length < 5 || e.length > 254) return false;
  if (e.includes(' ')) return false;
  const at = e.indexOf('@');
  if (at <= 0) return false; // nothing before @
  const domain = e.slice(at + 1);
  if (!domain || domain.length < 3) return false;
  const dot = domain.lastIndexOf('.');
  if (dot <= 0 || dot === domain.length - 1) return false; // dot not found or last char
  return true;
}

function base64Data(str) {
  if (!isString(str)) return '';
  const commaIdx = str.indexOf(',');
  if (commaIdx >= 0) return str.slice(commaIdx + 1);
  return str;
}

function base64Bytes(str) {
  try {
    const data = base64Data(str);
    return Buffer.from(data, 'base64').length;
  } catch (e) {
    // if decode fails, consider invalid/too big
    return Number.MAX_SAFE_INTEGER;
  }
}

function parseLimit(val) {
  const n = Number(val);
  if (!Number.isFinite(n)) return { ok: false };
  const i = Math.floor(n);
  if (i < 1 || i > 50) return { ok: false };
  return { ok: true, value: i };
}

function parseCursor(val) {
  if (val === undefined || val === null || val === '') return { ok: true, value: undefined };
  const d = new Date(String(val));
  if (isNaN(d.getTime())) return { ok: false };
  return { ok: true, value: d };
}

module.exports = {
  ONE_MB,
  isString,
  normalize,
  isValidEmailBasic,
  base64Data,
  base64Bytes,
  parseLimit,
  parseCursor,
};
