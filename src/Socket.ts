const socket = new WebSocket(String(import.meta.env.VITE_WS_URL));

export default socket;
