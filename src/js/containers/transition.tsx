import React from 'react';
import { LinearCopy } from "gl-react";
import { Surface } from "gl-react-dom";
import GLTransition from "react-gl-transition";
import GLTransitions from "gl-transitions";
import {getVideos} from "@src/config";

interface ITranstionProps {

}

interface ITransitionState {
    index: number;
    progress: number;
}

class Transition extends React.Component<ITranstionProps, ITransitionState> {

    state: ITransitionState = {
        index: 1,
        progress: 0.0,
    };

    images: any[];

    requestAnimationFrame?: number;

    constructor(props: ITranstionProps) {
        super(props);

        this.images = "wxqlQkh,G2Whuq3,0bUSEBX"
            .split(",")
            .map(id => `https://i.imgur.com/${id}.jpg`);

        getVideos().map(({src})  => {
            let video = document.createElement('video');
            video.src = src;
            video.autoplay = false;
            video.muted = true;
            video.loop = true;
            video.crossOrigin = "anonymous";
            this.images.push(video);
        })


    }

    componentDidMount() {
        setInterval(() => {
            this.setState((prevState, props) => {
                return {
                    ...prevState,
                    index: (prevState.index + 1) % this.images.length
                }
            })
        }, 4000);

        setInterval(() => {
            this.setState((prevState, props) => {
                return {
                    ...prevState,
                    progress: (prevState.progress >= 0.9) ? 0 : (prevState.progress + 0.001)
                }
            })
        }, 10);

    }


    render() {

        const index = this.state.index;
        const progress = this.state.progress;
        const slides = this.images;

        const from = slides[index % slides.length];
        const to = slides[(index + 1) % slides.length];
        //const transition = GLTransitions[index % GLTransitions.length];
        const transition = GLTransitions[8];

        const width=600;
        const height=400;

        return(
            <div>
                <Surface width={width} height={height}>
                    { progress > 0  ?
                     <GLTransition
                        from={from}
                        to={to}
                        progress={progress}
                        transition={transition}
                     >
                     </GLTransition>
                     :
                     <LinearCopy>{from}</LinearCopy>
                    }
                </Surface>

            </div>
        );
    }
}

/*
const Slideshow = ({ slides, delay, duration, time }) => {
    const index = Math.floor(time / (delay + duration));
    const from = slides[index % slides.length];
    const to = slides[(index + 1) % slides.length];
    const transition = GLTransitions[index % GLTransitions.length];
    const total = delay + duration;
    const progress = (time - index * total - delay) / duration;
    return progress > 0
        ? <GLTransition
            from={from}
            to={to}
            progress={progress}
            transition={transition}
        />
        : <LinearCopy>{from}</LinearCopy>;
});
*/
export default Transition;

