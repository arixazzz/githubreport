"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";
import ActionOption from "@/components/table/actionOption";

// Definisi interface untuk pengguna
export interface ManajemenUserInterface {
  id: string;
  nama: string;
  email: string;
  role: string;
  githubUsername: string;
  password: string;
}

// Data dummy
export const dummyUser: ManajemenUserInterface[] = [
  {
    id: "1",
    nama: "faqih",
    email: "faqih@gmail.com",
    role: "Frontend Developer",
    githubUsername: "faqihdev",
    password: "password123",
  },
  {
    id: "2",
    nama: "Fajri",
    email: "fajri@gmail.com",
    role: "Backend Developer",
    githubUsername: "fajri-dev",
    password: "password456",
  },
  {
    id: "3",
    nama: "Dini",
    email: "dini@gmail.com",
    role: "Frontend Developer",
    githubUsername: "dini-dev",
    password: "password789",
  },
];

// Kolom untuk tabel pengguna
export const ManajemenUserColumns: ColumnDef<ManajemenUserInterface>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => row.original.id,
  },
  {
    accessorKey: "nama",
    header: "Nama",
    cell: ({ row }) => row.original.nama,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.email,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => row.original.role,
  },
  {
    accessorKey: "githubUsername",
    header: "GitHub Username",
    cell: ({ row }) => row.original.githubUsername,
  },
  {
    accessorKey: "password",
    header: "Password",
    cell: ({ row }) => row.original.password,
  },
  {
    accessorKey: "action",
    header: "Aksi",
    cell: ({ row }) => <ActionButtons row={row} />,
  },
];

// Komponen untuk tombol Edit dan Hapus
const ActionButtons = ({ row }: { row: any }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [users, setUsers] = useState(dummyUser);

  // Buka modal konfirmasi hapus
  const openDeleteModal = (user: any) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Tutup modal konfirmasi hapus
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  // Hapus pengguna dari daftar
  const handleDelete = () => {
    if (selectedUser) {
      setUsers(users.filter((user) => user.id !== selectedUser.id));
      closeDeleteModal();
    }
  };

  // Buka modal untuk edit data pengguna
  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // Tutup modal edit
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  // Simpan perubahan edit
  const handleSaveEdit = () => {
    console.log("Menyimpan perubahan untuk:", selectedUser);
    // Update pengguna di daftar users
    setUsers(
      users.map((user) => (user.id === selectedUser.id ? selectedUser : user))
    );
    closeEditModal(); // Tutup modal setelah simpan
  };

  return (
    <>
      {/* Tombol Edit */}
      <Button
        onClick={() => openEditModal(row.original)} // Membuka modal Edit
        className="text-yellow-500 bg-transparent border-0 p-0 hover:bg-transparent"
      >
        <PencilIcon size={20} />
      </Button>

      {/* Tombol Hapus */}
      <Button
        onClick={() => openDeleteModal(row.original)} // Membuka modal Hapus
        className="text-red-500 bg-transparent border-0 p-0 ml-2 hover:bg-transparent"
      >
        <TrashIcon size={20} />
      </Button>

      {/* Modal Konfirmasi Hapus */}
      {isDeleteModalOpen && (
        <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
          <div className="p-4">
            <h3 className="text-xl mb-4">Konfirmasi Penghapusan</h3>
            <p className="mb-4">
              Apakah Anda yakin ingin menghapus user {selectedUser?.nama}?
            </p>
            <div className="mt-4 flex justify-end">
              <Button onClick={closeDeleteModal} className="mr-2">
                Batal
              </Button>
              <Button onClick={handleDelete} className="bg-red-500 text-white">
                Hapus
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Edit */}
      {isEditModalOpen && (
        <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
          <div className="p-4">
            <h3 className="text-xl mb-4">Edit User: {selectedUser?.nama}</h3>
            {/* Form untuk edit data */}
            <div className="mb-4">
              <label className="block mb-2">Nama:</label>
              <input
                type="text"
                value={selectedUser?.nama || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, nama: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Email:</label>
              <input
                type="email"
                value={selectedUser?.email || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">GitHub Username:</label>
              <input
                type="text"
                value={selectedUser?.githubUsername || ""}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    githubUsername: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Password:</label>
              <input
                type="password"
                value={selectedUser?.password || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, password: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={closeEditModal} className="mr-2">
                Batal
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="bg-yellow-500 text-white"
              >
                Simpan
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

// Modal Component
export const Modal = ({ isOpen, onClose, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="bg-white rounded shadow-lg z-10 max-w-md w-full">
        {children}
      </div>
    </div>
  );
};
