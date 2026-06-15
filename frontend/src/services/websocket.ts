export type WebSocketMessage = {
  type: string;
  data: any;
};

export class TerminalWebSocketService {
  private socket: WebSocket | null = null;
  private subscribers: ((msg: any) => void)[] = [];
  private reconnectTimer: number | null = null;
  private manuallyClosed = false;

  constructor(private url: string = "ws://localhost:5000/ws") {}

  connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }
    this.manuallyClosed = false;
    this.socket = new WebSocket(this.url);
    this.socket.onopen = () => {
      this.subscribers.forEach(cb => cb({ type: "system_connection", data: { status: "connected" } }));
    };
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.subscribers.forEach(cb => cb(data));
    };
    this.socket.onclose = () => {
      this.subscribers.forEach(cb => cb({ type: "system_connection", data: { status: "disconnected" } }));
      if (!this.manuallyClosed) {
        this.reconnectTimer = window.setTimeout(() => this.connect(), 2000);
      }
    };
  }

  disconnect() {
    this.manuallyClosed = true;
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.socket?.close();
    this.socket = null;
  }

  subscribe(callback: (msg: any) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }
}

export const terminalWS = new TerminalWebSocketService();
