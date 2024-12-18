import {Types} from "mongoose";

export interface IToy {
    toy_type_id: Types.ObjectId;
    RFID: string;
}

export interface IToyDB {
    _id: Types.ObjectId;
    _doc: IToy;
}

export interface IToyResponse extends IToy {
    id: Types.ObjectId;
}

export interface IToyAllResponse {
    data: IToy[];
    total: number;
}