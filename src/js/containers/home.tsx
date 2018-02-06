import React from 'react';
import {getVideos, IVideo} from '@src/config';
import {CubeScene, PlaneScene} from '@src/components/Scene';

interface IProps {
    title: string;
}
interface IState {
    videoIdx: number;
    videos: IVideo[];
}

class Home extends React.Component<IProps, IState> {

    state: IState = {
        videoIdx: 0,
        videos: getVideos(),
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

    }

    render() {

        /*
        const Video = (props: any) => (
            <video id='video' key={props.title} src={props.src} width={300} autoPlay={false} controls={true} />
        );
        */

        //const video = this.state.videos[this.state.videoIdx];
        const video = this.state.videos[1];
        return (
            <div>
                Homepage...
                {/*
                <div>
                    <Video title={video.title} src={video.src} />
                </div>
                */}
                {(true) ?
                    <CubeScene videoSrc={video.src} />
                    :
                    <PlaneScene videoSrc={video.src} />
                }
                <button onClick={this.nextPage}>Next</button>
            </div>
        );
    }
}

export default Home;
