"use client";

import { AiFillGithub } from "react-icons/ai"; // Menggunakan ikon GitHub dari react-icons
import { BASE_URL } from "@/constants"; // Pastikan BASE_URL sudah didefinisikan di constants
import { useRouter } from "next/navigation";
import { useState } from "react";

export const GitHubSignInButton = ({ className = "" }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const clientId = process.env.NEXT_PUBLIC_GITHUB_ID as string;
  const redirectUri = process.env.NEXT_PUBLIC_NEXTAUTH_URL as string;

  const githubLoginUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user user:email`;

  const handleGitHub = () => {
    try {
      // TODO: Integrasikan dengan NextAuth atau OAuth handler Anda
      window.location.href = githubLoginUrl;
    } catch (error) {
      console.error("Login error:", error);
    } // Mengarahkan ke endpoint GitHub
  };

  return (
    <button
      className={`flex items-center justify-center gap-3 w-full py-3 px-4 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow ${className}`}
      onClick={handleGitHub}
    >
      <AiFillGithub size={24} /> {/* Ikon GitHub dari react-icons */}
      <span className="text-sub font-medium">Masuk dengan GitHub</span>
    </button>
  );
};
