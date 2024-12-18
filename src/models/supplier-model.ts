import {Schema, model} from "mongoose";
import {ISupplierDB} from "../shared/interfaces/supplier-interfaces";

const SupplierModel = new Schema({
    name: {
        type: String,
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
})

export default model<ISupplierDB>("Supplier", SupplierModel);