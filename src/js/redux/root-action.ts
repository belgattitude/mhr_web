// RootActions
import { RouterAction, LocationChangeAction } from 'react-router-redux';
import { $call } from 'utility-types';

import { filesActions } from '@src/redux/files';

const returnsOfActions = [
    ...Object.values(filesActions),
].map($call);

type AppAction = typeof returnsOfActions[number];
type ReactRouterAction = RouterAction | LocationChangeAction;

export type RootAction =
    | AppAction
    | ReactRouterAction;
