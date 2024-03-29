'use client'
import { useState, useEffect,  } from "react";
import { ISong, IArtist, IAlbum } from '../../types';
import { addAlbum, addArtist, addSong, fetchTracks } from '../../actions';
import { SearchBar } from "./components/searchbar";

const genres = [
  { id: "65b1b95fe5f3c6d344bf0a3c", name: "Rock" },
  { id: "65b1b99ae5f3c6d344bf0a3e", name: "Pop" },
  { id: "65b1b9ebe5f3c6d344bf0a40", name: "Hip Hop" },
  { id: "65b1ba13e5f3c6d344bf0a42", name: "Jazz" },
  { id: "65b396655bcb192ac9da5a60", name: "Classical" },
  { id: "65b1ba61e5f3c6d344bf0a44", name: "Techno" },

];

export default function Home() {
 
  const [songs, setSongs] = useState<ISong[]>([]);
  const [artists, setArtists] = useState<IArtist[]>([]);
  const [albums, setAlbums] = useState<IAlbum[]>([]); // Renamed to 'albums'
  const [selectedGenreId, setSelectedGenreId] = useState(genres[0].id);
  const handleGenreChange = (event: any) => {
  setSelectedGenreId(event.target.value);
  };
  
  useEffect(() => {
    const getTracks = async () => {
      const { songs: fetchedSongs, artists: fetchedArtists, albums: fetchedAlbums, } = await fetchTracks();
      setSongs(fetchedSongs);
      setArtists(fetchedArtists);
      setAlbums(fetchedAlbums);
         }
    getTracks();
  }, []);

  const handleSong = (song: ISong, selectedGenreId: string) => {
    addSong(song, selectedGenreId)
    setSongs(prevSongs => {
      const index = prevSongs.findIndex(s => s.id === song.id);
      if (index > -1) {
         return prevSongs.filter((_, i) => i !== index);
      } else {        
        return [...prevSongs, song];
      }
    });
  };

  const handleArtist = (artist: IArtist) => {
    addArtist(artist);
    setArtists(prevArtists => {
      const index = prevArtists.findIndex(a => a.id === artist.id);
      if (index > -1) {
        return prevArtists.filter((_, i) => i !== index);
      } else {
        return [...prevArtists, artist];
      }
    })
  };

  const handleAlbum = (album: IAlbum, selectedGenreId: string) => {
    addAlbum(album, selectedGenreId);
    setAlbums(prevAlbums => {
      const index = prevAlbums.findIndex(a => a.id === album.id);
      if (index > -1) {
        return prevAlbums.filter((_, i) => i !== index);
      } else {
        return [...prevAlbums, album];
      }
    })
  };

  const getUniqueAlbums = (albums: IAlbum[]): IAlbum[] => {
    const uniquealbumIDs = new Set(albums.map(album => album.id));
    return albums.filter(album => uniquealbumIDs.has(album.id) && uniquealbumIDs.delete(album.id));
  };

  const getUniqueArtist = (artists: IArtist[]): IArtist[] => {
    const uniqueartistIDs = new Set(artists.map(artist => artist.id));
    return artists.filter(artist => uniqueartistIDs.has(artist.id) && uniqueartistIDs.delete(artist.id));
  };  
  
  const handleSearchResults = (songs: ISong[], artists: IArtist[], albums: IAlbum[]) => {
    setSongs(songs);
    setArtists(artists);
    setAlbums(albums);
  };
  
  return (
<div className="flex p-20 items-center flex-col bg-slate-800 min-h-[100vh]">
  <span className="text-purple-600 text-7xl">Sound Sphere Database Builder</span>
      <div className="flex p-20">
        <SearchBar onSearch={handleSearchResults} /><div className="flex flex-col p-20 mt-[-80px]">
        <span className='text-zinc-200 text-2xl' >Select A genre</span>
        <select className="mt-4" value={selectedGenreId} onChange={handleGenreChange}>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>   </div>
      </div>
  <div className="flex flex-col">
        <span className=' text-purple-500 text-5xl' >Step1 : Click on Artist</span >
        <div className="grid grid-cols-5 gap-x-12">
        {getUniqueArtist(artists).map(artist => (
          <div key={artist.id}>
            <p className="p-6 rounded-xl bg-pink-200 text-white max-w-64 mb-9" onClick={() => handleArtist(artist)}> Artist: {artist.name} </p>
          </div>
        ))}       </div>
        <span className='text-zinc-200 text-purple-500 text-5xl' >Step 2 : Click on Album</span>
        <div className="grid grid-cols-5 gap-x-12">
        {getUniqueAlbums(albums).map(album => (
          <div key={album.id}>
            <p className="p-6 rounded-xl bg-red-500 text-white max-w-64 mb-9" onClick={() => handleAlbum(album, selectedGenreId)}>Album: {album.name}</p>
          </div>
        ))}
        </div>
        <span className='text-zinc-200 text-purple-500 text-5xl' >Step 3: Click on Song</span>
        <div className="grid grid-cols-5 gap-x-12">
      {songs.map(song => (     
          <p key={song.id}  className="p-6 rounded-xl bg-slate-500 text-white max-w-64 mb-9" onClick={() => handleSong(song, selectedGenreId)}>Song: {song.name}</p>
            ))}   
    </div>
    </div>
    </div>  
  );
}
