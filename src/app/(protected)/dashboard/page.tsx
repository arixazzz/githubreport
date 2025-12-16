"use client";
import { Card } from "@/components/ui/card";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen from-indigo-500 via-purple-500 to-pink-500 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Bagian Breadcrumb */}
        <div className="mb-6 text-white">
          <BreadcrumbSetItem
            items={[
              {
                title: "Dashboard",
              },
            ]}
          />
        </div>

        {/* Bagian Konten Utama */}
        <Card className="shadow-2xl rounded-3xl p-8 bg-white">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Selamat Datang
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            GitRepo Platform - Platform Kolaborasi GitHub
          </p>
        </Card>
      </div>
    </div>
  );
}
