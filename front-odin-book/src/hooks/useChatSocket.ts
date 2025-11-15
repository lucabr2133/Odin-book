import { useEffect } from "react";
import { socket } from "../socket";

export function useChatSocket() {
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("Conectado con id:", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
}
