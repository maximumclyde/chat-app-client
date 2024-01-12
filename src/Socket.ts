const socket = new WebSocket(import.meta.env.VITE_WS_URL as string);

export default socket;
