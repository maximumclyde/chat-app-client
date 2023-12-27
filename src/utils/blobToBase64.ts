/**
 * Function used to convert a byte stream to base 64
 * @param stream
 */
async function blobToBase64(stream: Blob | File): Promise<string> {
  const reader = new FileReader();
  reader.readAsText(stream, "base64");

  return new Promise((resolve) => {
    reader.onloadend = function (e) {
      resolve((e.target?.result as string) || "");
    };
  });
}

export default blobToBase64;
