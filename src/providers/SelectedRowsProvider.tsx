import React, { createContext, useState, useContext, ReactNode } from 'react';

// Crear el contexto
const SelectedRowsContext = createContext({ selectedRows: [], setSelectedRows: (_: any) => { } });

// Crear el proveedor del contexto
export const SelectedRowsProvider = ({ children }: { children: ReactNode }) => {
    const [selectedRows, setSelectedRows] = useState([]);

    return (
        <SelectedRowsContext.Provider value={{ selectedRows, setSelectedRows }}>
            {children}
        </SelectedRowsContext.Provider>
    );
};

// Crear un hook personalizado para usar el contexto
export const useSelectedRows = () => {
    const context = useContext(SelectedRowsContext);
    if (!context) {
        throw new Error('useSelectedRows debe ser usado dentro de un SelectedRowsProvider');
    }
    return context;
};