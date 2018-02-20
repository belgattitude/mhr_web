import React from 'react';
import Slide from "@src/components/slide";
import {TransitionGroup} from "react-transition-group";
import './menu-layout.scss';

interface IProps {
    title: string;
}

interface IState {
    showSlide: boolean;
    count: number;
}

class MenuLayout extends React.Component<IProps, IState> {

    state = {
        showSlide: false,
        count: 1
    };

    constructor(props: IProps) {
        super(props);
    }


    componentDidMount() {

    }

    protected getPathToImages() {
        return require.context('@assets/images', true, /\.jpg$/);
    }


    render() {
        const pathToImages = this.getPathToImages();
        const imageUrl = pathToImages('./texture_bg.jpg');

        const texts = [
            "From the edges of a new born idea.\nI'll find a way to get inside.",
            "Behind the curtains, under a dress\nA clowny smile on my lips",
            "Forbidden kisses.\nUnder an ocean of salt.\nSpices",
            "On his way to how.\nA clever idea of who we are\ndespite te appearances.",
        ]

        const text = texts[(this.state.count % texts.length)];

        //const video = 'http://localhost/paola/trailer_hd.mp4';

        let elements: JSX.Element[] = [
           /* <FadeEl key="cool" content="Hello" target="1" remove={() => { console.log('remove')}} />*/
        ];

        const images = 'wxqlQkh,G2Whuq3,0bUSEBX'
            .split(',')
            .map(id => `https://i.imgur.com/${id}.jpg`);

        const image = images[this.state.count % 3];

        const newSlide = <Slide text={text} image={image} key={`slide-${this.state.count}`} />;

        //if (this.state.count > 1) {
            elements.push(newSlide);
        //}

        //if (this.state.count % 2 == 0) {
            //elements.push(<Slide text={text} image={image} key={`slide-${this.state.count}`} />);
        //}

        console.log('elements', elements);

        return (
            <div className="main-wrapper">
                <div className="layers">
                    <img className="layer-background" src={imageUrl}/>
                    <div className="layer">

                        <div className="title">
                                <TransitionGroup>
                                    {elements.map(elem => (elem))}
                                </TransitionGroup>
                        </div>
                        <div className="timeline">
                            <button onClick={(e:any) => {
                                this.setState((prevState, props) => (
                                    {...prevState, count: prevState.count + 1}
                                ) )
                            }}>Inc {this.state.count}</button>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}



export default MenuLayout;
