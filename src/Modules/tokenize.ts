export interface TokenizingProps {
  token: string;
  tokenizedString: string;
}
export function base64Encode(data: string): string {
  const base64Chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._";

  let result = "";
  let i = 0;

  while (i < data.length) {
    const byte1 = data.charCodeAt(i++) & 0xff;
    const byte2 = data.charCodeAt(i++) & 0xff;
    const byte3 = data.charCodeAt(i++) & 0xff;

    const enc1 = byte1 >> 2;
    const enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
    let enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
    let enc4 = byte3 & 63;

    if (isNaN(byte2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(byte3)) {
      enc4 = 64;
    }

    result +=
      base64Chars.charAt(enc1) +
      base64Chars.charAt(enc2) +
      (enc3 === 64 ? "=" : base64Chars.charAt(enc3)) +
      (enc4 === 64 ? "=" : base64Chars.charAt(enc4));
  }

  return result;
}
export function base64Decode(encodedString: string): string {
  const base64Chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._";

  let result = "";
  let i = 0;

  while (i < encodedString.length) {
    const enc1 = base64Chars.indexOf(encodedString.charAt(i++));
    const enc2 = base64Chars.indexOf(encodedString.charAt(i++));
    const enc3 = base64Chars.indexOf(encodedString.charAt(i++));
    const enc4 = base64Chars.indexOf(encodedString.charAt(i++));

    const byte1 = (enc1 << 2) | (enc2 >> 4);
    const byte2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    const byte3 = ((enc3 & 3) << 6) | enc4;

    result += String.fromCharCode(byte1);
    if (enc3 !== 64) {
      result += String.fromCharCode(byte2);
    }
    if (enc4 !== 64) {
      result += String.fromCharCode(byte3);
    }
  }

  return result;
}
export class UTF8STRING {
  static encode(string: string): string {
    const textEncoder = new TextEncoder();
    const encodedUTF8 = textEncoder.encode(string);
    return Array.from(encodedUTF8)
      .map((byte) => String.fromCharCode(byte))
      .join("");
  }

  static decode(encodedString: string): string {
    const decodedBytes = Uint8Array.from(encodedString, (c) => c.charCodeAt(0));
    const textDecoder = new TextDecoder();
    return textDecoder.decode(decodedBytes);
  }
}

export function tokenize(string: string): TokenizingProps {
  const base30token = Math.random().toString(36).substring(2);
  const token = base30token;
  const splitted = string.split(/\s+|_/).slice(0, 3);
  const tokenizedString = splitted.map((str) => base64Encode(str)).join(token);

  return { token, tokenizedString };
}

export function detokenize(tokenizedString: string, token: string): string {
  const decodedTokenizedString = tokenizedString
    .split(token)
    .map((encstr) => base64Decode(encstr))
    .join(" ");
  return decodedTokenizedString;
}
