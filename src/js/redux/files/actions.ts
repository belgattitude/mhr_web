import { createAction } from 'typesafe-actions';
import {
    ADD_FILE, IFile
} from './types';

export const addFile = createAction(ADD_FILE,
    (filename: string) => ({
        type: ADD_FILE,
        payload: {
            filename: filename,
        } as IFile,
    })
);
