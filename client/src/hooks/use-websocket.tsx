import { useEffect, useRef, useState } from "react";

export function useWebSocket(path: string, onMessage?: (data: any) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = () => {
    // Don't try to connect if we already have a connection
    if (wsRef.current?.readyState === WebSocket.CONNECTING || 
        wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') return;

      // Use current origin but with ws protocol
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}${path}`;
      
      // Validate URL before creating WebSocket
      try {
        new URL(wsUrl); // This will throw if URL is invalid
      } catch {
        return; // Invalid URL, don't attempt connection
      }
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setIsConnected(true);
      };

      wsRef.current.onclose = (event) => {
        setIsConnected(false);
        // Only reconnect on unexpected closes and if path is valid
        if (event.code !== 1000 && path === '/ws') {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 10000); // Increase to 10 seconds
        }
      };

      wsRef.current.onerror = () => {
        setIsConnected(false);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage?.(data);
        } catch {
          // Silently ignore parsing errors
        }
      };
    } catch {
      // Silently ignore all connection errors
      setIsConnected(false);
    }
  };

  const sendMessage = (data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
    // Silently ignore if not connected
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [path]);

  return {
    isConnected,
    sendMessage,
  };
}
