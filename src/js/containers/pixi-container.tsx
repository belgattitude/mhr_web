import React from 'react';
import * as PIXI from 'pixi.js';
//import bunnyImage from "@assets/images/bunny.png";

interface IProps {
    width: 800;
    height: 600;
}
interface IState {
    scale: number;
}

class PixiContainer extends React.Component<IProps, IState> {

    state: IState = {
        scale: 1,
    };

    props: IProps;

    pixiDom: HTMLDivElement;
    pixiApp: PIXI.Application;

    constructor(props: IProps) {
        super(props);
    }

    public createVideoElement(): HTMLVideoElement {

        const videoElement = document.createElement('video') as HTMLVideoElement;
        videoElement.crossOrigin = 'anonymous';
        videoElement.autoplay = true;
        videoElement.muted = true;
        videoElement.loop = true;
        //videoElement.src = 'http://localhost/paola/deshake.m4v';
        videoElement.src = 'http://localhost/paola/trailer_hd.mp4';
        return videoElement;
    }

    handleClick = () => {
        this.setState(state => ({ ...state, scale: state.scale * 1.25 }));
    }

    initPixiApp(width: number, height: number): void {

        const app = new PIXI.Application(width, height, {
            antialias: true,
            transparent: true,
        });

        const videoTexture = PIXI.Texture.fromVideo(this.createVideoElement());

        const videoSprite = new PIXI.Sprite(videoTexture);

        // Stetch the fullscreen
        videoSprite.width = app.screen.width;
        videoSprite.height = app.screen.height;

        videoSprite.interactive = true;
        videoSprite.on('pointerdown', () => {
            videoSprite.scale.x *= 1.05;
            videoSprite.scale.y *= 1.05;
        });

        //const container = new PIXI.Container();
        //container.addChild(videoSprite);

        app.stage.addChild(videoSprite);

        // Adding shader

        const fragmentShader = `
            precision mediump float;

            varying vec2 vTextureCoord;
            varying vec4 vColor;

            uniform sampler2D uSampler;
            uniform float customUniform;

            void main(void)
            {
                vec2 uvs = vTextureCoord.xy;

                vec4 fg = texture2D(uSampler, vTextureCoord);

                fg.r = uvs.y + sin(customUniform);

                //fg.r = clamp(fg.r,0.0,0.9);

                gl_FragColor = fg;

            }
        `;
        const vertexShader = undefined;

        const filter = new PIXI.Filter(vertexShader, fragmentShader);
        videoSprite.filters = [ filter ];

        app.ticker.add((delta) => {
            (filter.uniforms as any).customUniform += 0.04 * delta;
        });

        this.pixiApp = app;

    }

    componentDidMount() {

        this.initPixiApp(this.props.width, this.props.height);
        this.pixiDom.appendChild(this.pixiApp.view);
    }

    componentWillUnmount() {

        // Destroy pixi app
        //this.pixiApp.stage = null as any;
        this.pixiApp.destroy(true);

        //this.pixiDom.removeChild(this.pixiApp.renderer.view);

        //
        //this.pixiApp.renderer.destroy(true);
        //this.pixiApp.renderer = null as any;

    }

    shouldComponentUpdate(nextProps: IProps, nextState: IState): boolean {
        return nextState.scale != this.state.scale;
    }

    render() {
        const style = {
            zIndex: -2,
        };

        return (
            <div ref={(ref: HTMLDivElement) => {this.pixiDom = ref; }}
                 style={style}
            >
            </div>
        );
    }
}

export default PixiContainer;
