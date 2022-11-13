require('dotenv').config();
const express = require('express');
const os = require('os');
const cors = require('cors');
const winston = require('winston');
const { bundle } = require('@remotion/bundler');
const {
    getCompositions,
    renderMedia
} = require('@remotion/renderer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));
const port = process.env.PORT || 4004;

const logger = winston.createLogger({
    exitOnError: false,
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.json(),
    ),
    level: 'http',
    transports: [
        new winston.transports.Console({ handleExceptions: true, handleRejections: true })
    ],
});

logger.info(`threads: ${os.cpus().length}`);

app.use((req, res, next) => {
    logger.http(`request ${req.method}:${req.url}`, { url: req.url, method: req.method })
    next();
});

app.post('/render', async () => {
    const generated_video_name = 'test.mp4';

    const bundled = await bundle(
        path.join(__dirname, './src/remotion/index.tsx')
    );

    logger.info(`bundled: ${bundled}`);

    await getCompositions(bundled);

    const video = 'HelloWorld';

    if (!video) {
        logger.error(`No video called ${compositionId}`)
        throw new Error(`No video called ${compositionId}`);
    }
    const generatedVideoDir = './generated_video';
    if (!fs.existsSync(generatedVideoDir)) {
        fs.mkdirSync(generatedVideoDir);
    }
    const vidDir = path.join(__dirname, 'generated_video');

    try {
        await renderMedia({
            composition: {
                durationInFrames: 12999,
                fps: 60,
                height: 1080,
                id: "HelloWorld",
                width: 1920,
            },
            onStart: ({ frameCount }) => {
                logger.info(`Beginning to render ${frameCount}.`);
            },
            frameRange: [0, 12998],
            quality: 100,
            verbose: true,
            chromiumOptions: {
            },
            imageFormat: 'jpeg',
            timeoutInMilliseconds: 1000 * 60 * 5,
            onProgress: (prog) => {
                console.log("frame generated: " + prog.renderedFrames)
            },
            concurrency: 6,
            codec: "h264",
            crf: 1,
            serveUrl: bundled,
            outputLocation: 'video.mp4',
            disallowParallelEncoding: true
        });
    } catch (e) {
        logger.error(e);
        throw e;
    }
})

const server = app.listen(port);

logger.info(`The server has started on http://localhost:${port}!`);
logger.info(`default timeout ${server.timeout}`);