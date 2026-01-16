import { useAppSelector } from '@redux/store';
import Home from '@screens/Home';
import OnboardingScreen from '@screens/Onboarding';

import { ROUTES } from './constants';
import { RootStackParamList } from './types';

import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const navigationRef = useNavigationContainerRef();
  useReactNavigationDevTools(navigationRef);

  const userToken = useAppSelector(state => state.common.userToken);
  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator>
          {userToken ? (
            <Stack.Group>
              <Stack.Screen name={ROUTES.HOME} component={Home} />
            </Stack.Group>
          ) : (
            <Stack.Group>
              <Stack.Screen
                name={ROUTES.ONBOARDING}
                component={OnboardingScreen}
              />
            </Stack.Group>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
export default RootNavigator;
