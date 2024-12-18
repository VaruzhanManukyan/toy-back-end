import {Schema, model} from "mongoose";
import {IScenarioDB} from "../shared/interfaces/scenario-interfaces";

const ScenarioModel = new Schema({
    audio_file_ids: [{ type: Schema.Types.ObjectId, ref: 'Audio_file' }],
    personage_object_state_ids: [{ type: Schema.Types.ObjectId, ref: 'Personage_object_state' }],
    name: {
        type: String,
        required: true
    }
});

export default model<IScenarioDB>("Scenario", ScenarioModel);
