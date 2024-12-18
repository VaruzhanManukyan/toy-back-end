import { Schema, model } from 'mongoose';
import {IToyTypeDB} from "../shared/interfaces/toy-type-interfaces";

const ToyTypeSchema = new Schema({
    supplier_id: {
        ref: 'Supplier',
        type: Schema.Types.ObjectId,
        required: true
    },
    personage_object_state_id: {
        ref: 'Personage_object_state',
        type: Schema.Types.ObjectId,
        required: true
    },
    default_scenario_id: {
        ref: 'Scenario',
        type: Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageSrc: {
        type: String,
        default: '' // Optional field, default value if not provided
    }
});

export default model<IToyTypeDB>("Toy_type", ToyTypeSchema);

