import React, { useState } from 'react';
import { ISong, IArtist, IAlbum} from '../../../../types';
import { fetchTracks } from '../../../../actions';


interface SearchBarProps {
    onSearch: (songs: ISong[], artists: IArtist[], albums: IAlbum[]) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearch = async () => {
        try {
            const response = await fetchTracks(query);
            onSearch(response.songs, response.artists, response.albums);
        } catch (error) {
            console.error('Failed to fetch tracks:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for tracks, artists, albums..."
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};
