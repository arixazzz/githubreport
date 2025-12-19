interface PaginateParameters {
  page?: number | string;
  limit?: number | string;
}
interface CurrencyFormatOptions {
  locale?: string; // default: 'id-ID'
  currency?: string; // default: 'IDR'
  minimumFractionDigits?: number;
  compact?: boolean;
}

interface JwtPayloadInterface {
  userId: number;
  email: string;
  name: string | null;
  role?: "USER" | "ADMIN";
}

interface debounceInterface {
  value: any;
  delay: number;
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T; // Data can be any structure
}

// Format 1: Paginated data
interface DataPaginate<T> {
  total_items: number;
  items: T[];
  total_pages: number;
  current_page: number;
  items_per_page: number;
  links: Links;
}

interface Links {
  prev: string | null;
  next: string | null;
}

interface FormComponent<T> {
  mode: "create" | "update" | "view";
  defaultValues?: T;
}

type HTTPMethod = "POST" | "PUT" | "DELETE" | "PATCH" | "GET";

type debounceType = {
  value: object | string | number;
  delay: number;
};

type AllowedPrimitive = string | number | boolean | Date | File | Blob | null;
type AllowedValue = AllowedPrimitive | AllowedPrimitive[];

// Format 2: Array data
type DataArray<T> = T[];

// Format 3: Single object data
type DataObject<T> = T;

type decodedProps = {
  id: number;
  email: string;
  name: string;
  role: string;
  user_data: object;
  iat: number;
  exp: number;
};

interface AccessRule {
  roles?: string[];
  permissions?: string[];
}

type SidebarAccessMap = Record<string, AccessRule>;

interface AreaProperties {
  nm_kecamatan: string;
  kd_kecamatan: string;
  nm_desa?: string;
  kd_desa?: string;
  [key: string]: any;
}
