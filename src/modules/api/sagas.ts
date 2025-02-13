import { SagaIterator } from 'redux-saga';
import { takeEvery, call, put } from 'redux-saga/effects';
import * as Api from 'typescript-fetch-api';
import * as petstore from '../petstore/actions';

const pets = new Api.PetApi();

function* handleAddPet(action: petstore.AddPetAction): SagaIterator {
    try {
        let result = yield call(function() {
            const body = action.payload;
            return pets.addPet(body);
        });

        yield put(petstore.addPet.done({ params: action.payload, result }));
    } catch (error) {
        yield put(petstore.addPet.failed({ params: action.payload, error }));
    }
}

function* handleRequestPets(action: petstore.RequestPetsAction): SagaIterator {
    try {
        let result: Api.Pet[] = yield call(() => {
            const status: ('available' | 'pending' | 'sold')[] = ['available'];
            return pets.findPetsByStatus(status);
        });

        yield put(petstore.requestPets.done({ params: action.payload, result }));
    } catch (error) {
        yield put(petstore.requestPets.failed({ params: action.payload, error }));
    }
}

export default function* saga(): SagaIterator {
    yield takeEvery(petstore.addPet.started, handleAddPet);
    yield takeEvery(petstore.requestPets.started, handleRequestPets);
}
