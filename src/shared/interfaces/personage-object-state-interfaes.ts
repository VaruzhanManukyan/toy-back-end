import {Types} from "mongoose";

export interface IPersonageObjectState {
    personage_object_id: Types.ObjectId;
    description_state_ids: Types.ObjectId[];
    name: string;
}

export interface IPersonageObjectStateDB {
    _id: Types.ObjectId;
    _doc: IPersonageObjectState;
}

export interface IPersonageObjectStateResponse extends IPersonageObjectState {
    id: Types.ObjectId;
}

export interface IPersonageObjectStateAllResponse {
    data: IPersonageObjectState[],
    total: number;
}