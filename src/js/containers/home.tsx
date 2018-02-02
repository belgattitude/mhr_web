import React from 'react';
import { getVideos } from '@src/config';
class Home extends React.Component<{}, {}> {

    render() {

        const videos = getVideos();

        return (
            <div>
                Homepage
                <div>
                    {videos.map(({src, title}) => (
                        <video key={title} src={src} width={300} autoPlay={false} controls={true} />
                    ))}
                </div>
            </div>
        );
    }
}
export default Home;
