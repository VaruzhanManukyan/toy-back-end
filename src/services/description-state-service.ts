import {Types} from "mongoose";
import ApiError from "../exceptions/api-error";
import {IDescriptionState, IDescriptionStateDB} from "../shared/interfaces/description-state-interfaces";
import {IAudioFileDB} from "../shared/interfaces/audio-file-interfaces";
import DescriptionStateModel from "../models/description-state-model";
import PersonageObjectStateModel from "../models/personage-object-state-model";

class DescriptionStateService {
    async create(descriptionState: IDescriptionState): Promise<IDescriptionStateDB> {
        try {
            const candidateWithName: IDescriptionState | null = await DescriptionStateModel.findOne({name: descriptionState.name});
            if (candidateWithName) {
                throw ApiError.BadRequest(`Description state with this name ${descriptionState.name} already exists.`);
            }
            const descriptionStateDB = new DescriptionStateModel(descriptionState);
            await descriptionStateDB.save();
            return descriptionStateDB;
        } catch (error) {
            throw error;
        }
    }

    async getAll(): Promise<IDescriptionStateDB[]> {
        try {
            const descriptionStatesDB: IDescriptionStateDB[] = await DescriptionStateModel.find();
            return descriptionStatesDB;
        } catch (error) {
            throw error;
        }
    }

    async getById(id: Types.ObjectId): Promise<IDescriptionStateDB> {
        try {
            const descriptionStateDB: IDescriptionStateDB | null = await DescriptionStateModel.findById(id);

            if (!descriptionStateDB) {
                throw ApiError.NotFound(`Description state with id ${id} not found.`);
            }

            return descriptionStateDB;
        } catch (error) {
            throw error;
        }
    }

    async update(id: Types.ObjectId, descriptionState: IDescriptionState): Promise<IDescriptionStateDB> {
        try {
            const candidateWithName: IAudioFileDB | null = await DescriptionStateModel.findOne({name: descriptionState.name});
            if (candidateWithName && id.toString() !== candidateWithName._id.toString()) {
                throw ApiError.BadRequest(`Description state with this name ${name} already exists.`);
            }

            const IDescriptionStateDB: IDescriptionStateDB | null = await DescriptionStateModel.findOneAndUpdate(
                {_id: id},
                {$set: descriptionState},
                {new: true}
            );

            if (!IDescriptionStateDB) {
                throw ApiError.NotFound(`Description state with id ${id} not found.`);
            }

            return IDescriptionStateDB;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: Types.ObjectId): Promise<string> {
        try {
            const result = await DescriptionStateModel.deleteOne({_id: id});

            if (result.deletedCount === 0) {
                throw ApiError.NotFound(`Description state with id ${id} not found.`);
            }

            await PersonageObjectStateModel.updateMany(
                {description_state_ids: id},
                {$pull: {description_state_ids: id}}
            );

            return "Description state is deleted and related references are updated.";
        } catch (error) {
            throw error;
        }
    }

    async deleteMany(descriptionStateIds: Types.ObjectId[]): Promise<string> {
        try {
            const result = await DescriptionStateModel.deleteMany({ _id: { $in: descriptionStateIds } });
            if (result.deletedCount === 0) {
                throw ApiError.NotFound(`No DescriptionStates found for the provided ids.`);
            }

            await PersonageObjectStateModel.updateMany(
                { description_state_ids: { $in: descriptionStateIds } },
                { $pull: { description_state_ids: { $in: descriptionStateIds } } }
            );

            return "Description states and related references are deleted.";
        } catch (error) {
            throw error;
        }
    }
}

export default new DescriptionStateService();