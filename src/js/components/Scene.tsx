import React from 'react';
import * as THREE from 'three';
import {Mesh, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import {MeshBasicMaterialParameters, ShaderMaterialParameters} from "three/three-core";


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
        super(props)

        this.state = {...this.state, videoSrc: this.props.videoSrc};
        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.animate = this.animate.bind(this)
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

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        )
        const renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setPixelRatio( window.devicePixelRatio );
        //renderer.setSize( window.innerWidth, window.innerHeight );


        const geometry = new THREE.BoxGeometry(1, 1, 1);
        //const geometry = new THREE.PlaneGeometry(1, 1);

        const videoSrc = this.state.videoSrc as string;
        this.video = this.createVideoElement(videoSrc);
        const texture = new THREE.VideoTexture( this.video );
        texture.minFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;

        const videoMaterial = new THREE.MeshBasicMaterial({
            //color: 0xffffff,
            map: texture
        });

        const emptyMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
        });

//        dice = new THREE.Mesh( new THREE.BoxGeometry( 562, 562, 562, 1, 1, 1 ), materials );


        const materials = [
            videoMaterial,
            emptyMaterial,
            emptyMaterial,
            videoMaterial

        ];

        const cube = new THREE.Mesh(geometry, materials);

        camera.position.z = 2;
        scene.add(cube);
        renderer.setClearColor('#000000');
        renderer.setSize(width, height);

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        //this.material = material;
        this.cube = cube;

        this.mount.appendChild(this.renderer.domElement)
        this.start()
    }

    componentWillUnmount() {
        console.log('UNMOUNTING SCENE');
        this.video.pause();
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
        delete this.video;
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    stop() {
        this.video.pause();
        cancelAnimationFrame(this.frameId)
    }

    animate() {
        this.cube.rotation.x += 0.01
        this.cube.rotation.y += 0.01

        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
    }

    renderScene() {
        this.renderer.render(this.scene, this.camera)
    }

    render() {
        return (
            <div
                style={{ width: '800px', height: '800px' }}
                ref={(mount) => { this.mount = (mount as HTMLDivElement) }}
            />
        )
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
        super(props)

        this.state = {...this.state, videoSrc: this.props.videoSrc};
        this.start = this.start.bind(this)
        this.stop = this.stop.bind(this)
        this.animate = this.animate.bind(this)
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

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        )
        const renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );


        const geometry = new THREE.PlaneGeometry(2, 2);

        const videoSrc = this.state.videoSrc as string;
        this.video = this.createVideoElement(videoSrc);
        const videoTexture = new THREE.VideoTexture( this.video );
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.format = THREE.RGBAFormat;

        const shaderMaterial = new THREE.ShaderMaterial( {

            uniforms: {
                time: { value: 1.0 },
                resolution: { value: new THREE.Vector2() },
                video: videoTexture
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
            `

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

        const videoMaterial = new THREE.MeshBasicMaterial({
            map: videoTexture,
         //   opacity: 0.1

        } as MeshBasicMaterialParameters);




        const materials = [
            videoMaterial
        ];

        const videoMesh = new THREE.Mesh(geometry, materials);
        scene.add(videoMesh);


        camera.position.z = 2;
        //scene.add(shaderMaterial);

        shaderMaterial.transparent=true;
        const blendings = [ "NoBlending", "NormalBlending", "AdditiveBlending", "SubtractiveBlending", "MultiplyBlending" ];

        shaderMaterial.blending = THREE[blendings[3]];


        const shaderMesh = new THREE.Mesh(new THREE.PlaneGeometry( 2, 2 ), shaderMaterial );
        scene.add(shaderMesh);

        renderer.setClearColor('#000000');
        renderer.setSize(width, height);

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        //this.plane = plane;

        this.mount.appendChild(this.renderer.domElement)
        this.start()
    }

    componentWillUnmount() {
        console.log('UNMOUNTING SCENE');
        this.video.pause();
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
        delete this.video;
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }

    stop() {
        this.video.pause();
        cancelAnimationFrame(this.frameId)
    }

    animate() {

        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate)
    }

    renderScene() {
        this.renderer.render(this.scene, this.camera)
    }

    render() {

        const style = {
            width: window.innerWidth,
            height: window.innerHeight,

        };
        return (
            <div
                style={style}
                ref={(mount) => { this.mount = (mount as HTMLDivElement) }}
            />
        )
    }
}