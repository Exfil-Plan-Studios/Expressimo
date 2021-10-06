const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');

const vid_url = 'https://www.youtube.com/watch?v=JluWS2Fjyd4'

const vidReadableStream = ytdl(vid_url, {filter: 'audioonly'});

ytdl.getInfo(vid_url).then((info) => {
    const name = info.videoDetails.title;

    const writableStream = fs.createWriteStream(`${name}.mp3`);
    const stream = vidReadableStream.pipe(writableStream);

    stream.on('open', function(){
        console.log("Opened!");
    });

    stream.on('finish', function(){
        console.log("Download Finished!");
    })
})
