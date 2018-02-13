import React from 'react';

import {
    BoxGeometry,
    LinearFilter,
    Mesh,
    MeshBasicMaterial,
    ShaderMaterial,
    PerspectiveCamera,
    PlaneGeometry,
    RGBAFormat,
    RGBFormat,
    Scene,
    Vector2,
    VideoTexture,
    WebGLRenderer,
    MeshBasicMaterialParameters,
    ShaderMaterialParameters,
} from 'three'; //"three/build/three.module"; // 'three';

export interface ITestSceneState {
    width: number;
    height: number;
    videoSrc?: string;
}

export interface ITestSceneProps {
    videoSrc: string;
}

export class CubeScene extends React.Component<ITestSceneProps, ITestSceneState> {

    mount: HTMLDivElement;
    scene: Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    // private material: MeshBasicMaterial;
    cube: Mesh;
    frameId: number;

    video: HTMLVideoElement;

    state: ITestSceneState = {
        width: 600,
        height: 600,
    };

    props: ITestSceneProps;

    constructor(props: ITestSceneProps) {
        super(props);

        this.state = {...this.state, videoSrc: this.props.videoSrc};
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.animate = this.animate.bind(this);
    }

    createVideoElement(videoSrc: string): HTMLVideoElement {
        const video = document.createElement( 'video' );
        video.width = 640;
        video.height = 360;
        video.loop = true;
        video.muted = true;
        video.crossOrigin = 'anonymous';
        video.src = videoSrc;
        video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
        video.play();
        return video;
    }

    componentDidMount() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        const scene = new Scene();
        const camera = new PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        );
        const renderer = new WebGLRenderer({
            antialias: true,
        });
        renderer.setPixelRatio( window.devicePixelRatio );
        //renderer.setSize( window.innerWidth, window.innerHeight );

        const videoSrc = this.state.videoSrc as string;
        this.video = this.createVideoElement(videoSrc);
        const videoTexture = new VideoTexture( this.video );
        videoTexture.minFilter = LinearFilter;
        videoTexture.format = RGBFormat;

        const videoMaterial = new MeshBasicMaterial({
            //color: 0xffffff,
            map: videoTexture,
        });

        const video2Material = new MeshBasicMaterial({
            map: videoTexture,
            //   opacity: 0.1

        } as MeshBasicMaterialParameters);

        const emptyMaterial = new MeshBasicMaterial({
            color: 0xffffff,
        });

//        dice = new THREE.Mesh( new THREE.BoxGeometry( 562, 562, 562, 1, 1, 1 ), materials );

        const materials = [
            videoMaterial,
            emptyMaterial,
            emptyMaterial,
            video2Material,
        ];

        const cubeGeometry = new BoxGeometry(1, 1, 1);

        const cubeMesh = new Mesh(cubeGeometry, materials);

        camera.position.z = 2;
        scene.add(cubeMesh);
        renderer.setClearColor('#000000');
        renderer.setSize(width, height);

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        //this.material = material;
        this.cube = cubeMesh;

        this.mount.appendChild(this.renderer.domElement);
        this.start();
    }

    componentWillUnmount() {
        console.log('UNMOUNTING SCENE');
        this.video.pause();
        this.stop();
        this.mount.removeChild(this.renderer.domElement);
        delete this.video;
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    }

    stop() {
        this.video.pause();
        cancelAnimationFrame(this.frameId);
    }

    animate() {
        this.cube.rotation.x += 0.01;
        this.cube.rotation.y += 0.01;

        this.renderScene();
        this.frameId = window.requestAnimationFrame(this.animate);
    }

    renderScene() {
        this.renderer.render(this.scene, this.camera);
    }

    render() {
        return (
            <div
                style={{ width: '800px', height: '800px' }}
                ref={(mount) => { this.mount = (mount as HTMLDivElement); }}
            />
        );
    }
}

export class PlaneScene extends React.Component<ITestSceneProps, ITestSceneState> {

    mount: HTMLDivElement;
    scene: Scene;
    camera: PerspectiveCamera;
    renderer: WebGLRenderer;
    // private material: MeshBasicMaterial;
    plane: Mesh;
    frameId: number;

