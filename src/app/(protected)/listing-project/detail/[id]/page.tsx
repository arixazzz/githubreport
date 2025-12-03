"use client";

import React from "react";
import Link from "next/link";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";

// Data untuk detail project
const projectDetail = {
  name: "Aplikasi MPP Digital Kabupaten Lampung Timur",
  description: `Aplikasi MPP Digital di Kabupaten Lampung Timur menawarkan berbagai fitur unggulan untuk meningkatkan layanan publik. Pengguna dapat mengakses:
• Menu MPP, untuk informasi lengkap tentang layanan,
• Memesan jadwal antrean secara online melalui Booking Antrian,
• Mengajukan permohonan layanan secara digital dengan Permohonan Layanan.
Aplikasi ini juga memungkinkan pelacakan Riwayat Antrean dan Riwayat Permohonan.`,
  deadline: "30 November 2025",
  technology: "JavaScript, AWS EC2",
  developers: ["Developer A", "Developer B"],
};

const Page: React.FC = () => {
  return (
    <div className="p-8 bg-white rounded-lg shadow-sm">
      <BreadcrumbSetItem
        items={[
          {
            title: "Listing Project",
          },
          {
            title: "Listing Project",
            href: "/listing-project",
          },
          {
            title: "Detail",
          },
        ]}
      />

      {/* Deskripsi Project */}
      <div className="mb-8 p-6 bg-white rounded-xl border border-gray-300 shadow-md">
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          Detail Project
        </h2>
        <p className="text-sm text-gray-600 whitespace-pre-line">
          {projectDetail.description}
        </p>
      </div>

      {/* Developer yang Terlibat */}
      <div className="mb-8 p-6 bg-white rounded-xl border border-gray-300 shadow-md">
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          Developer yang Terlibat
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          {projectDetail.developers.map((developer, index) => (
            <li key={index} className="text-sm text-gray-600">
              {developer}
            </li>
          ))}
        </ul>
      </div>

      {/* Tanggal Deadline */}
      <div className="mb-8 p-6 bg-white rounded-xl border border-gray-300 shadow-md">
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          Tanggal Deadline
        </h2>
        <p className="text-sm text-gray-600">{projectDetail.deadline}</p>
      </div>

      <Link
        href="/listing-project"
        className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300"
      >
        Back to Project List
      </Link>
    </div>
  );
};

export default Page;
