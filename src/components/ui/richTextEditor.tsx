"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown, Plus, Image as ImageIcon } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef } from "react";
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

/* ============ Table (Quill v2) ============ */
import TableUp, {
  defaultCustomSelect,
  TableSelection,
  TableMenuContextmenu,
  TableResizeScale,
  TableResizeLine,
} from "quill-table-up";
import "quill-table-up/index.css";
import "quill-table-up/table-creator.css";
Quill.register({ [`modules/${TableUp.moduleName}`]: TableUp }, true);

/* ============ Image resize (Quill v2) ============ */
import BlotFormatter from "@enzedonline/quill-blot-formatter2";
Quill.register("modules/blotFormatter", BlotFormatter);

/* ============ Font size whitelist (px) ============ */
const SIZE_WHITELIST = [
  "10px",
  "12px",
  "14px",
  "16px",
  "18px",
  "24px",
  "32px",
  "48px",
];
const SizeStyle = Quill.import("attributors/style/size") as any;
SizeStyle.whitelist = SIZE_WHITELIST;
Quill.register({ "formats/size": SizeStyle }, true);

/* ============ Placeholder embed ============ */
const Parchment = Quill.import("parchment") as any;
const Embed = Quill.import("blots/embed") as any;

export type PlaceholderValue = {
  type: "text" | "image";
  key: string;
  label: string;
};

class PlaceholderBlot extends (Embed as any) {
  static blotName = "placeholder";
  static tagName = "SPAN";
  static className = "placeholder-key";
  static scope = Parchment.Scope.INLINE_BLOT;

  static create(value: PlaceholderValue) {
    const node = super.create() as HTMLElement;
    node.setAttribute("contenteditable", "false");
    node.setAttribute("data-type", value.type);
    node.setAttribute("data-key", value.key);
    node.setAttribute("data-label", value.label); // ✅ penting!
    node.innerText = `{{${value.label}}}`;
    node.style.backgroundColor = "#e0f2fe";
    node.style.color = "#0369a1";
    node.style.fontWeight = "700";
    node.style.padding = "2px 6px";
    node.style.borderRadius = "6px";
    node.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, monospace";
    node.style.whiteSpace = "nowrap";
    return node;
  }

  static value(node: HTMLElement): PlaceholderValue {
    return {
      label:
        node.getAttribute("data-label") ?? node.getAttribute("data-key") ?? "",
      type: (node.getAttribute("data-type") as "text" | "image") ?? "text",
      key: node.getAttribute("data-key") ?? "",
    };
  }
}
Quill.register({ "formats/placeholder": PlaceholderBlot }, true);

/* ============ Types & props ============ */
type PlaceholderKey = PlaceholderValue;

export interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  editorClassName?: string;
  placeholderKeys?: PlaceholderKey[];
}

/* ============ Margins ala Word (FE only) ============ */
const MARGIN_PRESETS: Record<
  "Normal" | "Narrow" | "Moderate" | "Wide",
  { top: number; right: number; bottom: number; left: number }
