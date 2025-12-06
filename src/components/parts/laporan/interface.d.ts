// Define interfaces for the report, project, and user
interface Project {
  id: number;
  title: string;
  detail: string;
  stack: string;
  linkgithub: string;
}

interface User {
  id: number;
  nama: string;
  usernamegithub: string;
  email: string;
  role: "USER" | "ADMIN";
  position: string | null;
}

interface ReportResponse {
  id: number;
  project: Project;
  user: User;
  conclusion: string;
  timestamp: string;
  commitRange: string;
}
