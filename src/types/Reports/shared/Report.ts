import { Table } from "@tanstack/react-table";
import React from "react";

export interface ReporType<TData> {
    table?: Table<TData>
}

export type Report<TData> = {
    type: React.FC<ReporType<TData>>,
    title: string,
}

