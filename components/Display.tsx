import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface DisplayProps {
    value: string;
    expression: string;
    isLandscape?: boolean;
}

export default function Display({ value, expression, isLandscape = false }: DisplayProps) {
    return (
        <View style={[styles.container, isLandscape && styles.landscapeContainer]}>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.expressionScrollContainer}
                style={[styles.expressionScroll, { maxHeight: isLandscape ? 40 : 50 }]}
            >
                <Text
                    style={[styles.expression, isLandscape && styles.landscapeExpression]}
                >
                    {expression}
                </Text>
            </ScrollView>

            <View style={styles.valueContainer}>
                <Text
                    style={[styles.value, isLandscape && styles.landscapeValue]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.5}
                >
                    {value}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 120,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        padding: 10,
        marginBottom: 20,
    },
    landscapeContainer: {
        height: '100%',
        justifyContent: 'center',
        padding: 15,
        marginBottom: 0,
        borderRadius: 8,
        backgroundColor: 'rgba(30, 30, 30, 0.3)',
    },
    expressionScroll: {
        width: '100%',
    },
    expressionScrollContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        paddingHorizontal: 5,
    },
    expression: {
        color: '#999',
        fontSize: 24,
        marginBottom: 10,
        textAlign: 'right',
    },
    landscapeExpression: {
        fontSize: 28,
        color: '#AAA',
        marginBottom: 15,
    },
    valueContainer: {
        width: '100%',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    value: {
        color: 'white',
        fontSize: 48,
        textAlign: 'right',
    },
    landscapeValue: {
        fontSize: 56,
        fontWeight: '500',
        color: '#FFF',
        textShadowColor: 'rgba(255, 159, 10, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
});