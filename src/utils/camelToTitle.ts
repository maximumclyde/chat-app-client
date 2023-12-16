function camelToTitle(str: string) {
  let res = str.replace(
    /([A-Z]+)|(\d+)/g,
    function (_, g1: string, g2: string) {
      return " " + (g1 || g2);
    }
  );
  res = res.charAt(0).toUpperCase() + res.slice(1);
  return res;
}
export default camelToTitle;
