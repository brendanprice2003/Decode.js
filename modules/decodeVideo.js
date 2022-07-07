
import ffmpeg from 'ffmpeg';


let process = new ffmpeg('./video.mp4');

let decodeVideo = async () => {
    process.then(video => {
        video.fnExtractFrameToJPG('./frames/', {
            every_n_frames: 1
        });
    });
};

export { decodeVideo };
