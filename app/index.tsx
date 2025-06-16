import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, SafeAreaView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import Button from '@/components/Button';
import Display from '@/components/Display';
import { error, success } from '@/constants/Colors';

/**
 * Komponent Toast - wyświetla animowane powiadomienia użytkownikowi
 */
function Toast({ message, visible, type = 'info' }: { message: string, visible: boolean, type?: 'info' | 'error' }) {
    // Referencja do wartości animacji opacity (przezroczystość)
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Sekwencja animacji: pojawianie się → opóźnienie → znikanie
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
        ? error
        : success;

    return visible ? (
        <Animated.View style={[styles.toast, { opacity, backgroundColor }]}>
            <Text style={styles.toastText}>{message}</Text>
        </Animated.View>
    ) : null;
}

/**
 * Główny komponent kalkulatora - implementuje podstawowe operacje matematyczne
 */
export default function CalculatorScreen() {
    const [value, setValue] = useState('0');
    const [expression, setExpression] = useState('');
    const [waitingForOperand, setWaitingForOperand] = useState(false);
    const [storedValue, setStoredValue] = useState<number | null>(null);
    const [operation, setOperation] = useState<string | null>(null);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'info' | 'error'>('info');

    const window = useWindowDimensions();
    const isLandscape = window.width > window.height;

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

    const handleScientificOperation = (operation: (x: number) => number) => {
        try {
            const current = parseFloat(value);
            const result = operation(current);

            if (!isFinite(result)) {
                throw new Error("Invalid calculation");
            }

            setValue(result.toString());
        } catch (error: any) {
            showToast("Invalid calculation", 'error');
        }
    };

    const handleDelete = () => {
        if (value.length > 1) {
            setValue(value.slice(0, -1));
        } else {
            setValue('0');
        }
    };

    return (
        <SafeAreaView style={[styles.container, isLandscape && styles.landscapeContainer]}>
            <StatusBar style="light" />

            <Toast
                message={toastMessage}
                visible={toastVisible}
                type={toastType}
            />
            {isLandscape ? (
                <View style={styles.landscapeLayout}>
                    <View style={styles.landscapeDisplayContainer}>
                        <Display value={value} expression={expression} isLandscape={true} />
                    </View>

                    <View style={styles.landscapeButtonsContainer}>
                        {/* Scientific calculator*/}
                        <View style={styles.scientificButtonsSection}>
                            <View style={styles.calculatorRow}>
                                <Button text="sin" onPress={() => handleScientificOperation(Math.sin)} type="function" />
                                <Button text="cos" onPress={() => handleScientificOperation(Math.cos)} type="function" />
                                <Button text="tan" onPress={() => handleScientificOperation(Math.tan)} type="function" />
                            </View>

                            <View style={styles.calculatorRow}>
                                <Button text="log" onPress={() => handleScientificOperation(Math.log10)} type="function" />
                                <Button text="ln" onPress={() => handleScientificOperation(Math.log)} type="function" />
                                <Button text="√" onPress={() => handleScientificOperation(Math.sqrt)} type="function" />
                            </View>

                            <View style={styles.calculatorRow}>
                                <Button text="x²" onPress={() => handleScientificOperation(x => x * x)} type="function" />
                                <Button text="x³" onPress={() => handleScientificOperation(x => x * x * x)} type="function" />
                                <Button text="π" onPress={() => setValue(Math.PI.toString())} type="function" />
                            </View>

                            <View style={styles.calculatorRow}>
                                <Button text="DEL" onPress={() => handleDelete()} type="function" />
                                <Button text="e" onPress={() => setValue(Math.E.toString())} type="function" />
                                <Button text="%" onPress={handlePercentPress} type="function" />
                            </View>
                        </View>

                        {/* Standard calculator */}
                        <View style={styles.standardButtonsSection}>
                            <View style={styles.calculatorRow}>
                                <Button text="C" onPress={handleClearPress} type="function" />
                                <Button text="+/-" onPress={handlePlusMinusPress} type="function" />
                                <Button text="÷" onPress={() => handleOperationPress('÷')} type="operator" />
                                <Button text="×" onPress={() => handleOperationPress('×')} type="operator" />
                            </View>

                            <View style={styles.calculatorRow}>
                                <Button text="7" onPress={() => handleNumberPress('7')} />
                                <Button text="8" onPress={() => handleNumberPress('8')} />
                                <Button text="9" onPress={() => handleNumberPress('9')} />
                                <Button text="-" onPress={() => handleOperationPress('-')} type="operator" />
                            </View>

                            <View style={styles.calculatorRow}>
                                <Button text="4" onPress={() => handleNumberPress('4')} />
                                <Button text="5" onPress={() => handleNumberPress('5')} />
                                <Button text="6" onPress={() => handleNumberPress('6')} />
                                <Button text="+" onPress={() => handleOperationPress('+')} type="operator" />
                            </View>

                            <View style={styles.calculatorRow}>
                                <Button text="1" onPress={() => handleNumberPress('1')} />
                                <Button text="2" onPress={() => handleNumberPress('2')} />
                                <Button text="3" onPress={() => handleNumberPress('3')} />
                                <Button text="=" onPress={handleEqualsPress} type="operator" />
                            </View>

                            <View style={styles.calculatorRow}>
                                <Button text="0" onPress={() => handleNumberPress('0')} isDoubleWidth />
                                <Button text="." onPress={handleDecimalPress} />
                                <Button text="=" onPress={handleEqualsPress} type="operator" />
                            </View>
                        </View>
                    </View>
                </View>
            ) : (
                // Portrait
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
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // Główny kontener
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    scientificButtonsSection: {
        width: '40%',
        height: '100%',
        borderRightWidth: 1,
        borderRightColor: '#333',
        paddingRight: 10,
        justifyContent: 'space-around',
    },
    standardButtonsSection: {
        width: '60%',
        height: '100%',
        paddingLeft: 10,
        justifyContent: 'space-around',
    },

    calculatorRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: '17%',
    },

    buttonsContainer: {
        flex: 1,
        padding: 5,
        justifyContent: 'flex-end',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },

    landscapeLayout: {
        flex: 1,
        flexDirection: 'column',
        padding: 12,
        backgroundColor: '#000',
    },
    landscapeDisplayContainer: {
        width: '100%',
        height: '22%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 15,
        borderBottomWidth: 0,
        marginBottom: 10,
    },
    landscapeButtonsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    scientificContainer: {
        flex: 0.42,
        justifyContent: 'space-around',
        marginRight: 18,
        borderRightWidth: 1,
        borderRightColor: '#333',
        paddingRight: 10,
        paddingVertical: 5,
    },
    landscapeContainer: {
    },

    scientificRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: '16%',
    },

    standardRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: '18%',
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
    },
});