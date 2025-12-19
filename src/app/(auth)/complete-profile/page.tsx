"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, Briefcase } from "lucide-react";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    if (position.trim() === "") {
      setError("Position tidak boleh kosong");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/user/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          position: position.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal melengkapi profil");
      }

      // Success - redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Error completing profile:", err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Lengkapi Profil Anda
          </CardTitle>
          <CardDescription className="text-center">
            Untuk melanjutkan, mohon lengkapi data berikut
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password (min. 6 karakter)"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Password akan digunakan untuk login selanjutnya
              </p>
            </div>

            {/* Position Field */}
            <div className="space-y-2">
              <Label htmlFor="position" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Position
              </Label>
              <Input
                id="position"
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Contoh: Frontend Developer, Backend Developer"
                required
              />
              <p className="text-xs text-gray-500">
                Posisi atau role Anda dalam tim
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md border border-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan & Lanjutkan"}
            </Button>

            {/* Info */}
            <div className="bg-blue-50 text-blue-700 p-3 rounded-md border border-blue-200 text-xs">
              <p className="font-medium mb-1">ℹ️ Informasi</p>
              <p>
                Data ini diperlukan untuk melengkapi profil Anda dan mengakses
                semua fitur aplikasi.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
