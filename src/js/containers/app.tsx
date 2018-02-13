import React from 'react';
import {hot} from 'react-hot-loader';
import {ConnectedRouter} from 'react-router-redux';
import {Route} from 'react-router-dom';
import { history } from '@src/store';

import {Switch} from 'react-router';
import { AppBarConnected } from '@src/connected/app-bar-connected';
import GLTest from '@src/containers/gl-test';

import Home from '@src/containers/home';
import VideoCanvas from '@src/containers/video-canvas';
import TestScroll from '@src/containers/test-scroll';
import Transition from '@src/containers/transition';
import PixiContainer from '@src/containers/pixi-container';

class NotFoundComponent extends React.Component<{}, {}> {
    public render() {
        return(
            <h1 style={{color: 'red'}}>Page not found!</h1>
        );
    }
}

class App extends React.Component<{}, {}> {
    public render(): React.ReactElement<App> {

        return (
            <div>
                <ConnectedRouter history={history}>
                    <div>
                        <header>
                            <AppBarConnected title="MHR" />
                        </header>
                        <main>
                            <Switch>
                                <Route exact={true} path="/" component={Home}/>
                                <Route exact={true} path="/gl-test" component={GLTest}/>
                                <Route exact={true} path="/video-canvas" component={VideoCanvas}/>
                                <Route exact={true} path="/test-scroll" component={TestScroll}/>
                                <Route exact={true} path="/transition" component={Transition} />
                                <Route exact={true} path="/gl-test" component={GLTest}/>
                                <Route exact={true} path="/pixi" component={PixiContainer}/>
                                <Route component={NotFoundComponent}/>
                            </Switch>
                        </main>
                    </div>
                </ConnectedRouter>
            </div>
        );
    }
}

export default hot(module)(App);
