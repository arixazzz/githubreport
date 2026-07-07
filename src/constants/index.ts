// import { NavItem } from "@/types/interface";
// import {
//   Bell,
//   DockIcon,
//   Image,
//   LayoutDashboard,
//   List,
//   Map,
//   Notebook,
//   Table2,
//   Users,
//   View,
// } from "lucide-react";
// import Cookies from 'js-cookie';
// import { jwtDecode } from "jwt-decode";

// export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// export const REGION_URL = process.env.NEXT_PUBLIC_API_REGION;

// type navDateType = {
//   navItems: NavItem[];
// };

//   const cookieStore = Cookies.get('accessToken')
// console.log("string:",""+cookieStore+"")

//   export const getNavData = (): navDateType => {
//     const admin = [
//       {
//         title: "Dashboard",
//         url: "/dashboard",
//         icon: LayoutDashboard,
//       },
//       {
//         title: "Listing Project",
//         url: "/listing-project",
//         icon: List,
//       },
//       {
//         title: "Manajemen Pengguna",
//         url: "/manajemen-user",
//         icon: Users,
//       },
//       {
//         title: "Log Aktivitas",
//         url: "/log-aktivitas",
//         icon: Notebook,
//       },
//     ]

//     const user = [
//       {
//         title: "Dashboard",
//         url: "/dashboard",
//         icon: LayoutDashboard,
//       },
//       {
//         title: "Listing Project",
//         url: "/listing-project",
//         icon: List,
//       },
//       {
//         title: "Log Aktivitas",
//         url: "/log-aktivitas",
//         icon: Notebook,
//       },
//     ]

//   return {
//     navItems: admin
//   };
// };

import { NavItem } from "@/types/interface";
import {
  Bell,
  DockIcon,
  FlaskConical,
  Image,
  LayoutDashboard,
  List,
  Map,
  Notebook,
  Table2,
  Users,
  View,
} from "lucide-react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export const REGION_URL = process.env.NEXT_PUBLIC_API_REGION;

type navDateType = {
  navItems: NavItem[];
};

// Decode the JWT token from cookies
// const cookieStore = Cookies.get("accessToken");
// let userRole: string | null = null;

// if (cookieStore) {
//   try {
//     const decodedToken: any = jwtDecode(cookieStore); // Decode the JWT token
//     userRole = decodedToken?.role; // Extract the role from the decoded token
//   } catch (error) {
//     console.error("Error decoding token:", error);
//   }
// }

export const getNavData = (userRole: string): navDateType => {
  const adminNavItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Listing Project",
      url: "/listing-project",
      icon: List,
    },
    {
      title: "Manajemen Pengguna",
      url: "/manajemen-user",
      icon: Users,
    },
    {
      title: "Log Aktivitas ",
      url: "/log-aktivitas",
      icon: Notebook,
    },
    {
      title: "Model Test",
      url: "/model-test",
      icon: FlaskConical,
    },
  ];

  const userNavItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Listing Project",
      url: "/listing-project",
      icon: List,
    },
    {
      title: "Log Aktivitas",
      url: "/log-aktivitas",
      icon: Notebook,
    },
    {
      title: "Test Model",
      url: "/model-test",
      icon: FlaskConical,
    },
  ];

  // Return different navigation items based on the user's role
  if (userRole === "ADMIN") {
    return { navItems: adminNavItems };
  } else {
    return { navItems: userNavItems };
  }
};
