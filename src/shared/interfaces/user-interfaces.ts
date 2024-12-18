import {Types} from "mongoose";

export interface IUser {
    device_ids: Types.ObjectId[];
    scenario_ids: Types.ObjectId[];
    email: string;
    password: string;
    role: string;
}

export interface IUserDB {
    _id: Types.ObjectId;
    _doc: IUser;
}

export interface IUserResponse extends IUser {
    id: Types.ObjectId;
}

export interface IUserAllResponse {
    data: IUserResponse[];
    total: number;
}