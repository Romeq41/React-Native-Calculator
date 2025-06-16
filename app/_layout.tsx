import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';


/**
 * Główny layout aplikacji kalkulatora
 */
export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    if (!loaded) {
        return null;
    }

    const customDarkTheme = {
        ...DarkTheme,
        colors: {
            ...DarkTheme.colors,
            background: '#000',
            card: '#000',
            border: '#000',
            notification: '#000',
        },
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <ThemeProvider value={customDarkTheme}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: '#000' },
                        animation: 'fade',
                        presentation: 'transparentModal',
                    }}
                >
                    <Stack.Screen name="welcome" />
                    <Stack.Screen name="index" />
                    <Stack.Screen
                        name="about"
                        options={{
                            presentation: 'modal',
                            animation: 'slide_from_bottom',
                            contentStyle: { backgroundColor: '#000' },
                        }}
                    />
                    <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="light" backgroundColor="#000" />
            </ThemeProvider>
        </View>
    );
}