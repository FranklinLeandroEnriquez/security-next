import React from 'react';
import { Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';
import { useSessionAuth } from "@/hooks/useSessionAuth";
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
        color: '#8B0000',
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
const { getAuthResponse } = useSessionAuth();
const authResponse = getAuthResponse();
const email = authResponse?.email;

const currentDate = new Date();
const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth()+1}/${currentDate.getFullYear()}`;

interface ReportHeaderProps {
    data: any;
    dataType: string;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({ data, dataType }) => (
    
    <Document>
            <Page style={styles.page}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerDetailColumn}>
                        <Text style={styles.headerName}>Universidad Técnica del Norte</Text>
                        <Text style={styles.headerSubtitle}>{dataType} Report</Text>
                    </View>
                    <View style={styles.linkColumn}>
                        <Text style={styles.link}>{formattedDate}</Text>
                        <Text style={styles.link}>Made by {email}</Text>
                    </View>
                </View>
                <Text style={styles.description}>{"Report generated by security module"}</Text>
                <View style={styles.content}>
                    {data}
                </View>
            </Page>
        </Document>
);

export default ReportHeader; 