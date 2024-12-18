import {Schema, model} from "mongoose";
import {IRightTransactionDB} from "../shared/interfaces/right-transaction-interfaces";

const RightTransactionModel = new Schema({
    buyer: {type: String, required: true},
    users: [{type: String, required: true}],
    serial_number: {type: String, required: true},
    audio_files: [{type: String, required: true}],
    device_supplier: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    scenario: {
        type: String,
        required: true
    },
    personage_object_state_all_info: [
        {
            toy_type_supplier: {
                type: String,
                required: true
            },
            toy_type: {
                type: String,
                required: true
            },
            personage_object_state: {
                type: String,
                required: true
            },
            personage_object: {
                type: String,
                required: true
            },
            description_states: [{
                type: String,
                required: true
            }]
        }
    ]
});

export default model<IRightTransactionDB>("Right_transaction", RightTransactionModel);