import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import { SQLiteProvider } from 'expo-sqlite';

import { initializeDatabase } from './resources/initializeDatabase';
import { NavigatorParams } from './resources/customTypes'
import { AuthProvider } from './resources/authContext';
import { BackgroundProvider } from './resources/backgroundContext';

import HomeScreen from './screens/homeScreen';
import NewStory from './screens/newStory';
import ViewStory from './screens/viewStory';
import Signin from './screens/signIn';
import Signup from './screens/signUp';

const Stack = createStackNavigator<NavigatorParams>();

export default function App() {
  return (
    <PaperProvider>
      <SQLiteProvider databaseName="stories.db" onInit={initializeDatabase}>
        <BackgroundProvider>
          <AuthProvider>
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="NewStory" component={NewStory} />
                <Stack.Screen name="ViewStory" component={ViewStory} />
                <Stack.Screen name="Signin" component={Signin} />
                <Stack.Screen name="Signup" component={Signup} />
              </Stack.Navigator>
            </NavigationContainer>
          </AuthProvider>
        </BackgroundProvider>
      </SQLiteProvider>
    </PaperProvider>
  )
}

