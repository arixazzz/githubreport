"use client";

import { AiFillGithub } from "react-icons/ai"; // Menggunakan ikon GitHub dari react-icons

const GitHubSignInButton = ({ className }: { className?: string }) => {
  const handleGithubLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = `${window.location.origin}/login/callback`;
    const scope = "read:user user:email";

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}`;

    window.location.href = githubAuthUrl;
  };

  return (
    <button
      className={`flex items-center justify-center gap-3 w-full py-3 px-4 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow ${className}`}
      onClick={handleGithubLogin}
    >
      <AiFillGithub size={24} /> {/* Ikon GitHub dari react-icons */}
      <span className="text-sub font-medium">Masuk dengan GitHub</span>
    </button>
  );
};

export default GitHubSignInButton;
