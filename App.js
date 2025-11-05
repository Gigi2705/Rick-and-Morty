import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CharactersListScreen from './screens/CharactersListScreen';
import CharacterDetailScreen from './screens/CharacterDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CharactersList">
        <Stack.Screen
          name="CharactersList"
          component={CharactersListScreen}
          options={{ title: 'Rick and Morty' }}
        />
        <Stack.Screen
          name="Details"
          component={CharacterDetailScreen}
          options={{ title: 'Character Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
