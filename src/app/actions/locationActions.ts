"use server";

import { db } from "@/lib/database/db";

export interface Location {
    title: string,
    description: string,
    lat: number,
    lng: number,
}

export async function saveLocation(location: Location): Promise<void> {
    await db.insertInto("marker").values({... location}).execute();
}

export async function fetchLocations(): Promise<Location[]> {
    return db.selectFrom("marker")
        .selectAll("marker")
        .execute();
}