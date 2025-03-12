import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [playlistUrl, setPlaylistUrl] = useState('');
    const [duration, setDuration] = useState('');
    const [videoCount, setVideoCount] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setDuration('');
        setVideoCount('');

        const playlistIdMatch = playlistUrl.match(/[?&]list=([^&]+)/);

        if (!playlistIdMatch) {
            setError('Invalid playlist URL. Please check and try again.');
            return;
        }

        const playlistId = playlistIdMatch[1];

        try {
            const response = await axios.post('http://localhost:5000/getPlaylistDuration', { playlistId });
            setDuration(response.data.duration);
            setVideoCount(response.data.videoCount);
        } catch (err) {
            console.error('Error fetching playlist duration:', err);
            setError(err.response?.data || 'Error fetching playlist duration.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-between font-sans bg-[#F0F0F0] text-[#211C84]">
            {/* Header */}
            <header className="w-full py-6 bg-white shadow-md text-center">
                <h1 className="text-2xl md:text-3xl font-bold">YouTube Playlist Length Checker</h1>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center w-full px-4">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Enter YouTube Playlist URL"
                            value={playlistUrl}
                            onChange={(e) => setPlaylistUrl(e.target.value)}
                            className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4D55CC]"
                        />
                        <button className="w-full p-3 rounded bg-[#211C84] text-white font-bold transition-colors hover:bg-[#4D55CC]">
                            Get Duration
                        </button>
                    </form>
                    
                    {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
                    {duration && <p className="mt-4 text-md text-[#211C84]">📌 Total Duration: {duration}</p>}
                    {videoCount && <p className="text-md text-[#211C84]">🎥 Number of Videos: {videoCount}</p>}
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-4 bg-white text-center border-t border-gray-200">
                <p className="text-sm text-gray-600">Developed by <strong>Yash Pal</strong> © 2025</p>
                <div className="mt-1 text-sm text-[#211C84]">
                    <a href="https://github.com/ya8hh" target="_blank" rel="noopener noreferrer" className="mr-4 hover:text-[#4D55CC]">GitHub: @ya8hh</a>
                    <a href="https://www.instagram.com/ya8hh" target="_blank" rel="noopener noreferrer" className="hover:text-[#4D55CC]">Instagram: @ya8hh</a>
                </div>
            </footer>
        </div>
    );
}

export default App;
