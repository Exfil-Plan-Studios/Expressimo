const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
// Youtube search libraries 
const ytsr = require('ytsr');

//ExpressJS
const express = require('express')
const app = express()
const port = 8001
const cors = require('cors');
const bodyParser = require('body-parser');
const { start } = require('repl');
const { async } = require('regenerator-runtime');

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.post('/api/search', (req, res) => {
    console.log(`Got Body: ${req.body.searchname}`);
    
    const search = async () =>{
        const filters = await ytsr.getFilters(req.body.searchname);
        const filter = filters.get('Type').get('Video');
        await ytsr(filter.url).then((r) => {
            res.json(r);
        });
    }

    search();
});

app.get('/api/play/:videoID', async (req, res) => {
    console.log(req.params.videoID)
    const videoInfo = await ytdl.getInfo(req.params.videoID);

    let audioFormat = ytdl.chooseFormat(videoInfo.formats, {
        filter: "audioonly",
        quality: "highestaudio"
    });

    const {itag, container, contentLength} = audioFormat;

    const rangeHeader = req.headers.range || null;
    const rangePosition = (rangeHeader) ? rangeHeader.replace(/bytes=/, "").split("-") : null
    console.log(`rangePosition: ${rangePosition}`);
    const startRange = rangePosition ? parseInt(rangePosition[0], 10) : 0;
    const endRange = rangePosition && rangePosition[1].length > 0 ? parseInt(rangePosition[1], 10) : contentLength - 1;
    const chunkSize = (endRange - startRange) + 1;

    res.writeHead(206, {
        'Content-Type': `audio/${container}`,
        'Content-Lenght': chunkSize,
        'Content-Range': `bytes ${startRange} - ${endRange} / ${contentLength}`,
        'Accept-Ranges': "bytes"
    });

    const range = {
        start: startRange,
        end: endRange
    };

    const audioStream = ytdl(req.params.videoID, {
        filter: format => format.itag === itag, 
        range
    });
    // console.log(res);
    audioStream.pipe(res);
});

app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
});
