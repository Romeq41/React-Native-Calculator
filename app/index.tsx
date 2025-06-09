import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import Button from '@/components/Button';
import Display from '@/components/Display';

function Toast({ message, visible, type = 'info' }: { message: string, visible: boolean, type?: 'info' | 'error' }) {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(2000),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [visible]);

    const backgroundColor = type === 'error'
        ? 'rgba(255, 59, 48, 0.9)'
        : 'rgba(52, 199, 89, 0.9)';

    return visible ? (
        <Animated.View style={[styles.toast, { opacity, backgroundColor }]}>
            <Text style={styles.toastText}>{message}</Text>
        </Animated.View>
    ) : null;
}

export default function CalculatorScreen() {
    const [value, setValue] = useState('0');
    const [expression, setExpression] = useState('');
    const [waitingForOperand, setWaitingForOperand] = useState(false);
    const [storedValue, setStoredValue] = useState<number | null>(null);
    const [operation, setOperation] = useState<string | null>(null);

    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'info' | 'error'>('info');

    const showToast = (message: string, type: 'info' | 'error' = 'info') => {
        setToastMessage(message);
        setToastType(type);
        setToastVisible(true);

        setTimeout(() => {
            setToastVisible(false);
        }, 2500);
    };

    const handleNumberPress = (num: string) => {
        if (waitingForOperand) {
            setValue(num);
            setWaitingForOperand(false);
        } else {
            setValue(value === '0' ? num : value + num);
        }
    };

    const handleOperationPress = (op: string) => {
        const current = parseFloat(value);

        if (current === 0) {
            return;
        }

        if (storedValue === null) {
            setStoredValue(current);
            setExpression(value + ' ' + op);
        } else if (operation) {
            try {
                const result = calculate(storedValue, current, operation);

                if (!isFinite(result)) {
                    throw new Error("Invalid result");
                }

                setStoredValue(result);
                setExpression(result.toString() + ' ' + op);
            } catch (error: any) {
                showToast(error.message, 'error');
                handleClearPress();
                return;
            }
        }

        setValue(current.toString());
        setOperation(op);
        setWaitingForOperand(true);
    };

    const calculate = (a: number, b: number, op: string): number => {
        switch (op) {
            case '+':
                return a + b;
            case '-':
                return a - b;
            case '×':
                return a * b;
            case '÷':
                if (b === 0) {
                    throw new Error("Cannot divide by zero");
                }
                return a / b;
            default:
                return b;
        }
    };

    const handleEqualsPress = () => {
        if (operation === null || storedValue === null) return;

        const current = parseFloat(value);

        try {
            const result = calculate(storedValue, current, operation);

            if (!isFinite(result)) {
                throw new Error("Result is not a valid number");
            }

            if (Math.abs(result) > 1e16) {
                throw new Error("Result too large");
            }

            setValue(result.toString());
            setExpression('');
            setStoredValue(null);
            setOperation(null);
            setWaitingForOperand(true);
        } catch (error: any) {
            // Handle errors
            showToast(error.message, 'error');
            handleClearPress();
        }
    };

    const handleClearPress = () => {
        setValue('0');
        setExpression('');
        setStoredValue(null);
        setOperation(null);
        setWaitingForOperand(false);
    };

    const handlePlusMinusPress = () => {
        setValue(parseFloat(value) * -1 + '');
    };

    const handlePercentPress = () => {
        try {
            const result = parseFloat(value) / 100;

            if (!isFinite(result)) {
                throw new Error("Invalid percentage calculation");
            }

            setValue(result.toString());
        } catch (error: any) {
            showToast("Invalid calculation", 'error');
            handleClearPress();
        }
    };

    const handleDecimalPress = () => {
        if (waitingForOperand) {
            setValue('0.');
            setWaitingForOperand(false);
            return;
        }

        if (!value.includes('.')) {
            setValue(value + '.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            <Toast
                message={toastMessage}
                visible={toastVisible}
                type={toastType}
            />

            <View style={styles.buttonsContainer}>
                <Display value={value} expression={expression} />
                <View style={styles.row}>
                    <Button text="C" onPress={handleClearPress} type="function" />
                    <Button text="+/-" onPress={handlePlusMinusPress} type="function" />
                    <Button text="%" onPress={handlePercentPress} type="function" />
                    <Button text="÷" onPress={() => handleOperationPress('÷')} type="operator" />
                </View>
                <View style={styles.row}>
                    <Button text="7" onPress={() => handleNumberPress('7')} />
                    <Button text="8" onPress={() => handleNumberPress('8')} />
                    <Button text="9" onPress={() => handleNumberPress('9')} />
                    <Button text="×" onPress={() => handleOperationPress('×')} type="operator" />
                </View>
                <View style={styles.row}>
                    <Button text="4" onPress={() => handleNumberPress('4')} />
                    <Button text="5" onPress={() => handleNumberPress('5')} />
                    <Button text="6" onPress={() => handleNumberPress('6')} />
                    <Button text="-" onPress={() => handleOperationPress('-')} type="operator" />
                </View>
                <View style={styles.row}>
                    <Button text="1" onPress={() => handleNumberPress('1')} />
                    <Button text="2" onPress={() => handleNumberPress('2')} />
                    <Button text="3" onPress={() => handleNumberPress('3')} />
                    <Button text="+" onPress={() => handleOperationPress('+')} type="operator" />
                </View>
                <View style={styles.row}>
                    <Button text="0" onPress={() => handleNumberPress('0')} isDoubleWidth />
                    <Button text="." onPress={handleDecimalPress} />
                    <Button text="=" onPress={handleEqualsPress} type="operator" />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    buttonsContainer: {
        flex: 1,
        padding: 5,
        justifyContent: 'flex-end',
        marginBottom: 50,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        marginBottom: 10,
    },
    toast: {
        position: 'absolute',
        top: 100,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 10,
        borderRadius: 5,
        zIndex: 1000,
        alignItems: 'center',
    },
    toastText: {
        color: 'white',
        fontSize: 16,
    }
});