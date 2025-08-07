import React, { useEffect, useState } from 'react';
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import '@livekit/components-styles';
import axios from 'axios';

const App = () => {
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const generateToken = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_GET_TOKEN_URL+'/get-token?room=testroom&identity=user123&name=user');
                setToken(response.data.token);
            } catch (err) {
                console.error('Error fetching token:', err);
                setError(`Failed to get access token: ${err.message}`);
            }
        };

        generateToken();
    }, []);

    if (error) {
        return (
            <div className="error-container">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="loading-container">
                <h2>Loading...</h2>
                <p>Connecting to video room...</p>
            </div>
        );
    }

    return (
        <div className="lk-room-container">
            <LiveKitRoom
                token={token}
                serverUrl={import.meta.env.VITE_WS_URL}
                connect={true}
                video={true}
                audio={true}
                onDisconnected={() => console.log('Disconnected from LiveKit room')}
                onConnected={() => console.log('Connected to LiveKit room')}
                style={{ height: '100%', width: '98vw' }}
            >
                <VideoConference />
            </LiveKitRoom>
        </div>
    );
};

export default App;
