import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar style="light" />


            <View style={styles.content}>
                <Text style={styles.title}>Calculator App</Text>
                <Text style={styles.subtitle}>Simple. Fast. Reliable.</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push('/')}
                    >
                        <Text style={styles.buttonText}>Go to Calculator</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        onPress={() => router.push('/about')}
                    >
                        <Text style={styles.buttonText}>About</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#ccc',
        marginBottom: 40,
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 300,
    },
    button: {
        backgroundColor: '#FF9F0A',
        borderRadius: 30,
        paddingVertical: 15,
        paddingHorizontal: 30,
        alignItems: 'center',
        marginBottom: 15,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#FF9F0A',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    }
});