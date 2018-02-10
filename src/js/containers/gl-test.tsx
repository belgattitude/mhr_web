import React from 'react';
const GLTransitions = require('gl-transitions');
import createREGL from 'regl';
const createREGLTransition = require('regl-transition');

export const loadImage = (src) => {

    return new Promise((resolve, reject) => {
        if (src.match(/\.(jpg|png|gif)\b/)) {
            const img = new Image();
            img.crossOrigin = 'anonyous';
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.onabort = reject;
            img.src = src;
        } else {
            console.log('loading video', src);
            const video = window.document.createElement('video');
            video.onloadedmetadata = () => resolve(video);
            video.autoplay = true;
            video.muted = true;
            video.crossOrigin = 'anonymous';
            video.onerror = reject;
            video.onabort = reject;
            video.src = src;
            video.play();
        }
    });

};

export const loadVideos = src =>
    new Promise((resolve, reject) => {
        const video = new HTMLVideoElement();
        video.oncanplay = () => resolve(video);
        video.autoplay = false;
        video.muted = true;
        video.onerror = reject;
        video.onabort = reject;
        video.src = src;
    });

class Slider extends React.Component<{}, {}> {

    regl: any;
    canvas: HTMLCanvasElement;
    loadedTextures: any[];
    webglContext: WebGLRenderingContext;

    constructor(props) {
        super(props);
    }

    componentDidMount() {

        console.log('didmount');
        const delay = 1;
        const duration = 1.5;
        const imgSrcs = 'wxqlQkh,G2Whuq3,0bUSEBX'
            .split(',')
            .map(id => `https://i.imgur.com/${id}.jpg`);

        //imgSrcs.push('http://localhost/paola/deshake.m4v');

        const context = this.canvas.getContext('webgl', {
            antialias: false,
            //stencil: true,
            //preserveDrawingBuffer: true
        });

        if (context == null) { return; }
        this.webglContext = context;

        //document.body.appendChild(canvas)

        this.regl = createREGL(this.webglContext);
        const transitions = GLTransitions.map(t => createREGLTransition(this.regl, t));

        Promise.all(imgSrcs.map(loadImage)).then(imgs => {
            this.loadedTextures = imgs.map(img => this.regl.texture(img));
            this.regl.frame(({ time }) => {
                const slides = this.loadedTextures;
                const index = Math.floor(time / (delay + duration));
                const from = slides[index % slides.length];
                const to = slides[(index + 1) % slides.length];
                const transition = transitions[index % transitions.length];
                const total = delay + duration;
                const progress = Math.max(0, (time - index * total - delay) / duration);
                transition({ progress, from, to });
            });

        }).catch((reason) => {
            console.log('LOAD FAILED', reason);
        });
    }

    componentWillUnmount() {
        console.log('will unmount');
        console.log('this.webglContext', this.webglContext);
        /*
        this.loadedTextures.forEach((texture) => {
            this.webglContext.deleteTexture(texture);
        });
        */
        this.regl.destroy();
        console.log('this.textures', this.loadedTextures);
        delete this.webglContext;
    }

    render() {
        return (
            <div>
                Hello
                <canvas
                    style={{
                        width: window.innerWidth,
                        height: 400,
                        position: 'absolute',
                        zIndex: -2,
                        top: 200,
                        left: 0,
                        bottom: 0,
                        right: 0,
                    }}
                    ref={(ref: HTMLCanvasElement) => {this.canvas = ref;}} />
            </div>
        );
    }
}

interface IGLTestState {
    visible: boolean;
}

class GLTest extends React.Component<{}, IGLTestState> {

    state: IGLTestState = {
        visible: true,
    };

    toggleSlider() {
        this.setState((prevState) => {
            return {
                ...prevState,
                visible: !prevState.visible,
            };
        });
    }

    render() {

        return (
            <div>
                <button onClick={(e) => {this.toggleSlider();}}>Toggle</button>
                {this.state.visible ?
                    <Slider/>
                    :
                    <div>Hidden slider</div>
                }
            </div>
        );
    }
}

export default GLTest;
