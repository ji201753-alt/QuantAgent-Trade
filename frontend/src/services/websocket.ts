export type WebSocketMessage = {
  type: string;
  data: any;
};

export class TerminalWebSocketService {
  private socket: WebSocket | null = null;
  private subscribers: ((msg: any) => void)[] = [];

  constructor(private url: string = "ws://localhost:5000/ws") {}

  connect() {
    this.socket = new WebSocket(this.url);
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.subscribers.forEach(cb => cb(data));
    };
    this.socket.onclose = () => {
      setTimeout(() => this.connect(), 2000); // Reconnect
    };
  }

  subscribe(callback: (msg: any) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }
}
