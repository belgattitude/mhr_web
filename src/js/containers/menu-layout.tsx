import React from 'react';
import Slide from '@src/components/slide';
import {TransitionGroup} from 'react-transition-group';
import './menu-layout.scss';
import {throttle} from "lodash-es";

interface IProps {
    title: string;
}

interface IState {
    count: number;
    inTransition: boolean;
}

class MenuLayout extends React.Component<IProps, IState> {

    state = {
        count: 1,
        inTransition: false,
    };

    constructor(props: IProps) {
        super(props);
        this.handleWheel = throttle(this.handleWheel.bind(this), 5000, {
            leading: false,
            trailing: false,
        });

    }

    componentDidMount() {
    }

    protected getPathToImages() {
        return require.context('@assets/images', true, /\.jpg$/);
    }

    handleWheel(e: React.WheelEvent<HTMLDivElement>): void {


        e.preventDefault();

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
            } else if (e.deltaY < 0) {
                // Down
                direction = Direction.Down;
            }
        }

        console.log('direction', direction);
        console.log('wheelDelta', (e.nativeEvent as WheelEvent).wheelDelta);
        console.log('wheelEvent', e.nativeEvent);
        console.log('wheelEvent currentTarget', e.currentTarget);
        console.log('wheelEvent relatedTarget', e.relatedTarget);


        this.setState((prevState, props) => (
            {...prevState, count: prevState.count + 1}
        ) );
    }


    render() {
        const pathToImages = this.getPathToImages();
        const textureUrl = pathToImages('./texture_bg.jpg');

        const texts = [
            'From the edges of a new born idea.\nI\'ll find a way to get inside.',
            'Behind the curtains, under a dress\nA clowny smile on my lips',
            'Forbidden kisses.\nUnder an ocean of salt.\nSpices',
            'On his way to how.\nA clever idea of who we are\ndespite te appearances.',
        ];

        const text = texts[(this.state.count % texts.length)];

        //const video = 'http://localhost/paola/trailer_hd.mp4';

        const elements: JSX.Element[] = [
           /* <FadeEl key="cool" content="Hello" target="1" remove={() => { console.log('remove')}} />*/
        ];

        const images = 'wxqlQkh,G2Whuq3,0bUSEBX'
            .split(',')
            .map(id => `https://i.imgur.com/${id}.jpg`);

        const image = images[this.state.count % 3];

        const newSlide = <Slide text={text}
                                image={image}
                                texture={textureUrl}
                                key={`slide-${this.state.count}`}
                         />;

        elements.push(newSlide);

        return (
            <div className="main-wrapper" onWheel={e => { e.persist(); this.handleWheel(e)}}>
                <div className="layers">
                    <img className="layer-background" src={textureUrl}/>
                    <div className="layer">

                        <div className="title">
                                <TransitionGroup>
                                    {elements.map(elem => (elem))}
                                </TransitionGroup>
                        </div>
                        <div className="timeline">
                            <button onClick={(e: any) => {
                                this.setState((prevState, props) => (
                                    {...prevState, count: prevState.count + 1}
                                ) );
                            }}>Inc {this.state.count}</button>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default MenuLayout;
