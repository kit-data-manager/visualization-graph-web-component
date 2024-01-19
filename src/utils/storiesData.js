export class StoriesData {
    constructor() {
      this.data = [
        {
          id: 'Michael Jackson',
          properties: {
            genre: 'Pop',
            hitSong: 'Thriller',
            album: 'Thriller'
          }
        },
        {
          id: 'Thriller',
          properties: {
            title: 'Thriller',
            artist: 'Michael Jackson',
            year: '1982'
          }
        },
        {
          id: 'The Beatles',
          properties: {
            genre: 'Rock',
            hitSong: 'Hey Jude',
            album: 'Abbey Road'
          }
        },
        {
          id: 'Abbey Road',
          properties: {
            title: 'Abbey Road',
            artist: 'The Beatles',
            year: '1969'
          }
        },
        {
          id: 'Elvis Presley',
          properties: {
            genre: 'Rock and Roll',
            hitSong: 'Heartbreak Hotel',
            album: 'Elvis Presley'
          }
        },
        {
          id: 'Elvis Presley',
          properties: {
            title: 'Elvis Presley',
            artist: 'Elvis Presley',
            year: '1956'
          }
        },
        {
          id: 'Leonardo Da Vinci',
          properties: {
            occupation: 'Polymath',
            knownFor: 'Mona Lisa',
            birthYear: '1452'
          }
        }
      ];
      
    }
  
    getData() {
      return this.data;
    }
  }
  
  