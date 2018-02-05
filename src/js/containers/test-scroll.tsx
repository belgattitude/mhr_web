import React from 'react';
import {getVideos, IVideo} from '@src/config';
import './test-scroll.scss';

interface IProps {
    title: string;
}
interface IState {
    videoIdx: number;
    messageIdx: number;
    videos: IVideo[];
}

class TestScroll extends React.Component<IProps, IState> {

    state: IState = {
        videoIdx: 0,
        messageIdx: 0,
        videos: getVideos(),
    };

    private messages: string[] = ['Step One', 'Step two', '33333333333333333333333333"', '44444444444444444444444444444444444'];

    constructor(props: IProps) {
        super(props);

    }

    handleWheel(e: React.WheelEvent<HTMLDivElement>): boolean {

        enum Direction {Up, Down, Right, Left, Unknown}
        let direction: Direction = Direction.Unknown;

        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            if (e.deltaX > 0) {
                direction = Direction.Left;
            } else if (e.deltaX < 0) {
                direction = Direction.Right;
            }
        } else {
            if (e.deltaY > 0) {
                // Up
                direction = Direction.Up;
                this.setActiveMessage(Math.abs((this.state.messageIdx + 1) % this.messages.length));
            } else if (e.deltaY < 0) {
                // Down
                direction = Direction.Down;
                this.setActiveMessage(Math.abs((this.state.messageIdx - 1) % this.messages.length));
            }
        }
        console.log('direction', Direction[direction]);

        console.log('e', e.deltaX);
        console.log('e', e.deltaY);

/*
        this.interval = window.setInterval(
            () => this.setState(prevState => ({ count: prevState.count + 1 })),
            200,
        );
  */

        return false;
    }

    nextPage = (e: any): void => {
        this.setState((previousState: IState) => {
            const videoIdx = (previousState.videoIdx + 1) % previousState.videos.length;
            return { ... previousState, videoIdx: videoIdx};
        });
    }

    private setActiveMessage(messageIdx: number): void {

        console.log('idx', messageIdx);
        this.setState((prev: IState) => ({...prev, messageIdx: messageIdx}));

    }

    componentDidMount() {

    }

    render() {

        const msg = this.messages[this.state.messageIdx];
        return (
            <div className="scroll-ctn" onWheel={e => this.handleWheel(e)}>
                <div className="message">{msg}AAAAA</div>
            </div>

        );
    }
}

export default TestScroll;
