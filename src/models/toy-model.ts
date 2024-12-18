import {Schema, model} from "mongoose";
import {IToyDB} from "../shared/interfaces/toy-interfaces";

const ToyModel = new Schema({
    toy_type_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    RFID: {
        type: String,
        required: true
    }
});

export default model<IToyDB>("Toy", ToyModel);