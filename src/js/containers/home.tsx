import React from 'react';
import {getVideos, IVideo} from '@src/config';
import {TestScene} from "@src/components/Scene";


interface IProps {
    title: string;
}
interface IState {
    videoIdx: number,
    videos: IVideo[]
}


class Home extends React.Component<IProps, IState> {

    state: IState = {
        videoIdx: 0,
        videos: getVideos()
    };

    constructor(props: IProps) {
        super(props);
    }

    nextPage = (e: any): void => {
        this.setState((previousState: IState) => {
            const videoIdx = (previousState.videoIdx + 1) % previousState.videos.length;
            return { ... previousState, videoIdx: videoIdx};
        });
    }


    componentDidMount() {
        /*
        var video = document.getElementById('video');
        var texture = new THREE.VideoTexture(video);
        texture.needsUpdate;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;
        texture.crossOrigin = 'anonymous';

        var imageObject = new THREE.Mesh(
            new THREE.PlaneGeometry(600, 400),
            new THREE.MeshBasicMaterial({ map: texture }),);

        scene.add( imageObject );
        */
    }

    render() {

        const Video = (props: any) => (
            <video id='video' key={props.title} src={props.src} width={300} autoPlay={false} controls={true} />
        );

        const video = this.state.videos[this.state.videoIdx];
        return (
            <div>
                Homepage
                <div>
                    <Video title={video.title} src={video.src} />
                </div>
                <TestScene/>
                <button onClick={this.nextPage}>Next</button>
            </div>
        );
    }
}

export default Home;
