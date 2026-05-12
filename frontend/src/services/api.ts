export const fetchEngineStatus = async () => {
  const resp = await fetch('/status');
  return await resp.json();
};

export class DataStreamService {
  private ws: WebSocket | null = null;
  private listeners: Set<(data: any) => void> = new Set();

  connect() {
    this.ws = new WebSocket(`ws://${window.location.host}/ws`);
    this.ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      this.listeners.forEach(l => l(data));
    };
    this.ws.onclose = () => setTimeout(() => this.connect(), 3000);
  }

  subscribe(callback: (data: any) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
}
