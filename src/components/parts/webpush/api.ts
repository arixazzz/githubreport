import { arrayBufferToBase64, urlBase64ToUint8Array } from "@/lib/utils";
import { SubscriptionPayload, SubscriptionSchema } from "./validation";
import { sendData } from "@/services/api/fetcher";

type EnsureArgs = {
  vapidPublicKey?: string;
  apiBaseUrl?: string;
  subscribePath?: string;
};

export async function ensureWebPushSubscription({
  vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  subscribePath = "web-push/subscribe",
}: EnsureArgs = {}) {
  if (typeof window === "undefined") return null; // SSR guard

  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Browser tidak mendukung Service Worker / Push API");
    return null;
  }

  if (!vapidPublicKey) {
    console.error("VAPID public key kosong. Set NEXT_PUBLIC_VAPID_PUBLIC_KEY");
    return null;
  }

  const perm = await Notification.requestPermission();
  if (perm !== "granted") return null;

  const reg = await navigator.serviceWorker.register("/sw.js");

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });
  }

  const body: SubscriptionPayload = {
    endpoint: sub.endpoint,
    keys: {
      p256dh: arrayBufferToBase64(sub.getKey("p256dh")),
      auth: arrayBufferToBase64(sub.getKey("auth")),
    },
    expirationTime: sub.expirationTime,
    userAgent: navigator.userAgent,
  };

  const parsed = SubscriptionSchema.safeParse(body);
  if (!parsed.success) {
    console.error("Payload subscribe tidak valid:", parsed.error.format());
    return null;
  }

  await sendData(subscribePath, body, "POST");
  return sub;
}

export async function unsubscribeWebPush() {
  if (typeof window === "undefined") return false;
  if (!("serviceWorker" in navigator) || !("PushManager" in window))
    return false;

  const reg =
    (await navigator.serviceWorker.getRegistration("/sw.js")) ||
    (await navigator.serviceWorker.ready);

  if (!reg) return false;

  const sub = await reg.pushManager.getSubscription();
  if (!sub) return true;

  try {
    await sendData("web-push/unsubscribe", { endpoint: sub.endpoint }, "POST");
  } catch (e) {
    console.warn("Gagal hapus subscription di BE, lanjut unsubscribe FE:", e);
  }

  return sub.unsubscribe();
}
