import {Types} from "mongoose";

export interface IRightTransactionRequest {
    buyer_id: Types.ObjectId;
    user_ids: Types.ObjectId[];
    device_supplier_id?: Types.ObjectId;
    device_id: Types.ObjectId;
    publisher_id?: Types.ObjectId;
    scenario_id: Types.ObjectId;
    audio_file_ids?:Types.ObjectId[];
    personage_object_state_all_info?: IPersonageObjStateAllInfo[];
}

export interface IRightTransactionResponseTemp {
    buyer: string;
    users: string[];
    device_supplier?: string;
    serial_number: string;
    publisher?: string;
    scenario: string;
    audio_files?: string[];
    personage_object_state_all_info?: IPersonageObjStateAllInfo[];
}

export interface IPersonageObjStateAllInfo {
    toy_type_supplier: string;
    personage_object_state: string;
    toy_type: string;
    personage_object: string;
    description_states: string[];
}

export interface IRightTransactionDB {
    _id: Types.ObjectId;
    _doc: IRightTransactionResponseTemp;
}

export interface IRightTransactionResponse extends IRightTransactionResponseTemp {
    id: Types.ObjectId;
}

export interface IRightTransactionAllResponse {
    data: IRightTransactionResponse[];
    total: number;
}