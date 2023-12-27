/**
 * Function that converts an encoded string to a blob
 * @param str
 */
function toArrayBuffer(str: string) {
  const b64 = atob(str);
  const arr = new Uint8Array(b64.length);
  for (let i = 0; i < b64?.length; i++) {
    arr[i] = b64.charCodeAt(i);
  }

  return new Blob([arr], { type: "image/png" });
}

export default toArrayBuffer;
