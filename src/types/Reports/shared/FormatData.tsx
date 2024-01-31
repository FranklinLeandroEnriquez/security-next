import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    item: {
        fontSize: 12,
        marginBottom: 3,
        textAlign: 'left',
        color: '#333333',
    },
    row:{
        flexDirection: 'row',
    },
    cell: {
        borderWidth: 1,
        borderColor: '#000', 
        padding: 2,
        flex: 1,
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
        marginTop: 15,
        marginBottom: 10,
    },
});

export const renderData = (data: Record<string, any>, depth = 0, dataType = '') => {
    const id = data.id || '';
    const total = Object.keys(data).length;
    return (
        <React.Fragment>
            {depth != 0 && id !== '' && <Text style={{ ...styles.title, marginLeft: depth * 20, marginTop:10 }}>{dataType} ID: {id}</Text>}
            {Object.entries(data).map(([key, value], index) => {
                if (key === 'id') {
                    return null; // Omitir la propiedad 'id'
                }

                if (typeof value === 'object' && value !== null) {
                    return (
                        <React.Fragment key={key}>
                            {Array.isArray(data) && depth == 0 && <View style={styles.separator} />}
                            {Array.isArray(data) ? renderData(value, depth + 1, dataType) : renderData(value, depth,"> "+key)}
                        </React.Fragment>
                    );
                } else {
                    return (
                        <View key={key} style={styles.row}>
                            <Text style={{ ...styles.cell, marginLeft: depth * 20 }}>
                                <Text style={styles.key}>{key}: </Text>
                            </Text>
                            <Text style={styles.cell}>
                                {key == 'status' ? (value == 1 ? 'Active' : 'Inactive') : (typeof value === 'boolean' ? value.toString() : value)}
                            </Text>
                        </View>
                    );
                }
            })}
            {depth == 0 && <View style={styles.separator} />}
            {depth == 0 && <Text style={styles.title}>Total {dataType}s: {total}</Text>}
        </React.Fragment>
    );
    
}