import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import ModalDelete from "@/components/shared/modalDelete";
import Image from "next/image";
import ActionOption from "@/components/table/actionOption";
import { useActionState } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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

export const dummyUser: ManajemenUserInterface[] = [
  {
    id: "1",
    nama: "faqih",
    email: "faqih@gmail.com",
    role: "Frontend Developer",
  },
  {
    id: "2",
    nama: "Fajri",
    email: "fajri@gmail.com",
    role: "Backend Developer",
  },
  {
    id: "3",
    nama: "Dini",
    email: "dini@gmail.com",
    role: "Frontend Developer",
  },
];

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
    accessorKey: "action",
    header: "Aksi",
    cell: ({ row }) => <EditActionButton row={row} />,
  },
];
const EditActionButton = ({ row }: { row: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNama, setNewNama] = useState(row.original.nama);
  const [newEmail, setNewEmail] = useState(row.original.email);
  const [newRole, setNewRole] = useState(row.original.role);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSave = () => {
    // Simulate saving the edited data
    console.log("New Nama Saved:", newNama);
    console.log("New Email Saved:", newEmail);
    console.log("New Role Saved:", newRole);
    setIsModalOpen(false); // Close the modal after saving
  };

  return (
    <>
      <Button onClick={openModal} className="text-yellow-500">
        Edit
      </Button>

      {/* Modal for editing user data */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="p-4">
            <h3 className="text-xl mb-4">Edit User</h3>
            <div className="mb-4">
              <label
                htmlFor="nama"
                className="block text-sm font-medium text-gray-700"
              >
                Nama
              </label>
              <input
                id="nama"
                value={newNama}
                onChange={(e) => setNewNama(e.target.value)}
                className="w-full p-2 border rounded"
                type="text"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full p-2 border rounded"
                type="email"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <input
                id="role"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full p-2 border rounded"
                type="text"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={closeModal} className="mr-2">
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-blue-500 text-white">
                Save
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
