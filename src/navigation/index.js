import React from 'react';
//==
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
//==stacks
import Register from '../screens/Register';
//--constants
import {colors} from '../utils/appTheme'

const Stack = createNativeStackNavigator();

const Screens = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Farmer" 
          component={Register} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Screens;
