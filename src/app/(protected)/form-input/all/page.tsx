"use client";

import { useGetGeo } from "@/components/parts/maps/api";
import { CustomFormCalender } from "@/components/shared/forms/customFormCalender";
import CustomFormCheckbox from "@/components/shared/forms/customFormCheckbox";
import { CustomFormDragAndDrop } from "@/components/shared/forms/customFormDragAndDrop";
import CustomFormFileFotoProfile from "@/components/shared/forms/customFormFileFotoProfil";
import { CustomFormFileInput } from "@/components/shared/forms/customFormFileInput";
import CustomFormGmaps from "@/components/shared/forms/customFormGmaps";
import CustomFormGmapsPoligon from "@/components/shared/forms/customFormGmapsPoligon";
import {
  CustomFormInput,
  inputFilters,
} from "@/components/shared/forms/customFormInput";
import { CustomFormMultiSelect } from "@/components/shared/forms/customFormMultipleSelect";
import { CustomFormRadioGroup } from "@/components/shared/forms/customFormRadioGroup";
import { CustomFormSelect } from "@/components/shared/forms/customFormSelect";
import CustomFormSelectSearch from "@/components/shared/forms/customFormSelectSearch";
import { CustomFormSignature } from "@/components/shared/forms/customFormSignature";
import { CustomFormTextArea } from "@/components/shared/forms/customFormTextArea";
import CustomFormTime from "@/components/shared/forms/customFormTime";
import CustomFromRegions from "@/components/shared/forms/customFromRegions";
import { BreadcrumbSetItem } from "@/components/shared/layouts/myBreadcrumb";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

export default function Page() {
  const { data: geo } = useGetGeo();

  // State untuk simpan daftar opsi
  const [options, setOptions] = useState([
    { label: "Opsi 1", value: "opsi-1" },
    { label: "Opsi 2", value: "opsi-2" },
  ]);

  const form = useForm<any>({
    // resolver: zodResolver(),
    defaultValues: {
      mailAddress: "",
      phoneNumber: "",
      address: "",
      logo: undefined,
      polygon: [],
    },
  });

  const polyWatch = useWatch({ control: form.control, name: "polygon" });
  useEffect(() => {
    console.log("Polygon berubah:", polyWatch);
  }, [polyWatch]);

  const onSubmit = (data: any) => {};

  if (!geo) return null;

  return (
    <Card>
      <BreadcrumbSetItem
        items={[
          {
            title: "Dashboard",
            href: "/dashboard",
          },
          {
            title: "Semua Input",
          },
        ]}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-y-3 gap-x-4"
        >
          <CustomFormInput
            name="textBase"
            label="Text Base"
            placeholder="Masukkan Nama"
          />
          <CustomFormInput
            name="textMail"
            label="Email"
            placeholder="Masukkan email"
            filterInput={inputFilters.email}
          />
          <CustomFormInput
            name="phoneNumber"
            label="Telepon"
            placeholder="+62"
            filterInput={inputFilters.phone}
            mask="+62___-____-____"
          />
          <CustomFormTextArea
            name="address"
            label="Alamat"
            placeholder="Masukkan alamat"
          />
          <CustomFormCalender
            name="inputDate"
            label="Input Tanggal"
            placeholder="dd-MM-yyyy"
          />
          <CustomFormTime
            name="inputTime"
            label="Input Waktu"
            placeholder="HH:MM"
          />
          <CustomFormSignature name="inputSignature" label="Tanda tangan" />
          <CustomFormFileInput name="fileInput" label="File Input" />
          <CustomFormFileFotoProfile name="sds" label="Owner" />
          <CustomFormDragAndDrop
            // previewType="thumbnail" //thumbnail atau card
            name="fileDrop"
            label="Drop Zone"
            maxFiles={5}
          />
          <CustomFormRadioGroup
            name="radioGroup"
            label="Radio Group"
            options={[
              { label: "Opsi 1", value: "opsi-1" },
              { label: "Opsi 2", value: "opsi-2" },
            ]}
          />
          <CustomFormCheckbox
            name="checkbox"
            label="Checkbox Input"
            description="Deskripsi checkbox input"
            options={[
              { label: "Check 1", value: "1" },
              { label: "Check 2", value: "2" },
              { label: "Check 3", value: "3" },
            ]}
          />
          <CustomFormSelect name="select" label="Select" options={options} />
          <CustomFormSelectSearch
            name="selectSearch"
            label="Select Search"
            options={options}
          />
          <CustomFormSelectSearch
            name="selectSearchCreate"
            label="Select Search Create"
            options={options}
            onOptionCreate={(option, onSuccessSet) => {
              // tambahin ke state
              setOptions((prev) => [...prev, option]);

              // update value form secara otomatis
              onSuccessSet?.(option);
            }}
          />
          <CustomFormMultiSelect
            name="selectMultiple"
            label="Select Multiple"
            options={options}
          />
          <CustomFormMultiSelect
            name="selectMultipleCreate"
            label="Select Multiple Create"
            options={options}
            onOptionCreate={(option, onSuccessSet) => {
              // tambahin ke state
              setOptions((prev) => [...prev, option]);
              // update value form secara otomatis
              onSuccessSet?.(option);
            }}
          />
          <CustomFromRegions
            name="provincesCode"
            region="provinces"
            label="Provinsi"
            placeholder="Provinsi"
            className="col-span-2 md:col-span-1"
          />
          <CustomFromRegions
            name="citiesCode"
            region="cities"
            label="Kabupaten/Kota"
            placeholder="Kabupaten/kota"
            code={form.watch("provincesCode")}
            className="col-span-2 md:col-span-1"
          />
          <CustomFromRegions
            name="districtsCode"
            region="districts"
            label="Kecamatan"
            placeholder="Kecamatan"
            code={form.watch("citiesCode")}
            className="col-span-2 md:col-span-1"
          />
          <CustomFromRegions
            name="subdistrictsCode"
            region="villages"
            label="Kelurahan"
            placeholder="Kelurahan"
            code={form.watch("districtsCode")}
            className="col-span-2 md:col-span-1"
          />
          <CustomFormGmaps
            nameLat="lat"
            nameLong="lng"
            label="Maps"
            className="col-span-2 md:col-span-1"
            containerClassName="h-[52rem]" // jika ingin custom mapnya
            geoJson={geo}
          />
          <CustomFormGmapsPoligon name="polygon" label="Poligon" />
        </form>
      </Form>
    </Card>
  );
}
