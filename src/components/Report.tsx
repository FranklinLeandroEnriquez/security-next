import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Crear estilos por defecto
const defaultStyles = StyleSheet.create({
    page: {
        padding: 30,
    },
    section: {
        margin: 10,
        padding: 10,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
    },
    user: {
        fontSize: 14,
        marginBottom: 10,
    },
});

// Definir interfaz para los datos del usuario
interface User {
    name: string;
    role: string;
}

// Definir props del componente
interface ReportProps {
    data: User[];
    title: string;
}

// Crear componente de documento
const Report: React.FC<ReportProps> = ({ data, title }) => (
    <Document>
        <Page style={defaultStyles.page}>
            <Text style={defaultStyles.title}>{title}</Text>
            {data.map((item, index) => (
                <View style={defaultStyles.section} key={index}>
                    <Text style={defaultStyles.user}>Nombre: {item.name}</Text>
                    <Text style={defaultStyles.user}>Rol: {item.role}</Text>
                </View>
            ))}
        </Page>
    </Document>
);

export default Report;