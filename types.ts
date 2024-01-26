import { Song } from "@prisma/client";


export interface ISong {
    id: string;
    name: string;
    url: string;
    duration?: number;
    thumbnail: string;
    isPublic?: boolean;
    userCreatorId: string;
    albumId: string;
    genreId: string;
    artistId: string;

}

export interface IArtist {
    id: string;
    createdAt?: Date;
    updatedAt?: Date;
    name: string;
    thumbnail?: string;
    songsId?: string[];
    Song?: ISong[];
    Album?: IAlbum[];
    followedBy?: string;
    likedBy?: string;
}


export interface IAlbum {
    id: string;
    name: string;
    thumbnail: string;
    totalTracks?: number;
    isPublic?: boolean;
    userCreatorId?: string;
    likedById?: string[];
    genreId?: string;
    artistId?: string;

}
export interface MainEventAction {
 event:{ target:{
    value: string
  }
   }
}

export interface IPlaylist {
    id: string;
    playlistName: string;
    thumbnail: string;
    playlistSongs: string[];
    userCreatorId: string;
}


export interface ImportedObject{
    id : Song['id'],
    title : Song['name'],
    preview : Song['url'],
    duration : Song['duration'],
    md5_image: Song['thumbnail'],
    artist :{
        id : IArtist['id'],
        name : IArtist['name']
        picture : IArtist['thumbnail']
    }
    album: 
    {
        id : IAlbum['id'],
        title : IAlbum['name'],
        cover : IAlbum['thumbnail']
    }
}