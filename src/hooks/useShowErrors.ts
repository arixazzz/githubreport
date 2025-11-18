import { toast } from "@/lib/myToast";
import { useEffect } from "react";

export default function useShowErrors(errors: any) {
  useEffect(() => {
    if (errors) {
      const parseErrors: any = (obj: any, parentKey: any = "") => {
        return Object.entries(obj).flatMap(([key, value]: any) => {
          const fullKey = parentKey ? `${parentKey}.${key}` : key;

          if (value?.message) {
            // Jika terdapat pesan error
            return { field: fullKey, message: value.message };
          } else if (typeof value === "object" && value !== null) {
            // Rekursif untuk nested object
            return parseErrors(value, fullKey);
          }

          return [];
        });
      };

      const errorList = parseErrors(errors);

      errorList.map((item: any) => {
        toast.warning(`${item.field} - ${item.message}`);
      });

      console.log(errorList);

      console.log(errors);
    }
  }, [errors]);
}
