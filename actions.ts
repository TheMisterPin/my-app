'use server'

import axios from "axios"
import prisma from "./prisma"
import { ISong, IAlbum, IArtist, IPlaylist } from './types'

function numberToObjectIdHex(value: number) {
    let hexString = value.toString(16)
    hexString = hexString.padStart(24, '0')
    return hexString;
}



export const fetchTracks = async (): Promise<{ songs: ISong[], artists: IArtist[], albums: IAlbum[] }> => {
    const options = {
        method: 'GET',
        url: 'https://deezerdevs-deezer.p.rapidapi.com/search',
        params: { q: 'slipknots' },
        headers: {
            'X-RapidAPI-Key': '7e846162b0msh54cd57051f3a27ap1b6697jsn4f31de17e2a0',
            'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
        }
    };
    try {
        const response = await axios.request(options);
        const songs: ISong[] = [];
        const artists: IArtist[] = [];
        const albums: IAlbum[] = [];
        const userString = "65b225682ecf5b6628278fb7";
        const userCreatorId = userString.toString()
        response.data.data.forEach((item: any) => {
            const songId = numberToObjectIdHex(item.id);
            songs.push({
                id: songId,
                name: item.title,
                url: item.preview,
                duration: item.duration,
                thumbnail: `https://e-cdn-images.dzcdn.net/images/cover/${item.md5_image}/500x500-000000-80-0-0.jpg`,
                isPublic: true,
                userCreatorId: userCreatorId,
                genreId: numberToObjectIdHex(item.album.id),
                albumId: numberToObjectIdHex(item.album.id),
                artistId: numberToObjectIdHex(item.artist.id),
            });
            if (!artists.some(artist => artist.id === numberToObjectIdHex(item.artist.id))) {
                artists.push({
                    id: numberToObjectIdHex(item.artist.id),
                    name: item.artist.name,
                    thumbnail: item.artist.picture,
                });
            }
            if (!albums.some(album => album.id === numberToObjectIdHex(item.album.id))) {
                albums.push({
                    id: numberToObjectIdHex(item.album.id),
                    name: item.album.title,
                    thumbnail: item.album.cover,
                    totalTracks: 1,
                    artistId: numberToObjectIdHex(item.artist.id),

                });
            }
        });
        return { songs, artists, albums };
    } catch (error) {
        console.error(error);
        return { songs: [], artists: [], albums: [] };
    }
};


export const addSong = async (data: ISong, selectedGenreId: string) => {
    const { id, name, url, duration, thumbnail, genreId, isPublic, albumId, artistId } = data;
    const userString = "65b225682ecf5b6628278fb7";
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
            }
            },
        });

    return newSong;
}

export const addArtist = async (data: IArtist) => {
    const { id, name, thumbnail } = data;

    const newArtist = await prisma.artist.create({
        data: {
            id,
            name,
            thumbnail
        },
    });
    return newArtist;
};


export const addAlbum = async (data: IAlbum, selectedGenreId: string) => {
    const { id, name, thumbnail, isPublic, artistId } = data;
    const userCreatorId = "65b225682ecf5b6628278fb7";
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
