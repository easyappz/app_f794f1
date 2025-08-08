'use strict';

function extractBase64Payload(value) {
  if (typeof value !== 'string') return '';
  const commaIndex = value.indexOf(',');
  const payload = commaIndex !== -1 ? value.slice(commaIndex + 1) : value;
  return payload.replace(/\s/g, '');
}

function estimateBase64Bytes(value) {
  if (!value || typeof value !== 'string') return 0;
  const base64 = extractBase64Payload(value);
  if (!base64) return 0;
  const len = base64.length;
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  const bytes = Math.floor((len * 3) / 4) - padding;
  return bytes < 0 ? 0 : bytes;
}

function isBase64Under1MB(value) {
  const MAX_BYTES = 1_000_000; // ~1 MB
  return estimateBase64Bytes(value) <= MAX_BYTES;
}

module.exports = {
  extractBase64Payload,
  estimateBase64Bytes,
  isBase64Under1MB,
};
