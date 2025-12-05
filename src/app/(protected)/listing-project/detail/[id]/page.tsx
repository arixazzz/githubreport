// "use client"

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { useSearchParams } from "next/navigation";

// type BreadcrumbItem = {
//   title: string;
//   href?: string;
// };

// const BreadcrumbSetItem: React.FC<{ items: BreadcrumbItem[] }> = ({
//   items,
// }) => {
//   return (
//     <nav aria-label="breadcrumb" className="mb-6">
//       <ol className="flex space-x-2 text-sm text-white">
//         {items.map((item, idx) => (
//           <li key={idx} className="inline-flex items-center">
//             {item.href ? (
//               <Link href={item.href} className="underline">
//                 {item.title}
//               </Link>
//             ) : (
//               <span>{item.title}</span>
//             )}
//             {idx < items.length - 1 && <span className="mx-2">/</span>}
//           </li>
//         ))}
//       </ol>
//     </nav>
//   );
// };

// // Data untuk detail project
// // const projectDetail = {
// //   name: "Aplikasi MPP Digital Kabupaten Lampung Timur",
//   description: `Aplikasi MPP Digital di Kabupaten Lampung Timur menawarkan berbagai fitur unggulan untuk meningkatkan layanan publik. Pengguna dapat mengakses:
// • Menu MPP, untuk informasi lengkap tentang layanan,
// • Memesan jadwal antrean secara online melalui Booking Antrian,
// • Mengajukan permohonan layanan secara digital dengan Permohonan Layanan.
// Aplikasi ini juga memungkinkan pelacakan Riwayat Antrean dan Riwayat Permohonan.`,
// //   deadline: "30 November 2025",
// //   technology: "JavaScript, AWS EC2",
// //   developers: ["Developer A", "Developer B"],
// // };

// interface Project {
//   id: number;
//   title: string;
//   detail: string;
//   deadline: string;
//   stack: string;
//   linkgithub: string;
// }

// const Page = ({ params }: { params: { id: string } }) => {

//   const { id} = params

//   const [data, setData] = useState<Project | null>(null);
//   const [load, setLoad] = useState(false)
//   const [err , setErr] = useState<any>(null)

//   useEffect(() => {

//     if(!id) {
//       setErr('projenct Not Found');
//     }
//     const faetchData = async (id : number) => {
//       setLoad(true)
//       try {
//         const res = await fetch(`/api/project/get/${id}`);
//         const data = await res.json();
//         if (data.project) {
//           setData(data.project);
//         } else {
//           setErr('projenct Not Found');
//         }
//         setLoad(false);
//       } catch (error) {
//         setErr("An error occurred while fetching project details");
//         setLoad(false);
//       }
//     }
//     faetchData(Number(id))

//   }, [id])

//   return (
//     <div className="p-8 bg-gradient-to-r from-blue-200 to-blue-500 rounded-lg shadow-lg">
//       <BreadcrumbSetItem
//         items={[
//           {
//             title: "Listing Project",
//           },
//           {
//             title: "Listing Project",
//             href: "/listing-project",
//           },
//           {
//             title: "Detail",
//           },
//         ]}
//       />
//       <h1 className="text-3xl font-extrabold text-white mb-6">
//         {data?.title}
//       </h1>

//       {/* Deskripsi Project */}
//       <div className="mb-8 p-6 bg-white rounded-xl shadow-md">
//         <h2 className="text-xl font-medium text-gray-700 mb-4">
//           Detail Project
//         </h2>
//         <p className="text-sm text-gray-600 whitespace-pre-line">
//           {data?.detail}
//         </p>
//       </div>

//       {/* Developer yang Terlibat */}
//      <div className="mb-8 p-6 bg-white rounded-xl shadow-md">
//         <h2 className="text-xl font-medium text-gray-700 mb-4">Developer yang Terlibat</h2>
//         <ul className="list-disc pl-5 space-y-2">
//           {data?.developers.map((developer, index) => (
//             <li key={index} className="text-sm text-gray-600">
//               {developer}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Tanggal Deadline */}
//       <div className="mb-8 p-6 bg-white rounded-xl shadow-md">
//         <h2 className="text-xl font-medium text-gray-700 mb-4">
//           Tanggal Deadline
//         </h2>
//         <p className="text-sm text-gray-600">{data?.deadline}</p>
//       </div>

//       <Link
//         href="/listing-project"
//         className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-300"
//       >
//         Back to Project List
//       </Link>
//     </div>
//   );
// };

// export default Page;

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

type BreadcrumbItem = {
  title: string;
  href?: string;
};

const BreadcrumbSetItem: React.FC<{ items: BreadcrumbItem[] }> = ({
  items,
}) => {
  return (
    <nav aria-label="breadcrumb" className="mb-6">
      <ol className="flex space-x-2 text-sm text-white">
        {items.map((item, idx) => (
          <li key={idx} className="inline-flex items-center">
            {item.href ? (
              <Link href={item.href} className="underline">
                {item.title}
              </Link>
            ) : (
              <span>{item.title}</span>
            )}
            {idx < items.length - 1 && <span className="mx-2">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
};

interface Project {
  id: number;
  title: string;
  detail: string;
  deadline: string;
  stack: string;
  linkgithub: string;
  // developers: string[]; // Developers are an array of strings
}

const Page = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const [data, setData] = useState<Project | null>(null);
  const [load, setLoad] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setErr("Project ID not found");
      setLoad(false);
      return;
    }

    const fetchData = async (id: number) => {
      setLoad(true);
      try {
        const res = await fetch(`/api/project/get/${id}`);
        const data = await res.json();
        if (data.project) {
          setData(data.project);
        } else {
          setErr("Project not found");
        }
        setLoad(false);
      } catch (error) {
        setErr("An error occurred while fetching project details");
        setLoad(false);
      }
    };
    fetchData(Number(id));
  }, [id]);

  if (load) {
    return <p>Loading...</p>;
  }

  if (err) {
    return <p>{err}</p>;
  }

  if (!data) {
    return <p>Project not found</p>;
  }

  const formattedDeadline = new Date(data.deadline).toLocaleDateString(
    "id-ID",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <div className="p-8 bg-gradient-to-r from-blue-200 to-blue-500 rounded-lg shadow-lg">
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
      <h1 className="text-3xl font-extrabold text-white mb-6">{data.title}</h1>

      {/* Deskripsi Project */}
      <div className="mb-8 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          Detail Project
        </h2>
        <p className="text-sm text-gray-600 whitespace-pre-line">
          {data.detail}
        </p>
      </div>

      {/* Developer yang Terlibat */}
      {/* <div className="mb-8 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-medium text-gray-700 mb-4">Developer yang Terlibat</h2>
        <ul className="list-disc pl-5 space-y-2">
          {data.developers.map((developer, index) => (
            <li key={index} className="text-sm text-gray-600">
              {developer}
            </li>
          ))}
        </ul>
      </div> */}

      {/* Tanggal Deadline */}
      <div className="mb-8 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-medium text-gray-700 mb-4">
          Tanggal Deadline
        </h2>
        <p className="text-sm text-gray-600">{formattedDeadline}</p>
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
