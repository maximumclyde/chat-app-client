function debounce<Params extends any[]>(
  func: (...args: Params) => any,
  timeout = 100
) {
  let timer: number | undefined = undefined;
  return function (...args: Params) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

export default debounce;
