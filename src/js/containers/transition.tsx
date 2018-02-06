import React from 'react';
import { LinearCopy } from "gl-react";
import { Surface } from "gl-react-dom";
import GLTransition from "react-gl-transition";
import GLTransitions from "gl-transitions";


interface ITranstionProps {
    medias: string[];
}

interface ITransitionState {
    index: number;
    progress: number;
}

class Transition extends React.Component<ITranstionProps, ITransitionState> {

    state: ITransitionState = {
        index: 1,
        progress: 0.0
    };

    requestAnimationFrame?: number;

    constructor(props: ITranstionProps) {
        super(props);
    }

    componentDidMount() {
        setInterval(() => {
            this.setState((prevState, props) => {
                return {
                    ...prevState,
                    index: (prevState.index + 1) % props.medias.length
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
        const slides = this.props.medias;

        const from = slides[index % slides.length];
        const to = slides[(index + 1) % slides.length];
        //const transition = GLTransitions[index % GLTransitions.length];
        const transition = GLTransitions[8];

        return(
            <div>
                <Surface width={600} height={400}>
                    { progress > 0  ?
                     <GLTransition
                        from={from}
                        to={to}
                        progress={progress}
                        transition={transition}
                     />
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

