import NextAuth from "next-auth";
import { authOptions } from "../../../server/api/auth/[...nextauth]";

export default NextAuth(authOptions);
