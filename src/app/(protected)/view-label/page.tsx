import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import ValueLabel from "@/components/shared/valueLabel";
import React from "react";

export const access: AccessRule = {
  permissions: [""],
  roles: [""],
};

export default function Page() {
  return (
    <div className="p-4 flex flex-col gap-10">
      <BreadcrumbSetItem
        items={[{ title: "Dashboard", href: "/dashboard" }, { title: "" }]}
      />
      {/* vertikal */}
      <div className="grid grid-cols-2 gap-4">
        <ValueLabel label="Nama" value="Hamdan" required />
        <ValueLabel label="Kelas" value="3 Smp" />
      </div>
      {/* horizontal */}
      <div className="grid grid-cols-2 gap-4">
        <ValueLabel
          label="Nama"
          value="Hamdan"
          orientation="horizontal"
          required
        />
        <ValueLabel label="Kelas" value="3 Smp" orientation="horizontal" />
      </div>
      {/* horizontal breetween */}
      <div className="grid grid-cols-2 gap-4">
        <ValueLabel
          label="Nama"
          value="Hamdan"
          orientation="between"
          required
        />
        <ValueLabel label="Kelas" value="3 Smp" orientation="between" />
      </div>
      {/* Input */}
      <div className="grid grid-cols-2 gap-4">
        <ValueLabel label="Nama" value="Hamdan" variant={"input"} required />
        <ValueLabel label="Kelas" value="3 Smp" variant={"input"} />
      </div>
      {/* Input Disable*/}
      <div className="grid grid-cols-2 gap-4">
        <ValueLabel
          label="Nama"
          value="Hamdan"
          variant={"input"}
          disabled
          required
        />
        <ValueLabel label="Kelas" value="3 Smp" variant={"input"} disabled />
      </div>
      {/* Input */}
      <div className="grid grid-cols-2 gap-4">
        <ValueLabel
          label="Nama"
          value="Hamdan"
          variant={"input"}
          orientation="horizontal"
          required
        />
        <ValueLabel
          label="Kelas"
          value="3 Smp"
          variant={"input"}
          orientation="horizontal"
        />
      </div>
    </div>
  );
}
