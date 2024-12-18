import {Types} from "mongoose";

export interface IToyType {
    supplier_id: Types.ObjectId;
    personage_object_state_id: Types.ObjectId;
    default_scenario_id: Types.ObjectId;
    name: string;
    price: number;
    description: string;
    imageSrc?: string;
}

export interface IToyTypeDB {
    _id: Types.ObjectId;
    _doc: IToyType;
}

export interface IToyTypeResponse extends IToyType {
    id: Types.ObjectId;
}

export interface IToyTypeAllResponse {
    data: IToyTypeResponse[];
    total: number;
}