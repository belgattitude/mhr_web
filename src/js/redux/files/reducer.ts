import { combineReducers } from 'redux';
import { getType } from 'typesafe-actions';

import { IFile } from './types';
import { addFile } from './actions';

export type FilesState = {
    readonly files: IFile[];
};

export const initialState = [];

export const filesReducer = combineReducers<FilesState, FilesAction>({
    files: (state = initialState, action) => {
        switch (action.type) {
            case getType(addFile):
                return [...state, action.payload];
            default:
                return state;
        }
    },
});

// inferring union type of actions
import { $call } from 'utility-types';
import * as actions from './actions';
const returnsOfActions = Object.values(actions).map($call);
export type FilesAction = typeof returnsOfActions[number];
