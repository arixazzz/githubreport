import { BASE_URL } from "@/constants";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function useSocket() {
  const Socket_URL = BASE_URL?.replace(/\/api\/?$/, ""); // hapus '/api' di akhir saja
  const [socket, setSocket] = useState<Socket | null>(null);
  // const { toast } = useToast();

  useEffect(() => {
    if (Socket_URL) {
      // Inisialisasi koneksi ke server Socket.IO
      const socketInstance = io(Socket_URL);

      setSocket(socketInstance);
      console.log("Socket connected ");
      // toast.success("soket", "berhasil terhubung");

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [Socket_URL]);

  return socket;
}
