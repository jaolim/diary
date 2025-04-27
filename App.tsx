import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';

import HomeScreen from './screens/homeScreen';
import NewStory from './screens/newStory';
import ViewStory from './screens/viewStory';

import { NavigatorParams } from './resources/customTypes'

const Stack = createStackNavigator<NavigatorParams>();

const initializeDatabase = async (db: SQLiteDatabase) => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS stories (
        id TEXT,
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
}

export default function App() {
  return (
    <PaperProvider>
      <SQLiteProvider databaseName="stories.db" onInit={initializeDatabase}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="NewStory" component={NewStory} />
              <Stack.Screen name="ViewStory" component={ViewStory} />
            </Stack.Navigator>
          </NavigationContainer>
      </SQLiteProvider>
    </PaperProvider>
  )
}
