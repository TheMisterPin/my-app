export interface ITrack {
    id: number;
    deezerId: number;
    title: string;
    duration: number;
    preview: string;
    md5_image: string;
    artistId: number;
    albumId: number;
    artist: IArtist;
    album: IAlbum;
    link? : string
}



interface Song {
    id: number
    name: string
    url: string
    duration: number
    thumbnail: string

}
export interface ISong {
 
    id: number;
    title: string;
    link?: string
    artist: string;
    isPublic: boolean;
    album: string;
    track: string;
    duration: number;
    userCreator?: string;
    userCreatorId?: string;
    userId?: string; 
    genre?: string;
    genreId?: string;
    image: string;
    artistId: number;
    albumId: number;
}

export interface IArtist {
    id: number;
    name: string;
    picture: string;
    songs: string[]
}

export interface IAlbum {
    id: number;
    title: string;
    cover: string;
    songs: string[]
    artist: string;
}
