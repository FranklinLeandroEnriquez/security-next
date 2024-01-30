import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { Table } from "@tanstack/react-table"

const styles = StyleSheet.create({
    item: {
        fontSize: 12,
        marginBottom: 3,
        textAlign: 'left',
        color: '#333333',
    },
    key: {
        fontWeight: 'bold',
        color: 'black',
    },
    title: {
        fontSize: 13,
        marginBottom: 5,
        color: '#8B0000',
    },
    separator: {
        borderBottom: '1pt solid black',
        marginBottom: 10,
    },
});

export const renderData = (data: Record<string, any>, depth = 0, dataType = '') => {
    const id = data.id || '';
    const total = Object.keys(data).length;
    return (
        <React.Fragment>
            {depth != 0 && id !== '' && <Text style={{ ...styles.title, marginLeft: depth * 40 }}>{dataType} ID: {id}</Text>}
            {Object.entries(data).map(([key, value], index) => {
                if (key === 'id') {
                    return null; // Omitir la propiedad 'id'
                }

                if (typeof value === 'object' && value !== null) {
                    return (
                        <React.Fragment key={key}>
                            {Array.isArray(data) && depth == 0 && <View style={styles.separator} />}
                            {Array.isArray(data) ? renderData(value, depth + 1, dataType) : renderData(value, depth, key)}
                        </React.Fragment>
                    );
                } else {
                    return (
                        <Text key={key} style={{ ...styles.item, marginLeft: depth * 40 }}>
                            <Text style={styles.key}>{key}: </Text>
                            {key == 'status' ? (value == 1 ? 'Active' : 'Inactive') : (typeof value === 'boolean' ? value.toString() : value)}
                        </Text>
                    );
                }
            })}
            {depth == 0 && <View style={styles.separator} />}
            {depth == 0 && <Text style={styles.title}>Total {dataType}s: {total}</Text>}

        </React.Fragment>
    );
};