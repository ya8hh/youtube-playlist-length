const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

app.post('/getPlaylistDuration', async (req, res) => {
    const { playlistId } = req.body;

    try {
        let totalDuration = 0;
        let videoCount = 0;
        let nextPageToken = '';

        do {
            const response = await axios.get('', {
                params: {
                    part: 'contentDetails',
                    maxResults: 50,
                    playlistId,
                    pageToken: nextPageToken,
                    key: API_KEY
                }
            });

            const videoIds = response.data.items.map(item => item.contentDetails.videoId).join(',');
            videoCount += response.data.items.length;

            const videoResponse = await axios.get('', {
                params: {
                    part: 'contentDetails',
                    id: videoIds,
                    key: API_KEY
                }
            });

            videoResponse.data.items.forEach(video => {
                const duration = video.contentDetails.duration;
                const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
                const hours = parseInt(match[1] || 0);
                const minutes = parseInt(match[2] || 0);
                const seconds = parseInt(match[3] || 0);
                totalDuration += (hours * 3600) + (minutes * 60) + seconds;
            });

            nextPageToken = response.data.nextPageToken;

        } while (nextPageToken);

        const formattedDuration = `${Math.floor(totalDuration / 3600)}h ${Math.floor((totalDuration % 3600) / 60)}m ${totalDuration % 60}s`;

        res.json({ duration: formattedDuration, videoCount });
    } catch (error) {
        res.status(500).send('Error fetching playlist data.');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
