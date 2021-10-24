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
// const vid_url = 'https://www.youtube.com/watch?v=JluWS2Fjyd4'

// const vidReadableStream = ytdl(vid_url, {filter: 'audioonly'});

// ytdl.getInfo(vid_url).then((info) => {
//     const name = info.videoDetails.title;

//     const writableStream = fs.createWriteStream(`${name}.mp3`);
//     const stream = vidReadableStream.pipe(writableStream);

//     stream.on('open', function(){
//         console.log("Opened!");
//     });

//     stream.on('finish', function(){
//         console.log("Download Finished!");
//     })
// })

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

app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
});
