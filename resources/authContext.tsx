import { createContext, useState } from "react";
import { useSQLiteContext } from "expo-sqlite";

import { ActiveUser, AuthContextType, User } from './customTypes'

export const AuthContext = createContext<AuthContextType>(null);

export const AuthProvider = ({ children }: any) => {
  // variable for database context
  const db = useSQLiteContext();
  // variable for tracking active user
  const [user, setUser] = useState<any>();

  // try to log in(match provided login details with an entry in database and setting that entry's name as the active user) with nested try/catch structure for different fail states, also sets that user as active user via database insertion
  const login = async (name: string, password: string) => {
    if (name == user) {
      alert('You are already logged in')
      return true;
    } else {
      try {
        const auth = await db.getFirstAsync(`SELECT * FROM users WHERE name = (?)`, name) as User
        if (auth) {
          if (auth.password == password) {
            setUser(auth.name)
            try {
              await db.runAsync('DELETE from activeuser')
              try {
                await db.runAsync('INSERT INTO activeuser (name) VALUES (?)', auth.name)
              } catch (error) {
                console.error('Could not set active user.', error)
              }
            } catch (error) {
              console.error('Could not delete active user.', error)
            }
          } else {
            alert('Wrong username or password.')
            return false;
          }
        } else {
          alert('Wrong username or password.')
          return false;
        }
      } catch (error) {
        console.log('Unable to login', error);
      }
    }
    return true;
  }

  // register a new user and log that user in, logic for checking duplicate names is handlded in signUp screen
  const register = async (name: string, password: string) => {
    try {
      await db.runAsync('INSERT into users (name, password) VALUES (?, ?)', name, password)
      login(name, password)
    } catch (error) {
      console.error('Could not create user', error)
    }
  }

  // logs the current user out and removes active user info from database
  const logout = async () => {
    try {
      await db.runAsync('DELETE from activeuser')
      setUser(null)
    } catch (error) {
      console.error('Could not delete active user')
    }
  }

  // queries database for active user and sets that user as active user if found, and null if not
  const active = async () => {
    const active = await db.getFirstAsync('SELECT * from activeuser') as ActiveUser
    if (active) {
      setUser(active.name)
    } else {
      setUser(null)
    }
  }

  // returns context for the value of user, as well as access to login, register, logout and active functions
  return (
    <AuthContext.Provider value={{ user, login, register, logout, active }}>
      {children}
    </AuthContext.Provider>
  )
}