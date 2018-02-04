import React from 'react';
import * as THREE from 'three';
import {Mesh, PerspectiveCamera, Scene, WebGLRenderer} from "three";


export interface ITestSceneState {
    width: number;
    height: number;
    videoSrc?: string;
}

export interface ITestSceneProps {
    videoSrc: string;
}

export class TestScene extends React.Component<ITestSceneProps, ITestSceneState> {

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
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        //const geometry = new THREE.PlaneGeometry(1, 1);

        const videoSrc = this.state.videoSrc as string;
        this.video = this.createVideoElement(videoSrc);
        const texture = new THREE.VideoTexture( this.video );
        texture.minFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;

        const material = new THREE.MeshBasicMaterial({
            //color: 0xffffff,
            map: texture
        });
        const cube = new THREE.Mesh(geometry, material);

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