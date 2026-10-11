import { createContext } from "react";

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthUser {
  token: string;
  user: UserData;
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (data: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default AuthContext;
