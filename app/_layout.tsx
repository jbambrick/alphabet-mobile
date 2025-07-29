import { useColorScheme } from '@/hooks/useColorScheme';
import {
    NavigationContainer,
    NavigationIndependentTree,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { launchArguments } from 'expo-launch-arguments';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import {
    ConfigStore,
    RootStoreProvider,
    setUpConfig,
} from '../components/Redux/config';
import { setupStore } from '../components/Redux/store';
import Background from './background';
import CreditsScreen from './credits';
import { AlphabetCardDetailScreen } from './detail';
import HomeScreen from './home';
import MenuScreen from './menu';

const Stack = createNativeStackNavigator();

interface AppLaunchArguments {
    configOverrides?: Partial<ConfigStore>;
}

export default function RootLayout() {
    const [config, setConfig] = useState<ConfigStore | null>(null);

    useEffect(() => {
        const configOverrides = launchArguments.configOverrides || {};
        setUpConfig(configOverrides).then(setConfig);
    }, []);

    const colorScheme = useColorScheme();

    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (config === null) {
        return <ActivityIndicator size={'large'} />;
    }

    if (!loaded) {
        return null;
    }

    return (
        <RootStoreProvider value={config}>
            <Provider store={setupStore()}>
                <Background>
                    <NavigationIndependentTree>
                        <NavigationContainer>
                            <StatusBar style="light" />
                            <Stack.Navigator
                                screenOptions={{
                                    headerBackground: () => (
                                        <Background children={undefined} />
                                    ),

                                    headerTintColor: 'white',
                                }}
                            >
                                <Stack.Screen
                                    name="Home"
                                    component={HomeScreen}
                                />
                                <Stack.Screen
                                    options={{ title: 'Select Letter' }}
                                    name="Menu"
                                    component={MenuScreen}
                                />
                                <Stack.Screen
                                    options={{ title: 'Alphabet' }}
                                    name="Detail"
                                    component={AlphabetCardDetailScreen}
                                />
                                <Stack.Screen
                                    name="Credits"
                                    component={CreditsScreen}
                                />
                            </Stack.Navigator>
                        </NavigationContainer>
                    </NavigationIndependentTree>
                </Background>
            </Provider>
        </RootStoreProvider>
    );
}
