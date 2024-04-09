/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  PermissionsAndroid,
  Alert,
  ToastAndroid,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import TodoList from './pages';



function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark'; 


  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView
      style={[backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <TodoList></TodoList>
    </SafeAreaView>
  );
}

export default App;
