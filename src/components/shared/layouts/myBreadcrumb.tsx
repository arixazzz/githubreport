"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { create } from "zustand";
import { useStore } from "zustand";
import React, { useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { title: string; href?: string };

type BreadcrumbStore = {
  items: Crumb[];
  set: (items: Crumb[]) => void;
};

type BreadcrumbSetItemType = {
  items: Crumb[];
};

/**
 * Zustand store global untuk manajemen breadcrumb.
 *
 * ✅ Cara penggunaan:
 *
 * - Untuk mengatur seluruh breadcrumb:
 *   myBreadcrumb.set([
 *     { title: "Dashboard", href: "/dashboard" },
 *     { title: "Settings" },
 *   ]);
 *
 * - Untuk menambahkan satu item breadcrumb (misalnya nama dinamis):
 *   myBreadcrumb.append({ title: "Detail Siswa", href: "/siswa/123" });
 *
 * ⚠️ NOTE:
 * - Jika digunakan di luar komponen React, gunakan:
 *   `myBreadcrumb.getState().set(...)` atau `myBreadcrumb.getState().append(...)`
 */
export const myBreadcrumb = create<BreadcrumbStore>((set) => ({
  items: [],
  set: (items) =>
    set(() => ({
      items,
    })),
}));

/**
 * Komponen ini menampilkan breadcrumb yang bisa diatur secara dinamis
 * dari halaman mana pun dengan memanggil `myBreadcrumb.set([...])`
 * atau `myBreadcrumb.append({ title, href })`.
 *
 * Breadcrumb awal diambil dari struktur sidebar menggunakan helper `findBreadcrumb()`
 * berdasarkan pathname dan data dinamis `schoolLevels`.
 *
 * Jika breadcrumb masih kosong, akan muncul placeholder loading (`animate-pulse`)
 */
export const MyBreadcrumb = () => {
  const { items } = useStore(myBreadcrumb);

  return (
    <div className="flex flex-col">
      {items.length === 0 ? (
        <p className="font-semibold h-3 md:h-4 w-12 md:w-20 bg-gray-300 animate-pulse rounded-md mb-2" />
      ) : items[0].href ? (
        <Link
          href={items[0].href}
          className="font-semibold text-text-800 text-sm md:text-base"
        >
          {items[0].title}
        </Link>
      ) : (
        <p className="font-semibold text-text-800 text-sm md:text-base">
          {items[0].title}
        </p>
      )}
      <Breadcrumb>
        <BreadcrumbList className="!gap-y-0">
          {items.length === 0 ? (
            <>
              {[1, 2, 3].map((_, i) => (
                <React.Fragment key={i}>
                  <BreadcrumbItem>
                    <span className="block w-12 md:w-24 h-3 md:h-4 bg-gray-300 rounded animate-pulse" />
                  </BreadcrumbItem>
                  {i !== 2 && (
                    <BreadcrumbSeparator>
                      <ChevronRight />
                    </BreadcrumbSeparator>
                  )}
                </React.Fragment>
              ))}
            </>
          ) : (
            items.map((item, i) => {
              const isLast = i === items.length - 1;
              const isManyItem = items.length > 1 && i === 0;
              if (isManyItem) return;
              return (
                <React.Fragment key={i}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="text-primary font-semibold text-xs md:text-sm">
                        {item.title}
                      </BreadcrumbPage>
                    ) : item.href && item.href !== "#" ? (
                      <BreadcrumbLink asChild>
                        <Link
                          href={item.href}
                          className="text-text-600 text-xs md:text-sm"
                        >
                          {item.title}
                        </Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="text-text-600 text-xs md:text-sm">
                        {item.title}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {!isLast && (
                    <BreadcrumbSeparator>
                      <ChevronRight />
                    </BreadcrumbSeparator>
                  )}
                </React.Fragment>
              );
            })
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export const BreadcrumbSetItem = ({ items }: BreadcrumbSetItemType) => {
  const { set } = useStore(myBreadcrumb);
  useEffect(() => {
    set(items);
  }, [items, set]);
  return null;
};
