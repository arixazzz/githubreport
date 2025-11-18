"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import GoogleIcon from "@/assets/Logo/GoogleIcon";

type AuthState = "loading" | "success" | "error";

export default function LoginCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  const [authState, setAuthState] = useState<AuthState>("loading");
  const [displayMessage, setDisplayMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Extract URL parameters
  useEffect(() => {
    const statusParam = params.get("status");
    const msgParam = params.get("msg");
    const tokenParam = params.get("token");

    setStatus(statusParam);
    setMessage(msgParam);
    setToken(tokenParam);
  }, [params]);

  // Handle authentication flow
  useEffect(() => {
    const handleCallback = async () => {
      // Show loading for at least 1.5 seconds for better UX
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (status === "fail") {
        setAuthState("error");
        setDisplayMessage(message ?? "Login gagal. Silakan coba lagi.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else if (status === "success" && token) {
        try {
          // Save token to cookie
          Cookie.set("accessToken", token);

          // Decode JWT token
          const decoded: decodedProps = jwtDecode(token);

          setAuthState("success");
          setDisplayMessage(message ?? "Login berhasil! Mengalihkan...");

          // Redirect based on role
          setTimeout(() => {
            if (decoded.role.toLowerCase() === "user") {
              router.push("/profile");
            } else {
              router.push("/dashboard");
            }
          }, 2000);
        } catch (error) {
          console.error("Gagal mendekode token:", error);
          setAuthState("error");
          setDisplayMessage("Terjadi kesalahan saat memproses token.");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        }
      } else {
        setAuthState("error");
        setDisplayMessage("Parameter tidak valid atau token tidak ditemukan.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    };

    if (status !== null) {
      handleCallback();
    }
  }, [status, message, token, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {authState === "loading" && (
          <div className="space-y-6">
            <div className="relative">
              <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                <GoogleIcon />
              </div>
              <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">Memproses...</h2>
              <p className="text-gray-600">
                Sedang menyelesaikan proses masuk dengan Google
              </p>
            </div>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        )}

        {authState === "success" && (
          <div className="space-y-6">
            <div className="relative">
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                <svg
                  className="w-10 h-10 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-green-500 rounded-full animate-ping opacity-20"></div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-green-800">Berhasil!</h2>
              <p className="text-gray-600">{displayMessage}</p>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full animate-pulse"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
        )}

        {authState === "error" && (
          <div className="space-y-6">
            <div className="relative">
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-red-500 rounded-full animate-ping opacity-20"></div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-red-800">Oops!</h2>
              <p className="text-gray-600">{displayMessage}</p>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="w-full py-3 px-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors font-medium"
            >
              Kembali ke Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
