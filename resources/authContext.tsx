import { createContext, useState } from "react";

import { ActiveUser, AuthContextType } from './customTypes'
import { useSQLiteContext } from "expo-sqlite";

import { User } from "./customTypes";

export const AuthContext = createContext<AuthContextType>(null);

export const AuthProvider = ({ children }: any) => {
  const db = useSQLiteContext();
  const [user, setUser] = useState<any>();

  const login = async (name: string, password: string) => {
    try {
      const auth = await db.getFirstAsync(`SELECT * FROM users WHERE name = (?)`, name) as User
      if (auth) {
        if (auth.password == password) {
          setUser(auth.name)
          try {
            await db.runAsync('DELETE from activeuser')
            try {
              await db.runAsync('INSERT INTO activeuser (name) VALUES (?)', auth.name)
            } catch (error){
              console.error('Could not set active user.', error)
            }
          } catch (error) {
            console.error('Could not delete active user.', error)
          }
        } else {
          alert('Wrong username or password.')
        }
      } else {
        alert('Wrong username or password.')
      }
    } catch (error) {
      console.log('Unable to login', error);
    }
  }

  const register = async (name: string, password: string) => {
    try {
      await db.runAsync('INSERT into users (name, password) VALUES (?, ?)', name, password)
      login(name, password)
    } catch (error) {
      console.error('Could not create user', error)
    }
  }

  const logout = async() => {
    try {
      await db.runAsync('DELETE from activeuser')
      setUser(null)
    } catch (error) {
      console.error('Could not delete active user')
    }
  }

  const active = async () => {
    const active = await db.getFirstAsync('SELECT * from activeuser') as ActiveUser
    if (active) {
      setUser(active.name)
    } else {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, active }}>
      {children}
    </AuthContext.Provider>
  )
}