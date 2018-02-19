import React from 'react';
import {getVideos, IVideo} from '@src/config';
import './test-scroll.scss';
import {TweenMax,  TimelineMax, Elastic, Back} from 'gsap';
import throttle from 'lodash/throttle';
//const SplitText = require('@src/thirdparty/SplitText.min');
import SplitText from '@src/thirdparty/SplitText.min.js';

//import TimelineMax = gsap.TimelineMax;

interface IProps {
    title: string;
}
interface IState {
    videoIdx: number;
    messageIdx: number;
    videos: IVideo[];
}

const messages = ['Step One', 'Step two', '33333333333333333333333333"', '44444444444444444444444444444444444'];

class TestScroll extends React.Component<IProps, IState> {

    state: IState = {
        videoIdx: 0,
        messageIdx: 0,
        videos: getVideos(),
    };

    private messages: string[] = messages;

    constructor(props: IProps) {
        super(props);
    }

    protected onMouseMove: any;

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

        console.log('direction', direction);

        /*
        console.log('direction', Direction[direction]);

        console.log('e', e.deltaX);
        console.log('e', e.deltaY);
        */

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

        this.handleMouseMove = throttle(this.handleMouseMove.bind(this), 50, {
            leading: true,
        });

    }

    handleMouseMove(e: React.MouseEvent<HTMLDivElement>): void {
        const wrap = e.currentTarget as HTMLDivElement;
        if (wrap === null) { return; }
        const w = wrap.offsetWidth;
        const h = wrap.offsetHeight;

        const center = w / 2;
        const middle = h / 2;

        //let x = e.nativeEvent.offsetX; // (e.clientX - wrap.offsetLeft)
        //console.log('equals', e.clientX - wrap.offsetLeft, x);
        //let y = e.nativeEvent.offsetY;
        let x = e.clientX - wrap.offsetLeft;
        let y = e.clientY - wrap.offsetTop;

        const gradientX = 1 - (x / w);
        const gradientY = 1 - (y / h);

        if (x < center) {
            x = 1 - (x / center);
            x = -x;
        } else {
            x = (x - center) / center;
        }

        if (y < middle) {
            y = 1 - (y / middle);
            y = -y;
        } else {
            y = (y - middle) / middle;
        }

        const root = wrap.parentElement as HTMLDivElement;

        root.style.setProperty('--mouse-x', (x).toString());
        root.style.setProperty('--mouse-y', (y).toString());

        root.style.setProperty('--mouse-x-px', (x).toString() + 'px');
        root.style.setProperty('--mouse-y-px', (y).toString() + 'px');

        root.style.setProperty('--gradient-x', gradientX.toString());
        root.style.setProperty('--gradient-y', gradientY.toString());
    }

    render() {

        const msg = this.messages[this.state.messageIdx];

        const Box = () => (<BoxMessage text={msg} />);

        return (
            <div className="scroll-ctn"
                 onWheel={e => this.handleWheel(e)}

                 onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
                     e.persist();
                     this.handleMouseMove(e);
                 }}

            >
                <div className="video-ctn">
                    <div className="wrap" >
                        {/*<div className="play"></div>*/}
                        <div className="gradient"></div>
                    </div>
                </div>
                <div className="message">{msg}AAAAA</div>
                <Box />

            </div>

        );
    }
}

interface IBoxMessageAnimation {
    duration: number;
}

export class BoxMessageAnimation {

    protected duration: number;

    constructor(props: IBoxMessageAnimation) {
        this.duration = props.duration;
    }

    show(target: HTMLElement, callBack?: () => {}) {
        const targetId = target;
        const tl = new TimelineMax,
            mySplitText = new SplitText(targetId, {type: 'words,chars'}),
            chars = mySplitText.words; //an array of all the divs that wrap each character

        TweenMax.set(targetId, {perspective: 400});

        tl.staggerFrom(chars, 1.6, {
            opacity: 0,
            scale: '20%',
            y: 80,
            //x: -1500,
            rotationX: 180,
            transformOrigin: '0% 50% 0',
            ease: Back.easeOut,
        }, 0.05, '+=0');



        /*
        TweenMax.to(targetId, 1.6,
            {
                x:0,
                y:0,
                scaleY:1,
                ease:Back.easeInOut
            }
        );
        */
    }

    hide(target: HTMLElement, callBack?: () => {}) {
        TweenMax.from(target, this.duration, {
            opacity: 0,
            height: 0,
            onComplete() {
                if (callBack !== undefined) { callBack(); }
            },
            ease: Elastic.easeOut.config(0.25, 1),
        });
    }

}

interface IBoxMessage {
    text: string;
}
export class BoxMessage extends React.Component<IBoxMessage, {}> {

    animation: BoxMessageAnimation;

    getDomRoot = () => { return this.refs.domRoot as HTMLDivElement; };

    constructor(props) {
        super(props);
        this.animation = new BoxMessageAnimation({duration: 0.5});
    }

    componentDidMount() {
        this.animation.show(this.getDomRoot());
    }

    componentWillEnter(cb) {
        alert('WILLENTER');
        this.animation.show(this.getDomRoot(), cb);
    }

    componentWillLeave(cb) {
        alert('WILLLEAVE');
        this.animation.hide(this.getDomRoot(), cb);
    }

    public render() {

        const text = this.props.text;

        return (
            <div ref="domRoot">
                <div style={{border: '1px solid black', fontSize: '44px', margin: '60px'}}>
                    <div style={{borderBottom: '1px solid black'}}>
                        Header
                    </div>
                    <div style={{fontSize: '22px'}}>
                        {text}
                    </div>
                </div>
            </div>
        );
    }

}

export default TestScroll;
