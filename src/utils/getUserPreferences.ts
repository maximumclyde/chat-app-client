import simulateWait from "./simulateWait";

async function getUserPreferences(userId: string) {
  await simulateWait();

  return {
    userId,
    lan: "en-US",
    colorTheme: "light",
  };
}

export default getUserPreferences;
