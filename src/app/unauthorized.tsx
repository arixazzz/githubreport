"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useGetToken from "@/hooks/useGetToken";
import { ArrowLeft, Home, LogIn, ShieldX } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function Unauthorized() {
  const router = useRouter();
  const { token } = useGetToken();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <ShieldX className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Access Denied
          </CardTitle>
          <CardDescription className="text-gray-600">
            You don&apos;t have permission to access this resource. Please
            contact your administrator if you believe this is an error.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3">
            {!token && (
              <Button asChild className="w-full bg-sky-700 hover:bg-sky-600">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button className="w-full" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Need help?{" "}
              <Link href="/contact" className="text-blue-600 hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
