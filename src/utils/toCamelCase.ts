function toCamelCase(s: string) {
  const str = s.replace(/[^A-Za-z0-9#$_\-\s]/g, "");
  let res = "";
  for (const c of str.split(" ")) {
    res = res + c.charAt(0).toUpperCase() + c.slice(1).toLowerCase();
  }
  return res.charAt(0).toLowerCase() + res.slice(1);
}

export default toCamelCase;
