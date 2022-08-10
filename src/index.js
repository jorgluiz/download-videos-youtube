const express = require("express")
const app = express()
const cors = require("cors")
const ytdl = require("ytdl-core")
const HttpsProxyAgent = require('https-proxy-agent');

app.use(cors())

app.get("/", async (req, res, next) => {
    const { url } = req.query

    // Remove 'user:pass@' if you don't need to authenticate to your proxy.
    const proxy = 'http://user:pass@111.111.111.111:8080';
    const agent = HttpsProxyAgent(proxy);
    
    const formato = 0
    if (formato === 137 || formato === 136 || formato === 135 || formato === 134) next()

    let pixel = {
        alta: '',
        media: '',
        baixa: '',
        muito_baixa: ''
    }

    const idvideo = ytdl.getVideoID(url)
    console.log(idvideo)
    const info = await ytdl.getInfo(url)

    info.formats.map(format => {
        if (format.itag === 137) pixel.alta = '1080p'
        if (format.itag === 136) pixel.media = '720p'
        if (format.itag === 135) pixel.baixa = '480p'
        if (format.itag === 134) pixel.muito_baixa = '360p'
    })
    res.send(pixel)
})


app.get("/", async (req, res) => {
    const { url } = req.query
    const formato = '136'

    res.header("Content-Disposition", 'attachment; filename="video.mp4"')

    const info = await ytdl.getInfo(url)
    const format = ytdl.chooseFormat(info.formats, { quality: `${formato}` })
    return ytdl(format).pipe(res)
    // res.send(format)
})

app.listen(3000, () => { console.log('conected') })