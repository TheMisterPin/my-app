import React, { useState } from 'react';
import { ISong, IArtist, IAlbum} from '../../../types';
import { fetchTracks } from '../../../actions';


interface SearchBarProps {
    onSearch: (songs: ISong[], artists: IArtist[], albums: IAlbum[]) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');
      
    const handleSearch = async () => {
        try {
            const response = await fetchTracks();
            onSearch(response.songs, response.artists, response.albums);
        } catch (error) {
            console.error('Failed to fetch tracks:', error);
        }
    };

    return (
        
        <div className='flex flex-col items-center'>
            <span className='text-zinc-200 text-2xl' >Search an Artist</span>
            <input
            className='m-4 text-black'
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for tracks, artists, albums..."
            />       
            <button className='text-zinc-800 p-4 bg-green-300 mt-3 ml-[350px]' onClick={handleSearch}>Search</button> 
        </div>
    );
};
