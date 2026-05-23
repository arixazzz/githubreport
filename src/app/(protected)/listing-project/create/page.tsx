"use client";

import {
  CustomFormInput,
  inputFilters,
} from "@/components/shared/forms/customFormInput";
import { CustomFormTextArea } from "@/components/shared/forms/customFormTextArea";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import TitleHeader from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { CustomFormMultiSelect } from "@/components/shared/forms/customFormMultipleSelect";
import { CustomFormSelect } from "@/components/shared/forms/customFormSelect";
import { useEffect, useState } from "react";

export const access: AccessRule = {
  permissions: [""], // optional overide role jika ada permission
  roles: [""], // optional
};

export default function Page() {
  const router = useRouter();
  const form = useForm<any>({
    defaultValues: {
      deadline: "",
      developers: [], // Default empty array for developers
    },
  });

  const [users, setUsers] = useState<any[]>([]); // Users state
  const [loading, setLoading] = useState<boolean>(true); // Loading state for users

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/users/get", {
          method: "GET",
        });

        if (res.ok) {
          const json = await res.json();
          setUsers(json.users || []);
        } else {
          throw new Error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      // Format payload to match backend schema
      // Handle potential existing owner in repo name
      let finalRepo = data.githubRepo;
      if (!finalRepo.includes("/") && data.githubOwner) {
        finalRepo = `${data.githubOwner}/${finalRepo}`;
      }

      const payload = {
        title: data.title,
        detail: data.detail,
        deadline: data.deadline,
        stack: data.stack,
        visibility: data.visibility || "PUBLIC",
        // Combine owner and repo for validation
        githubRepo: finalRepo,
        // Map developers to userIds and ensure they are numbers
        userIds: (data.developers || []).map((id: any) => Number(id)),
      };

      console.log("DEBUG: Sending Payload:", JSON.stringify(payload, null, 2));

      const response = await fetch("/api/project/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("DEBUG: Response Status:", response.status);
      const result = await response.json();
      console.log("DEBUG: Response Result:", result);

      if (response.ok) {
        alert(result.message);
        router.push("/listing-project");
      } else {
        let errorMessage = `Error (${response.status}): ${result.error || "Something went wrong"}`;

        // Show detailed validation errors if available
        if (result.details) {
          if (
            typeof result.details === "object" &&
            !Array.isArray(result.details) &&
            result.details !== null
          ) {
            const validationErrors = Object.entries(result.details)
              .map(([key, value]: [string, any]) => {
                if (value && value._errors && Array.isArray(value._errors)) {
                  return `${key}: ${value._errors.join(", ")}`;
                }
                return null;
              })
              .filter(Boolean)
              .join("\n");

            if (validationErrors) {
              errorMessage += `\n\n${validationErrors}`;
            }
          } else {
            errorMessage += `\n${JSON.stringify(result.details)}`;
          }
        }

        alert(errorMessage);
        console.error("Submission Error Details:", result);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      alert(`Terjadi kesalahan sistem: ${error}`);
    }
  };
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
            title: "Tambah",
          },
        ]}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <TitleHeader title="Tambah Project" />
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
              <CustomFormMultiSelect
                label="Developer"
                name="developers"
                options={
                  users.length > 0
                    ? users.map((user) => ({
                        label: `${user.nama} (${user.position})`,
                        value: String(user.id),
                      }))
                    : [
                        {
                          label: "No developers available",
                          value: "",
                        },
                      ]
                }
              />
              <CustomFormInput<any>
                name="deadline"
                label="Tanggal Deadline"
                placeholder="Masukkan Tanggal Deadline"
                type="date"
              />
              <CustomFormInput<any>
                name="githubOwner"
                label="GitHub Owner"
                placeholder="masukkan username github"
              />
              <CustomFormInput<any>
                name="githubRepo"
                label="GitHub Repository"
                placeholder="e.g. react"
                description="masukkan nama repo"
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
                disabled={false}
              >
                {false ? <Loader className="animate-spin" /> : "Simpan"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </Card>
  );
}
