import React from 'react';
import { Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';
import { useSessionAuth } from "@/hooks/useSessionAuth";

const { getAuthResponse } = useSessionAuth();
const authResponse = getAuthResponse();
const email = authResponse?.email;

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
    },
    header: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
        color: 'black',
        fontWeight: 'bold',
    },
    headerText: {
        fontSize: 14,
        textAlign: 'center',
        color: 'black',
    },
    title: {
        fontSize: 14,
        textAlign: 'left',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    item: {
        fontSize: 12,
        marginBottom: 5,
        textAlign: 'left',
    },
    key: {
        fontWeight: 'bold',
    },
    headerContainer: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#112131',
        borderBottomStyle: 'solid',
        alignItems: 'stretch',
    },
    headerDetailColumn: {
        flexDirection: 'column',
        flexGrow: 9,
        textTransform: 'uppercase',
    },
    headerName: {
        fontSize: 24,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
    },
    linkColumn: {
        flexDirection: 'column',
        flexGrow: 2,
        alignSelf: 'flex-end',
        justifySelf: 'flex-end',
        marginBottom: 4,
    },
    link: {
        fontSize: 10,
        color: 'black',
        textDecoration: 'none',
        alignSelf: 'flex-end',
        justifySelf: 'flex-end',
    },
    content: {
        fontSize: 12,
    },
    description: {
        fontSize: 14,
        marginTop: 10,
        marginBottom: 10,
        color: '#333',
    },
});

interface PDFComponentProps {
    title: string;
    data: Record<string, any>;
    description: string;
}
const PDFComponent: React.FC<PDFComponentProps> = ({ title, data, description }) => {
    const renderData = (data: Record<string, any>, depth = 0) => {
        return Object.entries(data).map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                return (
                    <React.Fragment key={key}>
                        <Text style={{ ...styles.item, marginLeft: depth * 20 }}>
                            <Text style={styles.key}>{key}: </Text>
                        </Text>
                        {renderData(value, depth + 1)}
                    </React.Fragment>
                );
            } else {
                return (
                    <Text key={key} style={{ ...styles.item, marginLeft: depth * 20 }}>
                        <Text style={styles.key}>{key}: </Text>
                        {value}
                    </Text>
                );
            }
        });
    };

    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerDetailColumn}>
                        <Text style={styles.headerName}>Universidad Técnica del Norte</Text>
                        <Text style={styles.headerSubtitle}>{title} Report</Text>
                    </View>
                    <View style={styles.linkColumn}>
                        <Text style={styles.link}>Made by {email}</Text>
                    </View>
                </View>
                <Text style={styles.description}>{description}</Text>
                <View style={styles.content}>
                    {renderData(data)}
                </View>
            </Page>
        </Document>
    );
};

export default PDFComponent;