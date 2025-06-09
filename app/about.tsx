import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AboutScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.header}>
                <Text style={styles.title}>About This App</Text>
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.heading}>Calculator App</Text>
                <Text style={styles.version}>Version 1.0</Text>

                <Text style={styles.paragraph}>
                    This is a simple, yet powerful calculator application designed with React Native.
                    It provides all the basic mathematical operations you need for everyday calculations.
                </Text>

                <Text style={styles.heading}>Features</Text>
                <Text style={styles.paragraph}>
                    • Basic arithmetic operations (addition, subtraction, multiplication, division)
                    • Percentage calculations
                    • Sign change functionality
                    • Decimal point support
                    • Clean and intuitive interface
                </Text>

                <Text style={styles.heading}>How to Use</Text>
                <Text style={styles.paragraph}>
                    Simply tap the number buttons followed by an operation. Continue entering
                    numbers and operations as needed. Press "=" to calculate the result.
                    Use "C" to clear the current calculation.
                </Text>

                <Text style={styles.paragraph}>
                    © 2025 Calculator App
                </Text>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.back()}
                >
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        paddingTop: 60,
        paddingBottom: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 20,
        marginBottom: 10,
    },
    version: {
        fontSize: 16,
        color: '#FF9F0A',
        marginBottom: 20,
    },
    paragraph: {
        fontSize: 16,
        color: '#ccc',
        lineHeight: 24,
        marginBottom: 20,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    button: {
        backgroundColor: '#FF9F0A',
        borderRadius: 30,
        paddingVertical: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});