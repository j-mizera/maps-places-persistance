import { Generated, Insertable, Selectable } from "kysely";

export interface Database {
    marker: MarkerTable
}

export interface MarkerTable {
    id: Generated<number>,
    title: string,
    description: string,
    lat: number,
    lng: number,
}

export type Marker = Selectable<MarkerTable>
export type NewMarker = Insertable<MarkerTable>