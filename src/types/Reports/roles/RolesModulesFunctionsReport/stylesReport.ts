import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        marginBottom: 10,
    },
    moduleInfo: {
        marginLeft: 20,
        marginBottom: 10,
    },
    table: {
        display: 'flex',
        flexDirection: 'column',
        borderWidth: 1,
        borderColor: '#000',
        marginBottom: 10, // Espacio después de la tabla
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },

    tableHeader: {
        width: '33%', // Ancho fijo para cada columna, ajusta según tus necesidades
        padding: 5,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    tableRowHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        backgroundColor: '#cccccc',
        color: '#000000',
    },
    tableCell: {
        width: '33%', // Ancho fijo para cada columna, ajusta según tus necesidades
        padding: 5,
        textAlign: 'center',
        // Propiedad para permitir que el texto se ajuste en varias líneas
        flexWrap: 'wrap',
    },
    spaceAfterRole: {
        marginBottom: 10,
    },
    roleName: {
        color: '#8B0000', // Color del texto
        fontSize: 14, // Tamaño del texto, ajusta según tus necesidades
    },
    subtitle: {
        fontSize: 12, // Tamaño del texto para el subtítulo
        fontWeight: 'bold', // Hace el texto en negrita
        marginTop: 5, // Espacio antes del subtítulo
        marginBottom: 5, // Espacio después del subtítulo
    },

    noFunctionsMessage: {
        marginTop: 5,
        fontSize: 10,
        fontStyle: 'italic',
        marginLeft: 20,
      },
    

});