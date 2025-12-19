"use client";

import { AiFillGithub } from "react-icons/ai";

export function GitHubSignInButton() {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_ID!;

  const handleGitHubLogin = () => {
    const redirectUri = `${window.location.origin}/api/auth/github`;

    const githubLoginUrl =
      `https://github.com/login/oauth/authorize` +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=read:user user:email`;

    window.location.href = githubLoginUrl;
  };

  return (
    <button
      type="button"
      onClick={handleGitHubLogin}
      className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-white rounded-full shadow hover:shadow-md"
    >
      <AiFillGithub size={22} />
      <span className="font-medium">Masuk dengan GitHub</span>
    </button>
  );
}
