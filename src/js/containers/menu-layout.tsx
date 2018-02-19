import React from 'react';
import SplitText from '@src/thirdparty/SplitText.min.js';

import './menu-layout.scss';
import {TimelineLite, TweenLite, Back, Elastic} from 'gsap';

interface IProps {
    title: string;
}

interface IState {
}

class MenuLayout extends React.Component<IProps, IState> {


    constructor(props: IProps) {
        super(props);
    }


    componentDidMount() {

    }

    render() {
        const pathToImages = require.context('@assets/images', true, /\.jpg$/);
        const imageUrl = pathToImages('./texture_bg.jpg');

        const text = `
                            From the edges of a new born idea.
                            I'll find a way to
                            get inside.
                            Move on
        `;



        //const video = 'http://localhost/paola/trailer_hd.mp4';
        return (
            <div className="main-wrapper">
                <div className="layers">
                    <img className="layer-background" src={imageUrl}/>
                    <div className="layer">
                        <div className="title">
                            <TitleBox text={text}/>
                        </div>
                        <div className="timeline">

                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

class TitleBox extends React.Component<{ text: string }, {}> {

    protected domRef: HTMLDivElement;
    protected tl: TimelineLite;

    componentDidMount() {
        //console.log('component did mount');
        this.tl = new TimelineLite();
        const mySplitText = new SplitText(this.domRef, {type: "chars"});

        TweenLite.set(this.domRef, {
            css: {
                perspective: 500,
                perspectiveOrigin: "50% 50%",
                transformStyle: "preserve-3d"
            }
        });

        const numChars = mySplitText.chars.length;

        const getRandomInt = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        for (let i = 0; i < numChars; i++) {
            (this.tl as any).from(mySplitText.chars[i], 0.8,
                {
                    css: {
                        y: getRandomInt(-75, 75),
                        x: getRandomInt(-150, 150),
                        rotation: getRandomInt(0, 720),
                        autoAlpha: 0
                    }, ease: Back.easeOut
                }, i * 0.02
                , "dropIn"
            );
        }

        this.tl.staggerTo(mySplitText.chars, 4, {
            css: {
                transformOrigin: "50% 50% -30px",
                rotationY: -360,
                rotationX: 360,
                rotation: 360
            }, ease: Elastic.easeInOut
        }, 0.02, "+=1");


        TweenLite.set(this.domRef, {
            transformPerspective: 600,
            perspective: 300,
            transformStyle: "preserve-3d",
            autoAlpha: 1
        });

        // slowering the thing
        //this.tl.timeScale(0.2);
        this.tl.play();
        //tl.restart();

    }

    render() {
        const lines = this.props.text.split("\n");
        return (
            <div ref={(el: HTMLDivElement) => {
                this.domRef = el
            }}>
                {lines.map((line, idx) => (
                    <React.Fragment key={idx}>
                        <p>{line.trim()}</p>
                    </React.Fragment>

                ))}
            </div>
        )
    }

}

export default MenuLayout;
