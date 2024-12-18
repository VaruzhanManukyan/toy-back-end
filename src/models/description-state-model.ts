import {IDescriptionStateDB} from "../shared/interfaces/description-state-interfaces";
import {model, Schema} from "mongoose";

const DescriptionStateSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

export default model<IDescriptionStateDB>("Description_state", DescriptionStateSchema);
