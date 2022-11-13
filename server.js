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

app.post('/render', async (req, res) => {

    const tmpDir = await fs.promises.mkdtemp(path.join(__dirname, 'remotion'));
    const generated_video_name = 'test.mp4';

    const bundled = await bundle(
        path.join(__dirname, './src/uicontainers/remotion/index.tsx')
    );


    const comps = await getCompositions(bundled);

    const video = comps.find((c) => c.id === compositionId);

    if (!video) {
        logger.error(`No video called ${compositionId}`)
        throw new Error(`No video called ${compositionId}`);
    }
    const generatedVideoDir = './generated_video';
    if (!fs.existsSync(generatedVideoDir)) {
        fs.mkdirSync(generatedVideoDir);
    }
    const vidDir = path.join(__dirname, 'generated_video');
    logger.info(`using ${os.cpus().length / 2} threads to render`);

    const onProgress = ({
        renderedFrames,
        encodedDoneIn,
        renderedDoneIn,
        stitchStage,
    }) => {
        if (stitchStage === "encoding") {
            // logger.info("Encoding...");
        } else if (stitchStage === "muxing") {
            // Second pass, adding audio to the video
            showLogForOnce('muxing', `${inputData.overlay_name} - Muxing audio...`);
        }
        currentFrame = renderedFrames;
        // showLogForOnce('rendered', `video ${inputData.overlay_name} - ${renderedFrames} rendered`);

        if (renderedDoneIn !== null) {
            showLogForOnce('renderedIn', `${inputData.overlay_name} Rendered in ${renderedDoneIn}ms`);
        }
        if (encodedDoneIn !== null) {
            showLogForOnce('encodedIn', `${inputData.overlay_name} Encoded in ${encodedDoneIn}ms`);
        }
    };
    const onDownload = (src) => {
        const id = Math.random();
        const download = {
            id,
            name: src,
            progress: 0,
        };
        downloads.push(download);
        showLogForOnce('downloadProgress', `${inputData.overlay_name} progress ${download.progress}%`);
        showLogForOnce('sourceInsideDownload', `${inputData.overlay_name} source ${src}%`);

        return ({ percent }) => {
            showLogForOnce('downloadPercent', `Downloading video: ${inputData.overlay_name} - ${Math.floor(percent * 100)}%`);
        };
    };

    const render = renderMedia({
        composition: {
            durationInFrames: 12999,
            fps: 60,
            height: 1080,
            id: "flowcode",
            width: 1920,
        },
        onStart: ({ frameCount }) => {
            logger.info(`Beginning to render ${frameCount}.`);
        },
        frameRange: [0, inputData.videoInfo.durationInFrames || 1800],
        quality: 100,
        verbose: true,
        chromiumOptions: {
        },
        imageFormat: 'jpeg',
        timeoutInMilliseconds: 1000 * 60 * 5,
        onProgress: (prog) => {
            console.log("frame generated: " + prog.renderedFrames)
        },
        // onProgress,
        // onDownload,
        parallelism: 6,
        codec: "h264",
        crf: 1,
        serveUrl: bundled,
        outputLocation: `${vidDir}/${generated_video_name}`,
        inputProps: { allSequences: req.body.sequenceData },
        disallowParallelEncoding: true
    });

    await render;
})

const server = app.listen(port);

logger.info(`The server has started on http://localhost:${port}!`);
logger.info(`default timeout ${server.timeout}`);