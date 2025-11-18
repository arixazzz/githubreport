"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Home, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="w-full place-content-center place-items-center flex flex-col h-[80vh]">
      <Card className="lg:w-1/2">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-7xl font-extrabold">500</CardTitle>
          <CardDescription className="text-2xl font-semibold text-foreground">
            Internal Server Error
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-5">
          <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto text-center">
            Maaf, terjadi kesalahan pada server kami. Tim teknis sedang bekerja
            untuk memperbaiki masalah ini. Silakan coba lagi dalam beberapa
            saat.
          </p>
          <div className="flex justify-center gap-5">
            <Button onClick={reset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Coba lagi
            </Button>

            <Link href={"/"}>
              <Button variant="outline">
                <Home className="w-4 h-4 mr-2" />
                Beranda
              </Button>
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Mail className="w-4 h-4" />
          <span>Butuh bantuan?</span>
          <Link href="w.me/+628" className="text-primary">
            Hubungi Support
          </Link>
        </CardFooter>
      </Card>
      <div className="mt-8 text-sm text-muted-foreground">
        <p>
          Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()} •
          <span className="ml-1">{new Date().toLocaleString("id-ID")}</span>
        </p>
      </div>
    </div>
  );
}
