import { useGetMasterPermission } from "@/components/parts/roles/api";
import { RolesPayload } from "@/components/parts/roles/validation";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

export default function FormPermissionSection({
  readOnly,
}: {
  readOnly: boolean;
}) {
  const { data: _permission } = useGetMasterPermission();
  const permission = _permission?.data;

  return (
    <div className="w-[80%] flex flex-col gap-y-4">
      {permission?.map((perm, i) => {
        const label = perm.label.split(":");
        const isGroup = label?.length > 1;
        if (isGroup)
          return (
            <>
              <p className="font-bold text-base text-primary">{label[0]}</p>
              <div className="flex flex-col gap-y-4">
                <PermissionCheckBox
                  key={i}
                  name={`permissions.${i}`}
                  label={label[1]}
                  permissionId={perm.id}
                  labelClassName="text-text-800 font-normal"
                  disabled={readOnly}
                />
              </div>
            </>
          );
        else
          return (
            <PermissionCheckBox
              key={i}
              name={`permissions.${i}`}
              label={label[0]}
              permissionId={2}
              labelClassName="text-text-800 font-normal"
              disabled={readOnly}
            />
          );
      })}
    </div>
  );
}

function PermissionCheckBox({
  name,
  label,
  permissionId,
  labelClassName,
  disabled,
}: {
  name: any;
  label: string;
  permissionId: number;
  labelClassName?: string;
  disabled?: boolean;
}) {
  const { control } = useFormContext<RolesPayload>();
  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      defaultValue={{
        permissionId: permissionId,
        canRead: false,
        canWrite: false,
        canUpdate: false,
        canDelete: false,
        canRestore: false,
      }}
      render={({ field }) => (
        <div className="flex flex-row items-center gap-x-10">
          <Label
            className={cn("text-base text-primary w-[30%]", labelClassName)}
          >
            {label}
          </Label>
          <div className="flex items-center gap-x-4 justify-between w-[70%]">
            <Label className="flex items-center gap-x-2">
              <Checkbox
                className="size-5"
                checked={field.value.canRead}
                onCheckedChange={(cheked) =>
                  field.onChange({ ...field.value, canRead: cheked })
                }
                disabled={disabled}
              />
              <span>View</span>
            </Label>
            <Label className="flex items-center gap-x-2">
              <Checkbox
                className="size-5"
                checked={field.value.canWrite}
                onCheckedChange={(cheked) =>
                  field.onChange({ ...field.value, canWrite: cheked })
                }
                disabled={disabled}
              />
              <span>Create</span>
            </Label>
            <Label className="flex items-center gap-x-2">
              <Checkbox
                className="size-5"
                checked={field.value.canUpdate}
                onCheckedChange={(cheked) =>
                  field.onChange({ ...field.value, canUpdate: cheked })
                }
                disabled={disabled}
              />
              <span>Edit</span>
            </Label>
            <Label className="flex items-center gap-x-2">
              <Checkbox
                className="size-5"
                checked={field.value.canDelete}
                onCheckedChange={(cheked) =>
                  field.onChange({ ...field.value, canDelete: cheked })
                }
                disabled={disabled}
              />
              <span>Delete</span>
            </Label>
          </div>
        </div>
      )}
    />
  );
}
