import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/homeScreen';
import NewStory from './screens/newStory';

import { NavigatorParams } from './resources/customTypes'

const Stack = createStackNavigator<NavigatorParams>();

export default function App() {
  return (
    <NavigationContainer>
    <Stack.Navigator id={undefined}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="NewStory" component={NewStory} />
    </Stack.Navigator>
  </NavigationContainer>
  )
}
