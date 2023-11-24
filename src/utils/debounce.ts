function debounce<Params extends any[]>(
  func: (...args: Params) => any,
  timeout = 100
) {
  return function (...args: Params) {
    let timer: ReturnType<typeof setTimeout> = 0;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(args);
    }, timeout);
  };
}

export default debounce;
