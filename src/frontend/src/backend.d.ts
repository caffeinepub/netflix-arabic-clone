import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type CategoryId = bigint;
export type ShowId = bigint;
export interface Show {
    id: ShowId;
    title: string;
    isFeatured: boolean;
    posterUrl: string;
    genres: Array<string>;
    showType: ShowType;
    isNew: boolean;
}
export enum ShowType {
    movie = "movie",
    series = "series"
}
export interface backendInterface {
    getAllShows(): Promise<Array<Show>>;
    getFeaturedShow(): Promise<Show | null>;
    getShowsByCategory(categoryId: CategoryId): Promise<Array<Show>>;
}
