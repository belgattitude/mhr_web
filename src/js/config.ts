/*
const video1mp4 = require('@public/videos/paola1.mp4');
const video2mp4 = require('@public/videos/paola2.mp4');
const video3mp4 = require('@public/videos/paola3.mp4');
*/
const localUrl = 'http://localhost/paola';
const video1mp4 = `${localUrl}/s_paola1.mp4`;
const video2mp4 = `${localUrl}/s_paola2.mp4`;;
const video3mp4 = `${localUrl}/s_paola3.mp4`;;



export interface IVideo  {
    src: any,
    title: string,
}

export function getVideos(): IVideo[] {
    return [
        { src: video1mp4, title: 'paola1'},
        { src: video2mp4, title: 'paola2'},
        { src: video3mp4, title: 'paola3'},
    ];
}
