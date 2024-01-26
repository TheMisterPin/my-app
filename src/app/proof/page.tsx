'use client'
import React, { useState, useEffect } from 'react';
import { getPlaylistResponse } from '../../../actions';
const PlaylistComponent = () => {
    const [playlistData, setPlaylistData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getPlaylistResponse();
            setPlaylistData(data);
        };

        fetchData();
    }, []);

    if (!playlistData) {
        return <p>HAVING A SHOWER...</p>;
    }

    return (
        <div>
            <p>{JSON.stringify(playlistData)}</p>
          
        </div>
    );
};

export default PlaylistComponent;