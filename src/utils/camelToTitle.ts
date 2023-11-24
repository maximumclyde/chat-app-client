function camelToTitle(str: string) {
  let res = str.replace(/([A-Z])/g, " $1");
  res = res.charAt(0).toUpperCase() + res.slice(1);
  return res;
}

export default camelToTitle;
