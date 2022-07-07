
import http from 'http';
import express from 'express';
import ffprobe from 'ffprobe';
import ffprobestatic from 'ffprobe-static';
import { decodeVideo } from './modules/decodeVideo.js';
import { composeBuffer } from './modules/composeBuffer.js';


let app = express(),
    log = console.log.bind(console),
    httpServer = http.createServer(app);

let totalFrames = 0,
    metadata;


// Probe video to get metadata
ffprobe('./video.mp4', { path: ffprobestatic.path }, (err, info) => {
    if (err) return err;
    totalFrames = info.streams[0].nb_frames;
    metadata = info.streams[0];
});


// Make a new array with a set size as the total frames of the video
let frameBuffers = [];


// Respond with probe contents
app.get('/probe', (req, res) => {
    res.send(metadata);
});


// Extract frames from the input video
app.get('/decode', async (req, res) => {
    await decodeVideo();
});


// Compose base64 strings into a tree structure for http transfer
app.get('/compose', async (req, res) => {
    await composeBuffer(totalFrames)
        .then(buffers => {
            frameBuffers = buffers;
        });
});


// Catch the request for a specific range/index of frame buffers
app.get('/buffers', (req, res) => {

    let query,
        content;

    if ((req.url).split('?')) {
        query = (req.url).split('?');
        if (query[1]) content = query[1].split('=');
    };

    if (query & content) {
        if (content[0] !== 'index') res.send('Invalid query parameter');
        if (content[0] === 'index') {
            
            if (parseInt(content[1])) {
    
                if (content[1].includes(',')) {
    
                    // Range of indexes
                    let range = (content[1]).split(','),
                        arrayOfRanges = [];
    
                    for (let i=parseInt(range[0]); i<parseInt(range[1])+1; i++) {
                        arrayOfRanges.push(frameBuffers[i]);
                    };
                    res.send(arrayOfRanges);
                }
                else {
    
                    // Single index
                    let index = content[1];
                    res.send(frameBuffers[index]);
                };
            };
        };
    }
    else {
        res.redirect('*');
    };
});


// My *brilliant* error handling
app.get('*', (req, res) => {

    // Send error in parent (will not yield an error unless manually checked)
    let errorArray = {
        'ERROR': `Endpoint/query params are incorrect. Read below for endpoints & their info`,
        '/probe': 'Get metadata from the current video file',
        '/decode': 'Decode & parse the current video file into jpg images',
        '/compose': 'Turn jpg images into base64 and append to a tree structure',
        '/buffers': 'Use ?index=x,y for range or ?index=x for single index'
    };
    res.send(errorArray);
});

httpServer.listen(2000);
