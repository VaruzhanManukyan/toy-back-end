import {Schema, model} from "mongoose";
import {IPersonageObjectDB} from "../shared/interfaces/personage-object-interfaces";

const PersonageObjectModel = new Schema({
    name: {
        type: String,
        required: true
    }
});

export default model<IPersonageObjectDB>("Personage_object", PersonageObjectModel);
