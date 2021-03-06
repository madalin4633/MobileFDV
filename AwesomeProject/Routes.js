import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import firebase from './database/firebaseDb'
import {AuthContext} from './AuthProvider';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import LoadingScreen from './screens/LoadingScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import PassScreen from './screens/PassScreen';
import ProfileScreen from './screens/ProfileScreen';
import RewardScreen from './screens/RewardScreen';
import TasksScreen from './screens/TasksScreen';
import BadgesScreen from './screens/BadgesScreen';
import HomeInfo from './screens/HomeInfo';
import TasksInfo from './screens/TasksInfo';
import RewardsInfo from './screens/RewardsInfo';
import ProfileInfo from './screens/ProfileInfo';


const Stack = createStackNavigator();

const Routes = () => {
  const {user, setUser} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

  const onAuthStateChanged = (user) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return <LoadingScreen></LoadingScreen>;

  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
          { user ? (
          <>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="TasksScreen" component={TasksScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="RewardScreen" component={RewardScreen} />
          <Stack.Screen name="BadgesScreen" component={BadgesScreen} />
          <Stack.Screen name="HomeInfo" component={HomeInfo} />
          <Stack.Screen name="TasksInfo" component={TasksInfo} />
          <Stack.Screen name="RewardsInfo" component={RewardsInfo} />
          <Stack.Screen name="ProfileInfo" component={ProfileInfo} />
          </>
          ) : (
            <>
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
            <Stack.Screen name="PassScreen" component={PassScreen} />
            </>
          )}
        </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;