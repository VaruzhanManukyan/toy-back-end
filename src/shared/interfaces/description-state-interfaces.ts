import { Types } from "mongoose";

export interface IDescriptionState {
    name: string;
}

export interface IDescriptionStateDB {
    _id: Types.ObjectId;
    _doc: IDescriptionState;
}

export interface IDescriptionStateResponse extends IDescriptionState {
    id: Types.ObjectId;
}

export interface IDescriptionStateAllResponse {
    data: IDescriptionState[];
    total: number;
}