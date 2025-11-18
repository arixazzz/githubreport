"use client";

import GoogleIcon from "@/assets/Logo/GoogleIcon";
import { BASE_URL } from "@/constants";
import { useRouter } from "next/navigation";

const GoogleSignInButton = ({ className = "" }) => {
  const router = useRouter();
  const handleGoogle = () => {
    router.push(`${BASE_URL}/auth/google`);
  };

  return (
    <button
      className={`flex items-center justify-center gap-3 w-full py-3 px-4 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow ${className}`}
      onClick={handleGoogle}
    >
      <GoogleIcon />
      <span className="text-sub font-medium">Masuk dengan Google</span>
    </button>
  );
};

export default GoogleSignInButton;
