import { createContext, useState } from "react";

import  {AuthContextType} from './customTypes'

export const AuthContext = createContext<AuthContextType>(null);

export const AuthProvider = ({ children }:any) => {
  const [user, setUser] = useState<string | null>('Qwerty');

  const login = (name: string, password: string) => {
    setUser(`${name} - ${password}`)   
  }
  const register = async (name: string, password: string) => {
    try {
      login (name, password)
    } catch (error) {
      console.error('Could not create user', error)
    }
  }
const logout = () => {
  setUser(null);
}

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}