
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


let __filename = fileURLToPath(import.meta.url),
    __dirname = path.dirname(__filename);

let composeBuffer = async (totalFrames) => {
    let frameArray = new Array(totalFrames);
    for (let i=1; i<=totalFrames; i++) {
        let file = fs.readFileSync(path.join(__dirname, `../frames/video_${i}.jpg`));
        frameArray.push(Buffer.from(file).toString('base64'));
    };
    return frameArray;
};

export { composeBuffer };
