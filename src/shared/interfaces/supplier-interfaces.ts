import {Types} from "mongoose";

export interface ISupplier {
    name: string;
    email: string;
    password: string;
    phone: number;
}

export interface ISupplierTemp {
    name: string;
    email: string;
    phone: number;
}

export interface ISupplierDB {
    _id: Types.ObjectId;
    _doc: ISupplierTemp;
}

export interface ISupplierResponse extends ISupplierTemp {
    id: Types.ObjectId;
}

export interface ISupplierAllResponse {
    data: ISupplierResponse[];
    total: number;
}