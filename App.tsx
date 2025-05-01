import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';
import { createContext, useContext, useState } from 'react';


import HomeScreen from './screens/homeScreen';
import NewStory from './screens/newStory';
import ViewStory from './screens/viewStory';
import Signin from './screens/signIn';
import Signup from './screens/signUp';


import { NavigatorParams } from './resources/customTypes'
import { AuthProvider } from './resources/authContext';

const Stack = createStackNavigator<NavigatorParams>();

const initializeDatabase = async (db: SQLiteDatabase) => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS stories (
        id TEXT,
        user TEXT,
        time TEXT,
        header TEXT,
        body TEXT,
        image TEXT
      );
      `
    );
  } catch (error) {
    console.error(error);
  }
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        name TEXT,
        password TEXT
      );
      `
    );
  } catch (error) {
    console.error(error);
  }
}

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <SQLiteProvider databaseName="stories.db" onInit={initializeDatabase}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="NewStory" component={NewStory} />
              <Stack.Screen name="ViewStory" component={ViewStory} />
              <Stack.Screen name="Signin" component={Signin} />
              <Stack.Screen name="Signup" component={Signup} />
            </Stack.Navigator>
          </NavigationContainer>
        </SQLiteProvider>
      </AuthProvider>
    </PaperProvider>
  )
}

