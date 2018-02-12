import React from 'react';
import { Stage, Sprite } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import bunny from "@assets/images/bunny.png";

interface IProps {
}
interface IState {
    scale: number;
}


class PixiContainer extends React.Component<IProps, IState> {

    state: IState = {
        scale: 1
    };


    constructor(props: IProps) {
        super(props);
    }


    handleClick = () => {
        this.setState(state => ({ ...state, scale: state.scale * 1.25 }));
    };

    render() {
        return (
            <Stage width={800} height={600} backgroundColor={0x1099bb}>
                <Bunny
                    // Shows hand cursor
                    buttonMode
                    // Opt-in to interactivity
                    interactive
                    // Pointers normalize touch and mouse
                    pointerdown={this.handleClick}
                    scale={new PIXI.Point(this.state.scale, this.state.scale)}
                    x={400}
                    y={300}
                />
            </Stage>
        );
    }
}

export default PixiContainer;


const centerAnchor = new PIXI.Point(0.5, 0.5);

function BunnyComponent(props) {
    return (
        <Sprite
            anchor={centerAnchor}
            texture={PIXI.Texture.fromImage(bunny)}
            {...props}
        />
    );
}

export const Bunny = BunnyComponent;
