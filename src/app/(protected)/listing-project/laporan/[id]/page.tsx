"use client";

import React, { useState } from "react";

const Page = () => {
  type Row = {
    tanggal: string;
    repositoriDeveloper: string;
  };

  const [data, setData] = useState<Row[]>([
    {
      tanggal: "25 September 2025",
      repositoriDeveloper:
        "Update documentation and README with installation guide",
    },
    {
      tanggal: "25 September 2025",
      repositoriDeveloper: "Add user authentication system with JWT tokens",
    },
    {
      tanggal: "24 September 2025",
      repositoriDeveloper:
        "Fix bug in repository listing and improve performance",
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newData, setNewData] = useState<Row | null>(null);

  const handleEdit = (index: number) => {
    setIsEditing(true);
    setEditIndex(index);
    setNewData(data[index]);
  };

  const handleSave = () => {
    if (editIndex !== null && newData) {
      const updatedData = [...data];
      updatedData[editIndex] = newData;
      setData(updatedData);
      setIsEditing(false);
      setEditIndex(null);
      setNewData(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditIndex(null);
    setNewData(null);
  };

  return (
    <div>
      <h1>Project Report</h1>
      <table border={1} className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Tanggal</th>
            <th className="px-4 py-2">Repositori Developer</th>
            <th className="px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{item.tanggal}</td>
              <td className="border px-4 py-2">{item.repositoriDeveloper}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(index)}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Project</h2>
            <div className="mb-4">
              <label className="block mb-2">Tanggal</label>
              <input
                type="text"
                value={newData?.tanggal || ""}
                onChange={(e) =>
                  setNewData({ ...newData!, tanggal: e.target.value })
                }
                className="border px-3 py-2 w-full rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Repositori Developer</label>
              <input
                type="text"
                value={newData?.repositoriDeveloper || ""}
                onChange={(e) =>
                  setNewData({
                    ...newData!,
                    repositoriDeveloper: e.target.value,
                  })
                }
                className="border px-3 py-2 w-full rounded"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
