async function simulateWait(time = 1500) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

export default simulateWait;
