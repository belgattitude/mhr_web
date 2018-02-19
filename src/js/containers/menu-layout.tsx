import React from 'react';
import './menu-layout.scss';

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
        //const video = 'http://localhost/paola/trailer_hd.mp4';
        return (
            <div className="main-wrapper">
                <div className="layers">
                    <img className="layer-background" src={imageUrl} />
                    <div className="layer">
                        <div className="title">
                            <p>
                            From the edges of a new born idea.
                            </p>
                            <p>
                            I'll find a way to
                            get inside.
                            </p>
                            <p>
                            Move on
                            </p>
                        </div>
                        <div className="timeline">

                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default MenuLayout;
