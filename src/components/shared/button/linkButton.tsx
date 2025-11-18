import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

interface Props {
  title: string;
  link: string;
}
const LinkButton = (props: Props) => {
  return (
    <Link href={props.link ?? "/-"} className="flex-grow">
      <Button className="rounded-full w-full">{props.title ?? "Tambah"}</Button>
    </Link>
  );
};

export default LinkButton;
