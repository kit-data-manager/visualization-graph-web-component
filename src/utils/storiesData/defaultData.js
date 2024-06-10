
/**
 * Class responsible for providing data for stories.
 */
export class DefaultData {
    /**
     * Initializes an instance of StoriesData with pre-defined network data.
     */
    constructor() {
        this.defaultData = [
            {
                id: "Michael Jackson",
                properties: {
                    genre: "Pop",
                    hitSong: "Thriller",
                    type: "artist"
                }
            },
            {
                id: "Thriller",
                properties: {
                    artist: "Michael Jackson",
                    year: "1982",
                    type: "album"
                }
            },
            {
                id: "The Beatles",
                properties: {
                    genre: "Rock",
                    hitSong: "Hey Jude",
                    album: "Abbey Road",
                    type: "band"
                }
            },
            {
                id: "Abbey Road",
                properties: {
                    artist: "The Beatles",
                    year: "1969",
                    type: "album"
                }
            },
            {
                id: "Elvis Presley",
                properties: {
                    genre: "Rock and Roll",
                    hitSong: "Heartbreak Hotel",
                    type: "artist"
                }
            },
            {
                id: "Leonardo Da Vinci",
                properties: {
                    occupation: "Polymath",
                    knownFor: "Mona Lisa",
                    birthYear: "1452",
                    type: "artist"
                }
            }
        ];
        this.defaultConfigurationSettings = [
            {
              label: "primary node",
              color: "",
              description: "Famous artists and their art",
              properties: [
                {
                  hitSong: {
                    label: "hit song",
                    color: "",
                    description: "Song which was top of billboard chart for a year"
                  },
                  album: {
                    label: "album",
                    color: "",
                    description: ""
                  }
                }
              ],
              primaryNodeConfigurations: [
                {
                  typeRegEx: "artist",
                  nodeLabel: "Celebrity",
                  nodeColor: "blue"
                },
                {
                  typeRegEx: "album",
                  nodeLabel: "Hit-Album",
                  nodeColor: "green"
                }
              ]
            }
          ];
    }

    getDefaultData() {
        return this.defaultData;
    }
    getDefaultConfigurationSettings() {
        return this.defaultConfigurationSettings;
    }
}