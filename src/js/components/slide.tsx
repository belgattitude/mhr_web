import React from 'react';
import SplitText from '@src/thirdparty/SplitText.min.js';

import {TimelineLite, TweenLite, Back, Elastic} from 'gsap';
import {Transition} from "react-transition-group";

interface ISlideProps {
    text: string,
    image: string,
    in?: boolean
}

class Slide extends React.Component<ISlideProps, {}> {
    protected domRef: HTMLDivElement;
    protected tl: TimelineLite;
    protected splitText: {
        chars: string[],
        words: string[],
    };

    componentDidMount() {
        this.tl = new TimelineLite({paused: true});
        /*
        TweenLite.set(this.domRef, {
            css: {
                perspective: 500,
                perspectiveOrigin: "50% 50%",
                transformStyle: "preserve-3d"
            }
        });
        */

        const textTarget = this.domRef.querySelector("div");
        // todo need to test null
        const imgTarget = (this.domRef.querySelector("img") as HTMLImageElement);

        TweenLite.set(textTarget, {
            transformPerspective: 600,
            perspective: 300,
            transformStyle: "preserve-3d",
            autoAlpha: 1
        });


        this.splitText = new SplitText(textTarget, {type: "chars"});

        const numChars = this.splitText.chars.length;

        const getRandomInt = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        const groupCharsDuration = 0.8;

        for (let i = 0; i < numChars; i++) {
            this.tl.from(
                this.splitText.chars[i],
                groupCharsDuration,
                {
                    css: {
                        y: getRandomInt(-75, 75),
                        x: getRandomInt(-150, 150),
                        rotation: getRandomInt(0, 720),
                        autoAlpha: 0
                    }, ease: Back.easeOut
                },
                i * 0.02
            );
        }

        this.tl.add('end_of_group_chars', groupCharsDuration);

        this.tl.from(imgTarget, 3, {
            css: {
                //scale: 5,
                //rotation: 0,
                opacity: 0
                //filter:
            },
            filter:"blur(0px}",
            //ease: Back.easeInOut
        }, 0)

        /*
        TweenMax.to(this.domRef, 0.2, {
            textShadow:"0px 0px 15px white",
            color:"none" // IE10 unfortunately hides the shadow too
        });
        */

        this.tl.staggerTo(this.splitText.chars, 3, {
            css: {
                transformOrigin: "50% 50% -30px",
                rotationY: -360,
                rotationX: 360,
                rotation: 360
            }, ease: Elastic.easeInOut
        }, 0.02, "+=1");

    }

    componentWillUnmount() {
        // console.log('component will unmount');
    }

    endListener = (node: HTMLElement, done: () => void) => {
        if (this.props.in) {
            this.tl.play(0).eventCallback('onComplete', () => {
                done();
            });
        } else {
            this.tl.reverse('end_of_group_chars')
                .timeScale(1.5)
                .eventCallback('onReverseComplete', () => {
                    done();
                    delete this.domRef;
                });
        }
    }

    render() {
        const lines = this.props.text.split("\n");

        return (
            <Transition
                in={this.props.in}
                timeout={2000}
                mountOnEnter={true}
                unmountOnExit={true}
                addEndListener={this.endListener}
            >
                        <div ref={(el: HTMLDivElement) => {
                            this.domRef = el
                        }}>
                            <div>
                                {lines.map((line, idx) => (
                                    <React.Fragment key={idx}>
                                        <p>{line.trim()}</p>
                                    </React.Fragment>
                                ))}
                            </div>
                            <img className="test" src={this.props.image} />
                        </div>
            </Transition>
        )
    }

}

export default Slide;