> = {
  Normal: { top: 32, right: 32, bottom: 32, left: 32 },
  Narrow: { top: 16, right: 12, bottom: 16, left: 12 },
  Moderate: { top: 24, right: 28, bottom: 24, left: 28 },
  Wide: { top: 32, right: 48, bottom: 32, left: 48 },
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = "",
  onChange,
  placeholder = "Tulis sesuatu...",
  className,
  editorClassName,
  placeholderKeys,
}) => {
  const quillRef = useRef<ReactQuill>(null);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }, { size: SIZE_WHITELIST }],
          ["bold", "italic", "underline", "strike"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          [{ align: [] }],
          [{ color: [] }, { background: [] }],
          ["link", "image"],
          [{ [TableUp.toolName]: [] }],
          ["clean"],
        ],
      },
      table: false,
      [TableUp.moduleName]: {
        customSelect: defaultCustomSelect,
        modules: [
          { module: TableSelection },
          { module: TableMenuContextmenu },
          { module: TableResizeLine },
          { module: TableResizeScale, options: { blockSize: 12 } },
        ],
      },
      blotFormatter: {
        align: { allowCenter: true, allowLeft: true, allowRight: true },
        overlay: { style: { border: "1px solid rgba(0,0,0,.2)" } },
      },
    }),
    []
  );

  /* Tab / Shift+Tab indent (skip kalau di tabel) */
  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    quill.keyboard.addBinding({ key: 9 }, (range: any, ctx: any) => {
      const fmt = quill.getFormat(range);
      if (fmt.table || fmt.td || fmt.th) return true;
      const curr = (ctx.format?.indent as number) || 0;
      quill.format("indent", curr + 1);
      return false;
    });
    quill.keyboard.addBinding(
      { key: 9, shiftKey: true },
      (range: any, ctx: any) => {
        const fmt = quill.getFormat(range);
        if (fmt.table || fmt.td || fmt.th) return true;
        const curr = (ctx.format?.indent as number) || 0;
        if (curr > 1) quill.format("indent", curr - 1);
        else quill.format("indent", false);
        return false;
      }
    );
  }, []);

  /* Default font size label + default margins */
  useEffect(() => {
    const q = quillRef.current?.getEditor();
    if (!q) return;
    // default caret 14px
    q.format("size", "14px", "silent");
    const label = q.root.parentElement?.querySelector(
      ".ql-picker.ql-size .ql-picker-label"
    ) as HTMLElement | null;
    if (label && !label.getAttribute("data-value")) {
      label.setAttribute("data-value", "14px");
    }
    // default margin preset Normal
    const root = q.root as HTMLElement;
    root.style.setProperty("--page-pad-top", `${MARGIN_PRESETS.Normal.top}px`);
    root.style.setProperty(
      "--page-pad-right",
      `${MARGIN_PRESETS.Normal.right}px`
    );
    root.style.setProperty(
      "--page-pad-bottom",
      `${MARGIN_PRESETS.Normal.bottom}px`
    );
    root.style.setProperty(
      "--page-pad-left",
      `${MARGIN_PRESETS.Normal.left}px`
    );
  }, []);

  const insertPlaceholder = (item: PlaceholderKey) => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const range = quill.getSelection(true);
    const index = range ? range.index : quill.getLength();
    quill.insertEmbed(
      index,
      "placeholder",
      { type: item.type, key: item.key, label: item.label },
      "user"
    );
    quill.setSelection(index + 1, 0);
  };

  return (
    <div className={cn("rounded-[14px] bg-card", className)}>
      {/* Toolbar custom kecil: placeholders + margin presets */}
      <div className="flex items-center gap-3 pt-0 p-3 ">
        {placeholderKeys?.length ? (
          <>
            <span className="text-sm font-medium text-muted-foreground">
              Insert placeholders:
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  className="h-8 bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Placeholder
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {placeholderKeys.map((item) => (
                  <DropdownMenuItem
                    key={`${item.type}:${item.key}`}
                    onClick={() => insertPlaceholder(item)}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    {item.type === "image" ? (
                      <ImageIcon className="w-4 h-4" />
                    ) : (
                      <span className="w-4 h-4 inline-block" />
                    )}
                    <span className="font-mono text-sm">{`{{${item.label}}}`}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : null}
      </div>

      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
        className={editorClassName}
      />

      <style jsx global>{`
        /* Placeholder chip */
        .ql-editor .placeholder-key {
          background-color: #e0f2fe;
          color: #0369a1;
          font-weight: bold;
          padding: 2px 4px;
          border-radius: 4px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          white-space: nowrap;
        }
        /* Font-size dropdown show px */
        .ql-snow .ql-picker.ql-size .ql-picker-options .ql-picker-item::before {
          content: attr(data-value) !important;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label[data-value]::before {
          content: attr(data-value) !important;
        }
        .ql-snow .ql-picker.ql-size .ql-picker-label:not([data-value])::before {
          content: "14px" !important;
        }

        /* Page-like margins (FE only) */
        .ql-editor {
          padding: var(--page-pad-top, 24px) var(--page-pad-right, 32px)
            var(--page-pad-bottom, 24px) var(--page-pad-left, 32px) !important;
          height: 260px;
          overflow: scroll;
        }
        .ql-editor img {
          max-width: 100%;
          height: auto;
          display: inline-block;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
