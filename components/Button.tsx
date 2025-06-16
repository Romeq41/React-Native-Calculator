import React from 'react';
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions } from 'react-native';

interface ButtonProps {
    text: string;
    onPress: () => void;
    type?: 'default' | 'operator' | 'function';
    isDoubleWidth?: boolean;
}

export default function Button({ text, onPress, type = 'default', isDoubleWidth = false }: ButtonProps) {
    const window = useWindowDimensions();
    const isLandscape = window.width > window.height;

    const buttonWidth = isLandscape ? 90 : 90;
    const buttonHeight = isLandscape ? 45 : 90;
    const doubleWidth = isLandscape ? buttonWidth * 2 + 40 : 150;

    const buttonStyle = [
        styles.button,
        {
            width: isDoubleWidth ? doubleWidth : buttonWidth,
            height: buttonHeight,
            borderRadius: isLandscape ? buttonHeight / 2 : 90,
            margin: isLandscape ? 2 : 3,
        },
        type === 'operator' && styles.operatorButton,
        type === 'function' && styles.functionButton,
        isLandscape && styles.landscapeButton,
    ];

    const textStyle = [
        styles.text,
        type === 'operator' && styles.operatorText,
        type === 'function' && styles.functionText,
        isLandscape && styles.landscapeText
    ];

    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={textStyle}>{text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#333',
        borderRadius: 90,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 3,
    },
    operatorButton: {
        backgroundColor: '#FF9500',
    },
    functionButton: {
        backgroundColor: '#A5A5A5',
    },
    landscapeButton: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 2,
    },
    text: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    operatorText: {
        color: 'white',
    },
    functionText: {
        color: 'black',
    },
    landscapeText: {
        fontSize: 18,
        fontWeight: '600',
    }
});