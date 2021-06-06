import 'react-native-gesture-handler';
import * as React from 'react';
import { AuthProvider } from './AuthProvider';
import Routes from './Routes';
import * as Font from 'expo-font';
import { LogBox } from 'react-native';

  
export default function App({navigation}) {
  LogBox.ignoreLogs(['Setting a timer']); //eroare nerezolvata de developeri - aceasta este solutia sugerata: https://github.com/facebook/react-native/issues/12981

  return (
    <AuthProvider>
      <Routes/>
    </AuthProvider>
  );
}