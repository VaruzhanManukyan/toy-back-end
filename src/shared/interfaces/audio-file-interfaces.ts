import {Types} from "mongoose";

export interface IAudioFile {
    name: string;
    audioSrc: string;
}

export interface IAudioFileDB {
    _id: Types.ObjectId;
    _doc: IAudioFile;
    scenario_id?: Types.ObjectId;
}

export interface IAudioFileResponse extends IAudioFile {
    id: Types.ObjectId;
    scenario_id?: Types.ObjectId;
}

export interface IAudioFileAllResponse {
    data: IAudioFileResponse[],
    total: number;
}