import React from "react";

export interface ReporType {
    id: number[]
}

export interface Report {
    type: React.FC<ReporType>,
    title: string,
}

