import 'react-native-gesture-handler';
import * as React from 'react';
import { AuthProvider } from './AuthProvider';
import Routes from './Routes';
import * as Font from 'expo-font';

  
export default function App({navigation}) {
  return (
    <AuthProvider>
      <Routes/>
    </AuthProvider>
  );
}