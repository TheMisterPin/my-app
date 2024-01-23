'use server'

import axios from "axios";

import { IArtist, ISong, IAlbum, ITrack } from './types';
import prisma from "./prisma";



export const fetchTracks = async (query : string): Promise<{ songs: ISong[], artists: IArtist[], albums: IAlbum[] }> => {
    const options = {

        method: 'GET',
        url: 'https://deezerdevs-deezer.p.rapidapi.com/search',
        params: { q: query },
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

        response.data.data.forEach((item: ITrack) => {
            // Extract Song data
          


const imageUrl = `https://e-cdn-images.dzcdn.net/images/cover/${item.md5_image}/500x500-000000-80-0-0.jpg`;



            songs.push({
                id: item.id,
                link: item.link,
                title: item.title,
                duration: item.duration,
                preview: item.preview,
                image: imageUrl,
                artist: item.artist.name,
                album: item.album.title,
                artistId: item.artist.id,
                albumId: item.album.id
            });

            // Extract Artist data
            artists.push({
                id: item.artist.id,
                name: item.artist.name,
                picture: item.artist.picture,
                songs: []

            });

            // Extract Album data
            albums.push({
                artist: item.artist.name,
                id: item.album.id,
                title: item.album.title,
                cover: item.album.cover,
                songs: [],
            });
        });

        return { songs, artists, albums };
    } catch (error) {
        console.error(error);
        return { songs: [], artists: [], albums: [] };
    }
};

export const addArtist = async (data: IArtist) => {
    const { id, name, picture } = data;

    const newArtist = await prisma.artist.create({
        data: {
            id,
            name,
            picture,
            songs:[]
        },
    });

    return newArtist;
};
export const addSong = async (data: ISong) => {
    const { id, title, preview, image, artistId, albumId, duration,artist, album  } = data;

    const newSong = await prisma.song.create({
        data: {
            deezerId: id,
            title,
            duration,
            artist,
            album,
            preview,
            md5Image: image,
            artistId,
            albumId,
        },
    });

    return newSong;
};
// Function to add an album
export const addAlbum = async (data: IAlbum) => {
    const { id, title, cover, artist } = data;

    const newAlbum = await prisma.album.create({
        data: {
            id, 
            title,
            artist,
            cover,
            songs:[]
        },
    });

    return newAlbum;
};

