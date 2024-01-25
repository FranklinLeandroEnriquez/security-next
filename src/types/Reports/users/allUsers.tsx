import React from 'react';
import { Document, Page, Text, StyleSheet, View } from '@react-pdf/renderer';
import { UserResponse } from '@/types/User/UserResponse';
import { getUser } from '@/services/User/UserService';
import { useAuthToken } from '@/hooks/useAuthToken';
import { ErrorResponse } from '@/types/shared/ValidationError';
import { toast } from 'sonner';
import { ReporType } from '@/types/Reports/shared/Report';

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

const AllUsers: React.FC<ReporType> = ({ id }) => {

    const token = useAuthToken();

    const getUserHandler = async (id: number): Promise<UserResponse> => {
        const res = await getUser(id, token);
        if (res.status === 200) {
            const data: UserResponse = await res.json();
            return data;
        } else {
            const errorData: ErrorResponse = await res.json();
            toast.error(errorData.message.toString());
            throw new Error(errorData.message);
        }
    }

    const getUsersHandler = async (ids: number[]): Promise<UserResponse[]> => {
        const users: UserResponse[] = [];

        for (const id of ids) {
            try {
                const user = await getUserHandler(id);
                users.push(user);
            } catch (error) {
                console.error(`Error obteniendo el usuario con ID ${id}: ${error}`);
            }
        }
        return users;
    };


    const renderData = (data: Record<string, any>, depth = 0) => {
        return Object.entries(data).map(([key, value]) => {
            const isKeyANumber = !isNaN(Number(key));
            if (typeof value === 'object' && value !== null) {
                return (
                    <React.Fragment key={key}>
                        {!isKeyANumber && <Text style={{ ...styles.item, marginLeft: depth * 20, fontSize: 14, marginBottom: 10 }}><Text style={styles.key}>{key}: </Text></Text>}
                        {renderData(value, depth + 1)}
                        <View style={{ marginTop: 10 }} />
                    </React.Fragment>
                );
            } else {
                return (
                    <Text key={key} style={{ ...styles.item, marginLeft: depth * 20, fontSize: 12, marginBottom: 5 }}>
                        {!isKeyANumber && <Text style={styles.key}>{key}: </Text>}
                        {typeof value === 'boolean' ? value.toString() : value}
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
                        <Text style={styles.headerSubtitle}>{"Reporte de Usuarios"} Report</Text>
                    </View>
                    <View style={styles.linkColumn}>
                        <Text style={styles.link}>Made by { }</Text>
                    </View>
                </View>
                <Text style={styles.description}>{"Descripcion del reporte de todos los usuarios"}</Text>
                <View style={styles.content}>
                    {renderData(getUsersHandler(id))}
                </View>
            </Page>
        </Document>
    );
};

export default AllUsers;