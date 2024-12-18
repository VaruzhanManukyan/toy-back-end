import {Types} from "mongoose";

export interface IPublisher {
    scenario_ids: Types.ObjectId[],
    name: string;
    email: string;
    password: string;
    phone: number;
}

export interface IPublisherTemp {
    scenario_ids: Types.ObjectId[],
    name: string;
    email: string;
    phone: number;
}

export interface IPublisherDB {
    _id: Types.ObjectId;
    _doc: IPublisherTemp;
}

export interface IPublisherResponse extends IPublisherTemp {
    id: Types.ObjectId;
}

export interface IPublisherAllResponse {
    data: IPublisherResponse[];
    total: number;
}