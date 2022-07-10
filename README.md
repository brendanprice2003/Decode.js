# Decode.js

This module enables the user to put a video file in the source directory, extract frames, turn those frames into binary data, then give an interface for the user to access the frames that are in binary form. 

### Steps for reproduction

1. clone this repo
2. put a video in the same directory and rename it to `video.mp4`
3. open CLI in the same directory and run `npm i`
4. run the program by executing `node app.js`

### Documentation

#### Getting Started

When you execute the project, the base URL to access would be `http://127.0.0.1:2000/` (unless you change the port in the code).
Using the endpoints (below), you take the required one and you append it to the end of the base URL with `?`.
`?` tells the web server that everything following it is a URL query parameter.

#### Endpoints

`/probe`: Get metadata from the current video file <br>
`/decode`: Decode & parse the current video file into jpg images <br>
`/compose`: Turn jpg images into base64 and append to a tree structure <br>
`/buffers`: Use `?index=x,y` for range or `?index=x` for single index

#### Good-To-Knows

`/probe`, `/decode` and `/compose` will not return anything as they all serve to trigger server-side functions.
`/buffers` is the only endpoint that interacts with the client in such a way.

Currently, there is no optimal way of knowing those server-side functions are finished executing, nor is there functionality for stacking those query params. If you need to trigger several functions you should make several, seperate, requests to the specific endpoints, As opposed to stacking the endpoints in the same URL. 
