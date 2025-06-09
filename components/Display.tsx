import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DisplayProps {
    value: string;
    expression?: string;
}

const Display = ({ value, expression = '' }: DisplayProps) => {
    return (
        <View style={styles.container}>
            {expression ? <Text style={styles.expression}>{expression}</Text> : null}
            <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
                {value}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginTop: 50,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        minHeight: 120,
    },
    expression: {
        color: '#747474',
        fontSize: 20,
        marginBottom: 8,
    },
    value: {
        color: 'white',
        fontSize: 48,
    },
});

export default Display;