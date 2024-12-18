import {Types} from "mongoose";
import {IAudioFile} from "./audio-file-interfaces";

export interface IScenario {
    audio_file_ids: Types.ObjectId[];
    personage_object_state_ids: Types.ObjectId[];
    name: string;
}

export interface IScenarioDB {
    _id: Types.ObjectId;
    _doc: IScenario;
}

export interface ITempScenarioCreate {
    audioFiles: IAudioFile[];
    publisher_id: Types.ObjectId;
    personage_object_state_ids: Types.ObjectId[];
    name: string;
}

export interface ITempScenarioUpdate {
    audioFiles: IAudioFile[];
    personage_object_state_ids: Types.ObjectId[];
    audio_file_ids: Types.ObjectId[];
    name: string;
}

export interface IScenarioResponse extends IScenario {
    id: Types.ObjectId;
    publisher_id?: Types.ObjectId;
}

export interface IScenarioAllResponse {
    data: IScenarioResponse[];
    total: number;
}