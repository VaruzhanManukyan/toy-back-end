import {Schema, model} from "mongoose";
import {IPersonageObjectStateDB} from "../shared/interfaces/personage-object-state-interfaes";

const PersonageObjectStateModel = new Schema({
    personage_object_id: {
        ref: "Personage_object",
        type: Schema.Types.ObjectId,
        required: true
    },
    description_state_ids: [{ type: Schema.Types.ObjectId, ref: 'Description_state' }],
    name: {
        type: String,
        required: true
    }
});

export default model<IPersonageObjectStateDB>("Personage_object_state", PersonageObjectStateModel);
