import { ColumnDef } from "@tanstack/react-table";
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

export const ManajemenUserColumns: ColumnDef<ManajemenUserInterface>[] = [
  {
    accessorKey: "no",
    header: "NO.",
    cell: ({ row }) => row.index + 1, // NOMOR URUT LOOPING
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
    accessorKey: "position",
    header: "Jabatan",
    cell: ({ row }) => row.original.position,
  },
  {
    accessorKey: "role",
    header: "Peran",
    cell: ({ row }) => row.original.role,
  },
  {
    accessorKey: "action",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <EditActionButton row={row} />
        <DeleteActionButton row={row} />
      </div>
    ),
  },
];
const EditActionButton = ({ row }: { row: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNama, setNewNama] = useState(row.original.nama);
  const [newEmail, setNewEmail] = useState(row.original.email);
  const [newPosition, setNewPosition] = useState(row.original.position);
  const [newRole, setNewRole] = useState(row.original.role);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSave = async () => {
    const updateData = await fetch(`/api/users/update/${row.original.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nama: newNama,
        email: newEmail,
        position: newPosition,
        role: newRole,
      }),
    });

    if (updateData.status === 200) {
      alert("Pengguna berhasil diupdate");
      window.location.reload();
    }
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
                htmlFor="position"
                className="block text-sm font-medium text-gray-700"
              >
                Jabatan
              </label>
              <input
                id="position"
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                className="w-full p-2 border rounded"
                type="text"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Peran
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

const DeleteActionButton = ({ row }: { row: any }) => {
  const handleDelete = async () => {
    const confirmDelete = confirm(
      `Yakin ingin menghapus pengguna ${row.original.nama}?`
    );

    if (!confirmDelete) return;

    const res = await fetch(`/api/users/delete/${row.original.id}`, {
      method: "DELETE",
    });

    if (res.status === 200) {
      alert("Pengguna berhasil dihapus");
      window.location.reload();
    } else {
      alert("Gagal menghapus pengguna");
    }
  };

  return (
    <Button onClick={handleDelete} className="text-red-500">
      Delete
    </Button>
  );
};
