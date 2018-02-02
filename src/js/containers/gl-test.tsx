import React from "react";
import { Uniform, LinearCopy, Shaders, GLSL, Node } from "gl-react";
import { Surface } from "gl-react-dom";
// import GLTransition from "react-gl-transition";

interface IVideoProps {
    onFrame: any,
    autoPlay?: boolean,
    loop?: boolean
}
// We implement a component <Video> that is like <video>
// but provides a onFrame hook so we can efficiently only render
// if when it effectively changes.
class Video extends React.Component<IVideoProps, {}> {

    _raf: number;
    currentTime: number;

    videoRef = () => { return this.refs.video as HTMLVideoElement };

    constructor(props: IVideoProps) {
        super(props);
        this._raf = 0;
        this.currentTime = 0;
    }

    componentDidMount() {
        const loop = () => {
            this._raf = requestAnimationFrame(loop);
            const video  = this.videoRef();
            if (!video) return;
            const currentTime = video.currentTime;
            // Optimization that only call onFrame if time changes
            if (currentTime !== this.currentTime) {
                this.currentTime = currentTime;
                this.props.onFrame(currentTime);
            }
        };
        this._raf = requestAnimationFrame(loop);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this._raf);
    }

    render() {
        const { onFrame, ...rest } = this.props;
        return <video {...rest} ref="video" />;
    }
}

// Our example will simply split R G B channels of the video.
const shaders = Shaders.create({

    Persistence: {
        frag: GLSL`
precision highp float;
varying vec2 uv;
uniform sampler2D t, back;
uniform float persistence;
void main () {
  gl_FragColor = vec4(mix(
    texture2D(t, uv),
    texture2D(back, uv+vec2(0.0, 0.005)),
    persistence
  ).rgb, 1.0);
}`
    },


    SplitColor: {
        frag: GLSL`
precision highp float;
varying vec2 uv;
uniform sampler2D children;
void main() {
  vec4 c = texture2D(children, uv);
  gl_FragColor = vec4(uv.x, c.y, 0.5, 0.5);
}`
  /*
        frag: GLSL`
precision highp float;
varying vec2 uv;
uniform sampler2D children;
void main () {
  float y = uv.y * 2.0;
  vec4 c = texture2D(children, vec2(uv.x, mod(y, 1.0)));
  gl_FragColor = vec4(
    c.r * step(2.0, y) * step(y, 3.0),
    c.g * step(1.0, y) * step(y, 2.0),
    c.b * step(0.0, y) * step(y, 1.0),
    1.0);
}`*/
    }
    //^NB perf: in fragment shader paradigm, we want to avoid code branch (if / for)
    // and prefer use of built-in functions and just giving the GPU some computating.
    // step(a,b) is an alternative to do if(): returns 1.0 if a<b, 0.0 otherwise.
});



const SplitColor = (props: any) => {
    const children = props.children;
    return (
        <Node shader={shaders.SplitColor} uniforms={{ children }} />
    );
}

const Persistence = ({ children: t, persistence }: any) => (
    <Node
        shader={shaders.Persistence}
        backbuffering
        uniforms={{ t, back: Uniform.Backbuffer, persistence }}
    />
);

// We now uses <Video> in our GL graph.
// The texture we give to <SplitColor> is a (redraw)=><Video> function.
// redraw is passed to Video onFrame event and Node gets redraw each video frame.
const GLTest = () => {

    const video1 = 'file:///home/sebastien/Videos/paola-bw.mp4';
    const video2 = 'file:///home/sebastien/Videos/MVI_0291.m4v';
    const width = window.innerWidth;
    return (
        <div>
        <Surface width={width} height={630} pixelRatio={1}>
            <SplitColor>
                {(redraw: any) => (
                    <Video onFrame={redraw} autoPlay loop>
                        <source type="video/mp4" src={video2} />
                    </Video>
                )}
            </SplitColor>
        </Surface>
        <Surface width={width} height={630} pixelRatio={1}>
            {/*
            <GLTransition
                onConnectSizeComponentRef={() => { return }}
                transition={transition}
                transitionParams={transitionParams}
                from={from}
                to={to}
                progress={progress}
            />
            */}
            <LinearCopy>
                <Persistence persistence={0.8}>
                    {(redraw: any) => (
                        <Video onFrame={redraw} autoPlay loop>
                            <source type="video/mp4" src={video1} />
                        </Video>
                    )}
                </Persistence>
            </LinearCopy>
        </Surface>
        </div>
    )
};

export default GLTest;

