import {Types} from "mongoose";
import ApiError from "../exceptions/api-error";
import {IPersonageObjectState, IPersonageObjectStateDB} from "../shared/interfaces/personage-object-state-interfaes";
import PersonageObjectStateModel from "../models/personage-object-state-model";

class PersonageObjectStateService {
    async create(personageObjectState: IPersonageObjectState): Promise<IPersonageObjectStateDB> {
        try {
            const candidateWithName: IPersonageObjectStateDB | null = await PersonageObjectStateModel.findOne({name: personageObjectState.name});
            if (candidateWithName) {
                throw ApiError.BadRequest(`Personage object state with this name ${personageObjectState.name} already exists.`);
            }
            const personageObjectStateDB = new PersonageObjectStateModel(personageObjectState);
            await personageObjectStateDB.save();
            return personageObjectStateDB;
        } catch (error) {
            throw error;
        }
    }

    async getAll(): Promise<IPersonageObjectStateDB[]> {
        const personageObjectsStateDB: IPersonageObjectStateDB[] = await PersonageObjectStateModel.find();
        return personageObjectsStateDB;
    }

    async getById(id: Types.ObjectId): Promise<IPersonageObjectStateDB> {
        try {
            const personageObjectStateDB: IPersonageObjectStateDB | null = await PersonageObjectStateModel.findById(id);

            if (!personageObjectStateDB) {
                throw ApiError.NotFound(`Personage object state with id ${id} not found.`);
            }

            return personageObjectStateDB;
        } catch (error) {
            throw error;
        }
    }

    async update(id: Types.ObjectId, personageObjectState: IPersonageObjectState): Promise<IPersonageObjectStateDB> {
        const candidateWithName: IPersonageObjectStateDB | null = await PersonageObjectStateModel.findOne({name: personageObjectState.name});
        if (candidateWithName && id.toString() !== candidateWithName._id.toString()) {
            throw ApiError.BadRequest(`Personage object with this name ${name} already exists.`);
        }

        const personageObjectStateDB: IPersonageObjectStateDB | null = await PersonageObjectStateModel.findOneAndUpdate(
            {_id: id},
            {$set: personageObjectState},
            {new: true}
        );

        if (!personageObjectStateDB) {
            throw ApiError.NotFound(`Personage object state with id ${id} not found.`);
        }

        return personageObjectStateDB;
    }

    async delete(id: Types.ObjectId): Promise<string> {
        const result = await PersonageObjectStateModel.deleteOne({_id: id});
        if (result.deletedCount === 0) {
            throw ApiError.NotFound(`Personage object state with id ${id} not found.`);
        }
        return "Personage object state is deleted.";
    }

    async deleteMany(ids: Types.ObjectId[]): Promise<string> {
        const result = await PersonageObjectStateModel.deleteMany({_id: {$in: ids}});
        if (result.deletedCount === 0) {
            throw ApiError.NotFound(`No personage object states found for the provided IDs.`);
        }
        return `${result.deletedCount} personage object state deleted.`;
    }
}

export default new PersonageObjectStateService();