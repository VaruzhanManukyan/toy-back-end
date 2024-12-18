import {Schema, model} from "mongoose";
import {IUserDB} from "../shared/interfaces/user-interfaces";

const UserModel = new Schema({
    device_ids: [{ type: Schema.Types.ObjectId, ref: 'Device' }],
    scenario_ids: [{ type: Schema.Types.ObjectId, ref: 'Scenario' }],
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});

export default model<IUserDB>("User", UserModel);