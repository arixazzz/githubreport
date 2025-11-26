"use client";

import { AiFillGithub } from "react-icons/ai"; // Menggunakan ikon GitHub dari react-icons
import { BASE_URL } from "@/constants"; // Pastikan BASE_URL sudah didefinisikan di constants
import { useRouter } from "next/navigation";

const GitHubSignInButton = ({ className = "" }) => {
  const router = useRouter();

  const handleGitHub = () => {
    router.push(`${BASE_URL}/auth/github`); // Mengarahkan ke endpoint GitHub
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

export default GitHubSignInButton;
