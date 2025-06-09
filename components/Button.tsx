import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';

interface ButtonProps {
    text: string;
    onPress: () => void;
    type?: 'number' | 'operator' | 'function';
    isDoubleWidth?: boolean;
}

const Button = ({ text, onPress, type = 'number', isDoubleWidth = false }: ButtonProps) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                type === 'operator' && styles.operatorButton,
                type === 'function' && styles.functionButton,
                isDoubleWidth && styles.doubleWidthButton,
            ]}
            onPress={onPress}
        >
            <Text
                style={[
                    styles.buttonText,
                    type === 'operator' && styles.operatorText,
                    type === 'function' && styles.functionText,
                ]}
            >
                {text}
            </Text>
        </TouchableOpacity>
    );
};

const screen = Dimensions.get('window');
const buttonWidth = screen.width / 4 - 10;

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#333333',
        alignItems: 'center',
        justifyContent: 'center',
        height: buttonWidth,
        width: buttonWidth,
        borderRadius: buttonWidth / 2,
        margin: 5,
    },
    doubleWidthButton: {
        width: buttonWidth * 2 + 10,
        alignItems: 'flex-start',
        paddingLeft: 30,
    },
    operatorButton: {
        backgroundColor: '#FF9F0A',
    },
    functionButton: {
        backgroundColor: '#A5A5A5',
    },
    buttonText: {
        color: 'white',
        fontSize: 24,
    },
    operatorText: {
        color: 'white',
    },
    functionText: {
        color: 'black',
    },
});

export default Button;