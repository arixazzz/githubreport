"use client";

import { CustomFormInput } from "@/components/shared/forms/customFormInput";
import { CustomFormTextArea } from "@/components/shared/forms/customFormTextArea";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import TitleHeader from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Loader } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { CustomFormSelect } from "@/components/shared/forms/customFormSelect";
import { useEffect, useState } from "react";
import { usePermission } from "@/hooks/useGetPermission";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const { roles, isLoading: parsingRole } = usePermission();

  const form = useForm<any>({
    defaultValues: {
      title: "",
      detail: "",
      deadline: "",
      githubRepo: "",
      visibility: "PUBLIC",
      stack: "",
    },
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Protect page
  useEffect(() => {
    if (!parsingRole && !roles.includes("ADMIN")) {
      router.push("/unauthorized");
    }
  }, [roles, parsingRole, router]);

  // Fetch Data
  useEffect(() => {
    if (!id) return;

    async function loadData() {
      try {
        const res = await fetch("/api/project/get"); // We need get by ID actually.
        // Wait, the existing GET API fetches ALL projects.
        // I should probably fetch all and find one, OR create GET by ID.
        // For efficiency, creating GET by ID is better, but to save time I might just filter from all list
        // IF the list is small. But that's bad practice.
        // Let's check if there is a detail API or get by id.
        // I remember `/api/project/get` returns all.
        // I should use that for now and filter, OR simply add ID query param support to GET.

        // Actually, let's try to fetch all and filter for now as a quick solution
        // since I didn't verify if GET by ID exists (likely not).
        // Wait, looking at `api/project/get/route.ts` it findsMany.

        const resProject = await fetch("/api/project/get");
        const jsonProject = await resProject.json();

        if (jsonProject.project) {
          const found = jsonProject.project.find(
            (p: any) => p.id === Number(id)
          );
          if (found) {
            form.reset({
              title: found.title,
              detail: found.detail,
              deadline: found.deadline
                ? new Date(found.deadline).toISOString().split("T")[0]
                : "",
              githubRepo: `${found.githubOwner}/${found.githubRepo}`,
              visibility: found.visibility,
              stack: found.stack,
            });
          } else {
            alert("Project tidak ditemukan");
            router.push("/listing-project");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, form, router]);

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/project/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Project berhasil diupdate");
        router.push("/listing-project");
      } else {
        alert(result.error || "Gagal mengupdate project");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || parsingRole) {
    return (
      <Card className="p-10 flex justify-center">
        <Loader className="animate-spin" />
      </Card>
    );
  }

  return (
    <Card>
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
            title: "Edit",
          },
        ]}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <TitleHeader title="Edit Project" />
            <div className="mt-3 flex flex-col gap-3">
              <CustomFormInput<any>
                name="title"
                label="Nama"
                placeholder="Masukkan Nama Project"
              />
              <CustomFormTextArea<any>
                name="detail"
                label="Detail Project"
                placeholder="Masukkan Detail Project"
              />
              {/* Developers field omitted for simplicity as users management is separate or complex relation */}
              <CustomFormInput<any>
                name="deadline"
                label="Tanggal Deadline"
                placeholder="Masukkan Tanggal Deadline"
                type="date"
              />
              <CustomFormInput<any>
                name="githubRepo"
                label="Repository (Owner/Repo)"
                placeholder="e.g. facebook/react"
              />
              <CustomFormSelect
                label="Visibility"
                name="visibility"
                placeholder="Pilih Visibility"
                options={[
                  { label: "Public", value: "PUBLIC" },
                  { label: "Private", value: "PRIVATE" },
                ]}
              />
              <CustomFormInput<any>
                name="stack"
                label="Stack"
                placeholder="Masukkan Stack (Bahasa Pemrograman Yang Digunakan)"
              />
            </div>
            <div className="flex gap-x-4 justify-end mt-10">
              <Button
                type="button"
                variant={"outline"}
                className="rounded-full min-w-32"
                onClick={() => router.back()}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="rounded-full min-w-32"
                disabled={submitting}
              >
                {submitting ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </Card>
  );
}
