'use server'

import axios from "axios"
import prisma from "./prisma"
import { ISong, IAlbum, IArtist, IPlaylist } from './types'



function numberToObjectIdHex(value: number) {
    // Convert number to a hex string
    let hexString = value.toString(16)

    // Pad the hex string to 24 characters (12 bytes)
    hexString = hexString.padStart(24, '0')

    return hexString;
}



export const fetchTracks = async (): Promise<{playlists: IPlaylist[], songs: ISong[], artists: IArtist[], albums: IAlbum[] }> => {

    const options = {
        method: 'GET',
        url: `https://api.deezer.com/playlist/1807219322/tracks`,
        
        headers: {
            'X-RapidAPI-Key': process.env.SECRET_KEY,
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
        }
    };
    try {
        const response = await axios.request(options);
        const songs: ISong[] = [];
        const artists: IArtist[] = [];
        const albums: IAlbum[] = [];
        const userString = "65b191b1450c3dff56f4b542";
        const userCreatorId = userString.toString()

        response.data.data.forEach((data: object) => {  // Replace 'any' with the appropriate type for the item
            const songId = numberToObjectIdHex(data.id);
            const playlistId = numberToObjectIdHex(item.id);

            playlists.push({
                id: playlistId,
                playlistName: item.title,
                thumbnail: item.album.cover_medium,         
                userCreatorId: userCreatorId,
                playlistSongs: [songId],                 
            }),

            songs.push({
                id: songId,
                name: item.tracks.data.title,
                url: item.tracks.data.preview,
                duration: item.tracks.data.duration,
                thumbnail: `https://e-cdn-images.dzcdn.net/images/cover/${item.tracks.data.md5_image}/500x500-000000-80-0-0.jpg`,
                isPublic: true,
                userCreatorId: userCreatorId,
                genreId: numberToObjectIdHex(item.tracks.data.album.id),
                albumId: numberToObjectIdHex(item.tracks.data.album.id),
                artistId: numberToObjectIdHex(item.tracks.data.artist.id)
            });

            if (!artists.some(artist => artist.id === numberToObjectIdHex(item.tracks.data.artist.id))) {
                artists.push({
                    id: numberToObjectIdHex(item.artist.id),
                    name: item.tracks.data.artist.name,
                    thumbnail: item.tracks.data.artist.picture,
                });
            }

            if (!albums.some(album => album.id === numberToObjectIdHex(item.tracks.data.album.id))) {
                albums.push({
                    id: numberToObjectIdHex(item.tracks.data.album.id),
                    name: item.tracks.data.album.title,
                    thumbnail: item.tracks.data.album.cover,
                    totalTracks: 1,
                    artistId: numberToObjectIdHex(item.tracks.data.artist.id),
                });
            }
        });

        return { songs, artists, albums, playlists };
    } catch (error) {
        console.error(error);
        return { songs: [], artists: [], albums: [], playlists: [] }
    }
};






export const addSong = async (data: ISong, selectedGenreId: string) => {
    const { id, name, url, duration, thumbnail, genreId, isPublic, albumId, artistId } = data;
    const userString = "65b191b1450c3dff56f4b542";
    const userCreatorId = userString.toString()
    const newSong = await prisma.song.create({
        data: {
            id,
            name,
            url,
            duration,
            thumbnail,
            isPublic: isPublic ?? true, 
            UserCreator: {
                connect: { id: userCreatorId },
            },
            Genre: {
                connect: { id: selectedGenreId }
            },
            ...(albumId && { Album: { connect: { id: albumId } } }), 
            Artist: {
                connect: { id: artistId }

        },
    },
 } );

    return newSong;
};

export const addPlaylist = async (data: IPlaylist, selectedGenreId: string) => {
    const { id, playlistName, thumbnail, userCreatorId, playlistSongs } = data;
    const newPlaylist = await prisma.playlist.create({
        data: {
            id,
            playlistName,
            thumbnail,
            UserCreator:{
                connect : {id : userCreatorId}
            },     
            playlistSongs  
            
        },
    });

    return newPlaylist;
}



export const addArtist = async (data: IArtist) => {
    const { id, name, thumbnail } = data;

    const newArtist = await prisma.artist.create({
        data: {
            id,
            name,
            thumbnail,
            Song: {
                connect: { id: id }
                      }

        },
    });

    return newArtist;
};


export const addAlbum = async (data: IAlbum, selectedGenreId: string) => {
    const { id, name, thumbnail, isPublic, artistId } = data;
    const userCreatorId = "65b191b1450c3dff56f4b542";
    const userExists = await prisma.user.findUnique({
        where: { id: userCreatorId },
    });

    if (!userExists) {
        throw new Error(`User with ID ${userCreatorId} not found`);
    }
    const newAlbum = await prisma.album.create({

        data: {
            id,
            name,
            thumbnail,
            isPublic,
            Song: {
                connect: { id: id }
            },
            UserCreator: {
                connect: {
                    id: userCreatorId
                },
            },
            Genre: {
                connect: { id: selectedGenreId }
            },
            Artist: {
                connect: { id: artistId }
            },

        },
    });

    return newAlbum;
};
