'use client'
import { useState, useEffect } from "react";
import { ISong, IArtist, IAlbum } from '../../types';
import { addAlbum, addArtist, addSong, fetchTracks } from '../../actions';
import { SearchBar } from "./components/component.tsx/searchbar";
import Image from "next/image";

export default function Home() {
  const [songs, setSongs] = useState<ISong[]>([]);
  const [artists, setArtists] = useState<IArtist[]>([]);
  const [albums, setAlbums] = useState<IAlbum[]>([]); // Renamed to 'albums'

  useEffect(() => {
    const getTracks = async () => {
      const { songs: fetchedSongs, artists: fetchedArtists, albums: fetchedAlbums } = await fetchTracks("");
      setSongs(fetchedSongs);
      setArtists(fetchedArtists);
      setAlbums(fetchedAlbums); 
    };

    getTracks();
  }, []); // Added empty dependency array

  const handleSong = (song: ISong) => {
    addSong(song);
  };

  const handleArtist = (artist: IArtist) => {
    addArtist(artist);
  };

  const handleAlbum = (album: IAlbum) => {
    addAlbum(album);
  };

  const getUniqueAlbums = (albums: IAlbum[]): IAlbum[] => {
    const uniqueAlbumIds = new Set(albums.map(album => album.id));
    return albums.filter(album => uniqueAlbumIds.has(album.id) && uniqueAlbumIds.delete(album.id));
  };

  const getUniqueArtist = (artists: IArtist[]): IArtist[] => {
    const uniqueArtistIds = new Set(artists.map(artist => artist.id));
    return artists.filter(artist => uniqueArtistIds.has(artist.id) && uniqueArtistIds.delete(artist.id));
  };  
  
    const handleSearchResults = (songs: ISong[], artists: IArtist[], albums: IAlbum[]) => {
      setSongs(songs);
      setArtists(artists);
      setAlbums(albums);
    };
 
  return (
<div className="flex">
  <SearchBar onSearch={handleSearchResults}/>
  <div className="flex">
  
      <h1>Tracks</h1>
      <div>
      {songs.map(song => (
        <div key={song.id}>
          <p className="p-6 rounded-xl bg-slate-500 text-white max-w-64 mb-9" onClick={() => handleSong(song)}>Rob: {song.title}</p>
         <Image
            src={song.image}
            alt="Song Cover"
            width={200}
            height={200}
          />
        </div>
      ))}
      <h1>Artists</h1>
      {getUniqueArtist(artists).map(artist => (
        <div key={artist.id}>
          <Image
            src={artist.picture}
            alt="Artist Cover"
            width={200}
            height={200}
          />
          <p className="p-6 rounded-xl bg-pink-200 text-white max-w-64 mb-9" onClick={() => handleArtist(artist)}> Rob: {artist.name} </p>
        </div>
      ))}
      <h1>Albums</h1>
      {getUniqueAlbums(albums).map(album => (
        <div key={album.id}>
          <p className="p-6 rounded-xl bg-red-500 text-white max-w-64 mb-9" onClick={() => handleAlbum(album)}>Name: {album.title}</p>
          <Image
            src={album.cover}
            alt="Album Cover"
            width={200}
            height={200}
          />
        </div>
      ))}
    </div>
    </div>
    </div>
  );
}
