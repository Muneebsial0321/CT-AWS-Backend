const express = require('express');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { Readable } = require('stream');
const app = express();

const s3 = new S3Client({ region: 'YOUR_REGION' });

app.get('/video', async (req, res) => {
    const range = req.headers.range;
    const bucketName = 'YOUR_BUCKET_NAME';
    const key = 'path/to/your/video.mp4';

    if (!range) {
        res.status(400).send('Requires Range header');
        return;
    }

    const params = {
        Bucket: bucketName,
        Key: key,
    };

    try {
        // Get the file size
        const headCommand = new HeadObjectCommand(params);
        const headResponse = await s3.send(headCommand);
        const fileSize = headResponse.ContentLength;

        // Parse Range
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        if (start >= fileSize) {
            res.status(416).send(`Requested range not satisfiable\n ${start} >= ${fileSize}`);
            return;
        }

        const chunkSize = (end - start) + 1;

        // Set up range request for S3
        const rangeParams = {
            ...params,
            Range: `bytes=${start}-${end}`,
        };

        // Get the video chunk from S3
        const command = new GetObjectCommand(rangeParams);
        const response = await s3.send(command);

        // Set response headers
        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4',
        });

        // Pipe the response body to the client
        const stream = Readable.from(response.Body);
        stream.pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error streaming video');
    }
});

