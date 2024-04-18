/**
 * Class responsible for providing data for stories.
 */ 
export class StoriesData {
    /**
     * Initializes an instance of StoriesData with pre-defined network data.
     */  
      constructor() {
        this.defaultData = [
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
              id: 'Leonardo Da Vinci',
              properties: {
                occupation: 'Polymath',
                knownFor: 'Mona Lisa',
                birthYear: '1452'
              }
            }
          ];
        
        this.defaultConfigurationSettings = [
            {
              label: "Primary Node",
              color: "",
              description: "Famous artists and their art",
              properties: [
                {
                  hitSong: {
                    label: "Hit Song",
                    color: "",
                    description: "Song which was top of billboard chart for a year"
                  },
                  album:{
                    label: "Album",
                    color: "",
                    description: ""
                  }
                }
              ]
            }
          ];

          this.defaultData = [

          ]

          this.defaultConfigurationSettings1 = [
            {
              label: "Primary Node",
              color: "",
              description: "",
              properties: [
                {
                  hitSong: {
                    label: "Hit Song",
                    color: "",
                    description: "Song which was top of billboard chart for a year"
                  },
                  album:{
                    label: "Album",
                    color: "",
                    description: ""
                  }
                }
              ]
            }
          ];
    }

    getDefaultData(){
        return this.defaultData;
      }

    getHideAttributesData(){
        return this.defaultData;
      }
    
    getHidePrimaryLinksData(){
        return this.defaultData;
      }

    getHideDetailsOnHoverData(){
        return this.defaultData;
      }

    getEnterData(){
        return this.defaultData;
      }

    getExcludeSomePropertiesData(){
        return this.defaultData;
      }
    
    getConfigurationsSettingsData(){
        return this.defaultData;
      }
    
    getNetworkData() {
        return this.defaultData;
      }
  
    getDefaultConfigurationSettings() {
        return this.defaultConfigurationSettings;
      }

      
}