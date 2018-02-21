import React from 'react';
import SplitText from '@src/thirdparty/SplitText.min.js';

import {TimelineMax, TweenLite, Back, Elastic, Power2} from 'gsap';
import {Transition} from 'react-transition-group';

export interface ISlideProps {
    text: string;
    image: string;
    texture: string;
    in?: boolean;
}

class Slide extends React.Component<ISlideProps, {}> {
    protected domRef: HTMLDivElement;
    protected tl: TimelineMax;
    protected splitText: {
        chars: string[],
        words: string[],
    };

    componentDidMount() {
        this.tl = new TimelineMax({paused: true});

        // Preset original perspective
        /*
        TweenLite.set(this.domRef, {
            css: {
                perspective: 500,
                perspectiveOrigin: "50% 50%",
                transformStyle: "preserve-3d"
            }
        });
        */

        // todo need to test null
        const textContainer = (this.domRef.querySelector("div[class='headline']") as HTMLDivElement);
        const imgContainer = (this.domRef.querySelector("div[class='image']") as HTMLDivElement);

        TweenLite.set(textContainer, {
            transformPerspective: 600,
            perspective: 300,
            transformStyle: 'preserve-3d',
            autoAlpha: 1,
        });


        TweenLite.set(imgContainer, {
            transformPerspective: 600,
            perspective: 300,
            transformStyle: 'preserve-3d',
            opacity: 0.05,
            //autoAlpha: 1,
            rotationY: 180,
            scale: 5,
        });


        this.splitText = new SplitText(textContainer, {type: 'chars'});

        const numChars = this.splitText.chars.length;

        const getRandomInt = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

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
                        autoAlpha: 0,
                    }, ease: Back.easeOut,
                },
                i * 0.02
            );
        }

        this.tl.add('end_of_group_chars', groupCharsDuration);

        this.tl.to(imgContainer, 3, {

            css: {
                //transformOrigin: '50% 50% -30px',
                scale: 2,
                //rotation: 0,
                rotationY: 0,
                //rotationZ: 0,
                rotation: 360,
                opacity: 1,
                //filter:
            },

            //filter: 'blur(0px}',
            ease: Power2.easeInOut
        }, 0);

        /*
        TweenMax.to(this.domRef, 0.2, {
            textShadow:"0px 0px 15px white",
            color:"none" // IE10 unfortunately hides the shadow too
        });
        */

        this.tl.staggerTo(this.splitText.chars, 3, {
            css: {
                transformOrigin: '50% 50% -30px',
                rotationY: -360,
                rotationX: 360,
                rotation: 360,
            }, ease: Elastic.easeInOut,
        }, 0.02, '+=1');

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
                .timeScale(0.2)
                .eventCallback('onReverseComplete', () => {
                    done();
                    delete this.domRef;
                });
        }
    }

    render() {
        const lines = this.props.text.split('\n');
        const texture = this.props.texture;
        console.log('texture', texture);
        const containerStyle = {
            //backgroundImage: `url(http://localhost:3001${texture})`,
            backgroundImage: 'url(http://i.imgbox.com/Vn8MhWzI.png)',
            //backgroundImage: 'url(http://localhost/paola/lights-17718_960_720.jpg)',
            backgroundSize: "cover",
        };

        const imageStyle = {
            //backgroundBlendMode: 'multiply',
            mixBlendMode: 'color-dodge',//'difference',//'lighten',

        };
        return (
            <Transition
                in={this.props.in}
                timeout={{}} /* hack to set no timeout - we use addEndListener instead */
                mountOnEnter={true}
                unmountOnExit={true}
                addEndListener={this.endListener}
            >
                        <div className="slide" ref={(el: HTMLDivElement) => {
                            this.domRef = el;
                        }}>
                            <div className="headline">
                                {lines.map((line, idx) => (
                                    <React.Fragment key={idx}>
                                        <p>{line.trim()}</p>
                                    </React.Fragment>
                                ))}
                            </div>
                            <div className="image" style={containerStyle}>
                                <img style={imageStyle} className="test" src={this.props.image} />
                            </div>
                        </div>
            </Transition>
        );
    }

}

export default Slide;
