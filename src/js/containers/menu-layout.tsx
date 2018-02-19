import React from 'react';
import SplitText from '@src/thirdparty/SplitText.min.js';

import './menu-layout.scss';
import {TimelineLite, TweenLite, Back, Elastic, Power2} from 'gsap';
import {Transition, TransitionGroup} from "react-transition-group";


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

    toggleSlide(e: any) {

        this.setState((prevState, props) => {
            return {...prevState, showSlide: !prevState.showSlide};
        });

    }

    protected getPathToImages() {
        return require.context('@assets/images', true, /\.jpg$/);
    }



    render() {
        const pathToImages = this.getPathToImages();
        const imageUrl = pathToImages('./texture_bg.jpg');

        const text = `
                            From the edges of a new born idea.
                            I'll find a way to
                            get inside.
                            Move on
        `;

        //const video = 'http://localhost/paola/trailer_hd.mp4';
        const showSlide = this.state.showSlide;

        const elements = [
            <FadeEl key="cool" content="Hello" target="1" remove={() => { console.log('remove')}} />
        ];

        const images = 'wxqlQkh,G2Whuq3,0bUSEBX'
            .split(',')
            .map(id => `https://i.imgur.com/${id}.jpg`);

        const image = images[this.state.count % 3];


        if (this.state.count % 2 == 0) {
            elements.push(<Slide text={text} image={image} key={`slide-${this.state.count}`} />);
        }


        return (
            <div className="main-wrapper">
                <div className="layers">
                    <img className="layer-background" src={imageUrl}/>
                    <div className="layer">

                        <div className="title">
                            {(showSlide) ?
                                <TransitionGroup>
                                    {elements.map(elem => (elem))}
                                </TransitionGroup>
                                :
                                <TitleBox text={text}/>

                            }
                        </div>


                        <div className="timeline">
                            <button onClick={(e:any) => {this.toggleSlide(e);}}>Cool</button>
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


/*
const defaultStyle = {
    opacity: 1,
    transform: "translate(300px, 0)"
};*/


class Slide extends React.Component<{ text: string, image: string, in?: boolean }, {}> {

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

        TweenLite.set(this.domRef, {
            transformPerspective: 600,
            perspective: 300,
            transformStyle: "preserve-3d",
            autoAlpha: 1
        });


        this.splitText = new SplitText(this.domRef, {type: "chars"});

        const numChars = this.splitText.chars.length;

        const getRandomInt = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        for (let i = 0; i < numChars; i++) {
            (this.tl as any).from(this.splitText.chars[i], 0.8,
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
        console.log('component will unmount');
    }

    endListener = (node: HTMLElement, done: () => void) => {
        console.log('endListener', this.props.in);
        if (this.props.in) {
            this.tl.play(0).eventCallback('onComplete', () => {
                console.log('starting', 'onComplete')
                done();
            });
        } else {
            this.tl.reverse(0.8)
                .timeScale(1.5)
                .eventCallback('onReverseComplete', () => {
                    console.log('removing', 'onReverseComplete')
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
              {state => {
                  return (
                      <div ref={(el: HTMLDivElement) => {
                          this.domRef = el
                      }}>
                          {lines.map((line, idx) => (
                              <React.Fragment key={idx}>
                                  <p>{line.trim()}</p>
                              </React.Fragment>
                          ))}
                          <img className="test" src={this.props.image} />
                      </div>
                  )
              }
              }
          </Transition>
        )
    }

}


export class FadeEl extends React.Component<{in?: boolean, content: any, target: any, remove: any}, {}> {
    constructor(props) {
        super(props);
    }

    render() {
        //const { content, target, remove } = this.props;
        const duration=2000;
        return (
            <Transition
                in={this.props.in}
                timeout={duration}
                mountOnEnter={true}
                unmountOnExit={true}
                addEndListener={(n, done) => {
                    TweenLite.to(n, 1, { opacity: 1, x: 0 });
                    if (this.props.in) {
                        TweenLite.to(n, 1, {
                            opacity: 1,
                            x: +100,
                            ease: Power2.easeOut,
                            onComplete: done });
                    } else {
                        TweenLite.to(n, 1, {
                            opacity: 0,
                            x: -100,
                            ease: Power2.easeOut,
                            onComplete: done
                        });
                    }
                }}
            >
                <FadeComponent {...this.props} />
            </Transition>
        );
    }
}


class FadeComponent extends React.Component<any,any> {
    componentDidMount() {
        TweenLite.to(this.refs.targetEl, 0.5, {
            opacity: 1,
            x: 0,
            delay: 0.2 * this.props.target
        });
    }
    render() {
        const { content, target, remove } = this.props;
        return (
            <div
                className="card my-element"
                ref="targetEl"
                style={{ marginTop: "10px" }}
            >
                <div className="card-block">
                    {content}
                    <button
                        className="btn btn-danger float-right"
                        onClick={() => remove(target)}
                    >
                        Delete
                    </button>
                </div>
            </div>
        );
    }
}

export default MenuLayout;
