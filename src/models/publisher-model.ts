import {Schema, Types, model} from "mongoose";
import {IPublisherDB} from "../shared/interfaces/publisher-interfaces";

const PublisherModel = new Schema({
    scenario_ids: [{ type: Types.ObjectId, ref: 'Scenario' }],
    name: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
});

export default model<IPublisherDB>("Publisher", PublisherModel);