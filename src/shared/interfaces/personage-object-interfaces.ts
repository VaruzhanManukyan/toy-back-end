import {Types} from "mongoose";

export interface IPersonageObject {
    name: string;
}

export interface IPersonageObjectDB {
    _id: Types.ObjectId;
    _doc: IPersonageObject;
}

export interface IPersonageObjectResponse extends IPersonageObject {
    id: Types.ObjectId;
}

export interface IPersonageObjectAllResponse {
    data: IPersonageObject[];
    total: number;
}