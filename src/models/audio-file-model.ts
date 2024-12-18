import {Schema, model} from "mongoose";
import {IAudioFileDB} from "../shared/interfaces/audio-file-interfaces";

const AudioFileModel = new Schema({
    name: {
        type: String,
        required: true
    },
    audioSrc: {
        type: String,
        required: true
    }
});

export default model<IAudioFileDB>("Audio_file", AudioFileModel);

