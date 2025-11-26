import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
// Minimal Modal fallback to avoid missing module during compilation
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
import { Button } from "@/components/ui/button"; // Asumsikan kamu punya komponen button

export const dummyLaporan: LaporanResponse[] = [
  {
    id: "1",
    date: "2023-10-01",
    name: "Benry",
    nameproject: "Project A",
    deskripsi: "Deskripsi singkat tentang Laporan Proyek A",
  },
];

export const laporanColumns: ColumnDef<LaporanResponse>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => row.original.id,
  },
  {
    accessorKey: "date",
    header: "Tanggal",
    cell: ({ row }) => row.original.date,
  },
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => row.original.name,
  },
  {
    accessorKey: "nameproject",
    header: "Nama Project",
    cell: ({ row }) => row.original.nameproject,
  },
  {
    accessorKey: "deskripsi",
    header: "Deskripsi",
    cell: ({ row }) => row.original.deskripsi,
  },
  {
    accessorKey: "action",
    header: "Aksi",
    cell: ({ row }) => <EditActionButton row={row} />,
  },
];

const EditActionButton = ({ row }: { row: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeskripsi, setNewDeskripsi] = useState(row.original.deskripsi);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSave = () => {
    // Simulate saving the edited deskripsi
    console.log("New Deskripsi Saved:", newDeskripsi);
    setIsModalOpen(false); // Close the modal after saving
  };

  return (
    <>
      <Button onClick={openModal} className="text-yellow-500">
        Edit
      </Button>

      {/* Modal for editing deskripsi */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="p-4">
            <h3 className="text-xl mb-4">Edit Deskripsi</h3>
            <textarea
              value={newDeskripsi}
              onChange={(e) => setNewDeskripsi(e.target.value)}
              className="w-full p-2 border rounded"
              rows={4}
            />
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