    video: HTMLVideoElement;

    state: ITestSceneState = {
        width: 600,
        height: 600,
    };

    props: ITestSceneProps;

    constructor(props: ITestSceneProps) {
        super(props);

        this.state = {...this.state, videoSrc: this.props.videoSrc};
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.animate = this.animate.bind(this);
    }

    createVideoElement(videoSrc: string): HTMLVideoElement {
        const video = document.createElement( 'video' );
        //video.width = 640;
        //video.height = 360;
        video.loop = true;
        video.muted = true;
        video.crossOrigin = 'anonymous';
        video.src = videoSrc;
        video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
        video.play();
        return video;
    }

    componentDidMount() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        const scene = new Scene();
        const camera = new PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        );
        const renderer = new WebGLRenderer({
            antialias: true,
        });
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );

        const geometry = new PlaneGeometry(2, 2);

        const videoSrc = this.state.videoSrc as string;
        this.video = this.createVideoElement(videoSrc);
        const videoTexture = new VideoTexture( this.video );
        videoTexture.minFilter = LinearFilter;
        videoTexture.magFilter = LinearFilter;
        videoTexture.format = RGBAFormat;

        const shaderMaterial = new ShaderMaterial( {

            uniforms: {
                time: { value: 1.0 },
                resolution: { value: new Vector2() },
                video: videoTexture,
            },

            vertexShader: `
                uniform float time;
                uniform vec2 resolution;
                void main()	{
                    gl_Position = vec4( position, 1.0 );
                }
            `,

            fragmentShader: `
                uniform float time;
                uniform vec2 resolution;
                void main()	{
                    float x = mod(time + gl_FragCoord.x, 20.) < 10. ? 1. : 0.;
                    float y = mod(time + gl_FragCoord.y, 20.) < 10. ? 1. : 0.;
                    gl_FragColor = vec4(vec3(min(x, y)), 1.);
                }
            `,

            /*
            fragmentShader: `
                uniform float time;
                uniform sampler2D video;
                uniform vec2 resolution;
                void main()	{
                    float x = mod(time + gl_FragCoord.x, 20.) < 10. ? 1. : 0.;
                    float y = mod(time + gl_FragCoord.y, 20.) < 10. ? 1. : 0.;
                    gl_FragColor = vec4(vec3(min(x, y)), 1.);
                }
            `*/

        } as ShaderMaterialParameters);

        //console.log('shaderMaterial', shaderMaterial);

        const videoMaterial = new MeshBasicMaterial({
            map: videoTexture,
         //   opacity: 0.1

        } as MeshBasicMaterialParameters);

        const materials = [
            videoMaterial,
        ];

        const videoMesh = new Mesh(geometry, materials);
        scene.add(videoMesh);

        camera.position.z = 2;
        //scene.add(shaderMaterial);

        shaderMaterial.transparent = true;
        /*
        const blendings = [ 'NoBlending', 'NormalBlending', 'AdditiveBlending', 'SubtractiveBlending', 'MultiplyBlending' ];

        shaderMaterial.blending = THREE[blendings[3]];
*/
        const planeGeometry = new PlaneGeometry( 2, 2 );
        const shaderMesh = new Mesh(planeGeometry, shaderMaterial );

        scene.add(shaderMesh);

        renderer.setClearColor('#000000');
        renderer.setSize(width, height);

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.plane = shaderMesh;

        this.mount.appendChild(this.renderer.domElement);
        this.start();
    }

    componentWillUnmount() {
        console.log('UNMOUNTING SCENE');
        this.video.pause();
        this.stop();
        this.mount.removeChild(this.renderer.domElement);
        delete this.video;
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate);
        }
    }

    stop() {
        this.video.pause();
        cancelAnimationFrame(this.frameId);
    }

    animate() {

        this.renderScene();
        this.frameId = window.requestAnimationFrame(this.animate);
    }

    renderScene() {
        this.renderer.render(this.scene, this.camera);
    }

    render() {

        const style = {
            width: window.innerWidth,
            height: window.innerHeight,

        };
        return (
            <div
                style={style}
                ref={(mount) => { this.mount = (mount as HTMLDivElement); }}
            />
        );
    }
}
