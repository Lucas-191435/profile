import { IUser } from "@/types/IUser";
import Cookies from "js-cookie";
import { decode, JwtPayload } from "jsonwebtoken";

export const fetchUserFromSession = () => {
  const token = Cookies.get("token");
  if (!token) {
    return;
  }
  const decodedToken = decode(token) as JwtPayload;
  return decodedToken as IUser;
};
