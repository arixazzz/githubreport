import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default function useGetToken() {
  const token = Cookies.get("accessToken");
  let decode: decodedProps | undefined;

  if (token) {
    try {
      decode = jwtDecode(token);
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  return { token, decode };
}
