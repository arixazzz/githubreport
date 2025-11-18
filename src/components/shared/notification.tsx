/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import useGetToken from "@/hooks/useGetToken";
import useSocket from "@/hooks/useSocket";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "./toast/useToast";

export default function SocketNotificationCustom() {
  const qc = useQueryClient();
  const router = useRouter();
  const { decode } = useGetToken();

  const { toast } = useToast();

  const socket = useSocket();

  const handleTo = (refId?: number, type?: "incommingLetter") => {
    const generateLink = () => {
      switch (type) {
        case "incommingLetter":
          return `/incoming-mail/physical/surat-keluar/detail/${refId}`;
        default:
          return undefined;
      }
    };
    const link = generateLink();
    if (link && refId) router.push(link);
  };

  useEffect(() => {
    if (!socket) return;
    if (!decode) return;

    const register = () => {
      socket.emit("register_notif", { userId: decode.id }, () => {
        console.log("✅ register_notif");
      });
    };

    socket.on("connect", register);

    socket.on("receive_notification", (data: any) => {
      const audio = new Audio("/assets/audio/notification2.mp3");
      audio
        .play()
        .then(() => {
          toast.info(
            data.titile ?? "Title Notifikasi",
            data.message ?? "Pesan notifikasi",
            {
              action: {
                label: "Buka",
                onClick: () => {
                  handleTo(Number(data.refId), data.type);
                },
              },
              duration: 6000,
            }
          );
          qc.invalidateQueries({ queryKey: ["useGetNotificationCount"] });
        })
        .catch((error) => console.log("Error playing audio:", error));
    });

    return () => {
      socket.off("connect", register);
      socket.off("receive_notification");
    };
  }, [socket, decode, toast, router]);

  return null;
}
