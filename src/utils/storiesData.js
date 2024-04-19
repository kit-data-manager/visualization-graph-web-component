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

          this.midSizeData = [
            {
              id: "Radioactivity discovery",
              properties: {
                discoveredBy: "Marie Curie"
              }
            },
            {
              id: "Observational Astronomy",
              properties: {
                discoveredBy: "Galileo Galilei"
              }
            },
            {
              id: "Black Hole Theory",
              properties: {
                discoveredBy: "Stephen Hawking",
                year: "1930"
              }
            },
            {
              id: "Alternating Current",
              properties: {
                discoveredBy: "Nikola Tesla"
              }
            },
            {
              id: "Computer Science",
              properties: {
                discoveredBy: "Alan Turing"
              }
            },
            {
              id: "Electric Light Bulb",
              properties: {
                discoveredBy: "Thomas Edison"
              }
            },
            {
              id: "Laws of Motion",
              properties: {
                discoveredBy: "Isaac Newton"
              }
            },
            {
              id: "Theory of Relativity",
              properties: {
                discoveredBy: "Albert Einstein"
              }
            },
            {
              id: "Mona Lisa",
              properties: {
                discoveredBy: "Leonardo da Vinci"
              }
            },
            {
              id: "Mathematical Analysis",
              properties: {
                discoveredBy: "Leonhard Euler"
              }
            },{
              id: "Curie",
              properties: {
                  name: "Marie Curie",
                  contribution: "Radioactivity discovery",
                  birthYear: "1867",
                  nationality: "Polish",
                  field: "Physics and Chemistry",
                  recognition: "Nobel Prize"
              }
            },
            {
              id: "Galileo",
              properties: {
                  name: "Galileo Galilei",
                  contribution: "Observational Astronomy",
                  birthYear: "1564",
                  nationality: "Italian",
                  field: "Physics and Astronomy",
                  recognition: "Galileos telescope"
              }
            },
            {
              id: "Hawking",
              properties: {
                  name: "Stephen Hawking",
                  contribution: "Black Hole Theory",
                  birthYear: "1942",
                  nationality: "British",
                  field: "Theoretical Physics",
                  recognition: "Hawking radiation"
              }
            },
            {
              id: "Tesla",
              properties: {
                  name: "Nikola Tesla",
                  contribution: "Alternating Current",
                  birthYear: "1856",
                  nationality: "Serbian-American",
                  field: "Electrical Engineering",
                  recognition: "Tesla Coil"
              }
            },
            {
              id: "Turing",
              properties: {
                  name: "Alan Turing",
                  contribution: "Computer Science",
                  birthYear: "1912",
                  nationality: "British",
                  field: "Mathematics and Computer Science",
                  recognition: "Turing Machine"
              }
            },
            {
              id: "Edison",
              properties: {
                  name: "Thomas Edison",
                  contribution: "Electric Light Bulb",
                  birthYear: "1847",
                  nationality: "American",
                  field: "Invention and Engineering",
                  recognition: "Phonograph"
              }
            },
            {
              id: "Newton",
              properties: {
                  name: "Isaac Newton",
                  contribution: "Laws of Motion",
                  birthYear: "1643",
                  nationality: "English",
                  field: "Mathematics and Physics",
                  recognition: "Newtons laws of motion"
              }
            },
            {
              id: "Einstein",
              properties: {
                  name: "Albert Einstein",
                  contribution: "Theory of Relativity",
                  birthYear: "1879",
                  nationality: "German-American",
                  field: "Physics",
                  recognition: "E=mc^2"
              }
            },
            {
              id: "Da-Vinci",
              properties: {
                  name: "Leonardo da Vinci",
                  contribution: "Mona Lisa",
                  birthYear: "1452",
                  nationality: "Italian",
                  field: "Art and Science",
                  recognition: "Vitruvian Man"
              }
            },
            {
              id: "Euler",
              properties: {
                  name: "Leonhard Euler",
                  contribution: "Mathematical Analysis",
                  birthYear: "1707",
                  nationality: "Swiss",
                  field: "Mathematics",
                  recognition: "Euler identity"
              }
            },
            {
              id: "Maxwell",
              properties: {
                  name: "James Clerk Maxwell",
                  contribution: "Electromagnetic Theory",
                  birthYear: "1831",
                  nationality: "Scottish",
                  field: "Physics",
                  recognition: "Maxwell equations"
              }
            },
            {
              id: "Bohr",
              properties: {
                  name: "Niels Bohr",
                  contribution: "Atomic Model",
                  birthYear: "1885",
                  nationality: "Danish",
                  field: "Physics",
                  recognition: "Bohr model"
              }
            },
            {
              id: "Pasteur",
              properties: {
                  name: "Louis Pasteur",
                  contribution: "Germ Theory",
                  birthYear: "1822",
                  nationality: "French",
                  field: "Microbiology",
                  recognition: "Pasteurization"
              }
            },
            {
              id: "Archimedes",
              properties: {
                  name: "Archimedes",
                  contribution: "Archimedes Principle",
                  birthYear: "c. 287 BC",
                  nationality: "Greek",
                  field: "Mathematics and Physics",
                  recognition: "Buoyancy"
              }
            },
            {
              id: "Pythagoras",
              properties: {
                  name: "Pythagoras",
                  contribution: "Pythagorean Theorem",
                  birthYear: "c. 570 BC",
                  nationality: "Greek",
                  field: "Mathematics",
                  recognition: "Pythagorean triple"
              }
            },
            {
              id: "Euclid",
              properties: {
                  name: "Euclid",
                  contribution: "Elements",
                  birthYear: "c. 300 BC",
                  nationality: "Greek",
                  field: "Mathematics",
                  recognition: "Geometry"
              }
            },
            {
              id: "Kepler",
              properties: {
                  name: "Johannes Kepler",
                  contribution: "Laws of Planetary Motion",
                  birthYear: "1571",
                  nationality: "German",
                  field: "Astronomy",
                  recognition: "Kepler laws"
              }
            },
            {
              id: "Faraday",
              properties: {
                  name: "Michael Faraday",
                  contribution: "Electromagnetism",
                  birthYear: "1791",
                  nationality: "English",
                  field: "Physics",
                  recognition: "Faraday cage"
              }
            },
            {
              id: "Copernicus",
              properties: {
                  name: "Nicolaus Copernicus",
                  contribution: "Heliocentrism",
                  birthYear: "1473",
                  nationality: "Polish",
                  field: "Astronomy",
                  recognition: "Copernican revolution"
              }
            },
            {
              id: "Rutherford",
              properties: {
                  name: "Ernest Rutherford",
                  contribution: "Nuclear Model of the Atom",
                  birthYear: "1871",
                  nationality: "New Zealander",
                  field: "Physics",
                  recognition: "Rutherford model"
              }
            },
            {
              id: "Planck",
              properties: {
                  name: "Max Planck",
                  contribution: "Quantum Theory",
                  birthYear: "1858",
                  nationality: "German",
                  field: "Physics",
                  recognition: "Planck constant"
              }
            },
            {
              id: "Heisenberg",
              properties: {
                  name: "Werner Heisenberg",
                  contribution: "Uncertainty Principle",
                  birthYear: "1901",
                  nationality: "German",
                  field: "Physics",
                  recognition: "Heisenberg uncertainty principle"
              }
            },
            {
              id: "Fermi",
              properties: {
                  name: "Enrico Fermi",
                  contribution: "Nuclear Reactor",
                  birthYear: "1901",
                  nationality: "Italian",
                  field: "Physics",
                  recognition: "Fermi paradox"
              }
            },
            {
              id: "Watson",
              properties: {
                  name: "James Watson",
                  contribution: "DNA Structure",
                  birthYear: "1928",
                  nationality: "American",
                  field: "Genetics",
                  recognition: "Watson-Crick model"
              }
            },
            {
              id: "Crick",
              properties: {
                  name: "Francis Crick",
                  contribution: "DNA Structure",
                  birthYear: "1916",
                  nationality: "British",
                  field: "Molecular Biology",
                  recognition: "Watson-Crick model"
              }
            },
            {
              id: "Mendel",
              properties: {
                  name: "Gregor Mendel",
                  contribution: "Genetics",
                  birthYear: "1822",
                  nationality: "Austrian",
                  field: "Genetics",
                  recognition: "Mendelian inheritance"
              }
            },
            {
              id: "Feynman",
              properties: {
                  name: "Richard Feynman",
                  contribution: "Quantum Electrodynamics",
                  birthYear: "1918",
                  nationality: "American",
                  field: "Physics",
                  recognition: "Feynman diagrams"
              }
            },
            {
              id: "Schrödinger",
              properties: {
                  name: "Erwin Schrödinger",
                  contribution: "Schrödinger Equation",
                  birthYear: "1887",
                  nationality: "Austrian",
                  field: "Physics",
                  recognition: "Schrödinger cat"
              }
            }
          ];

          this.midSizeConfigurationSettings = [
            {
              label: "Primary Node",
              color: "",
              description: "Scientists and Discoveries/Inventions",
              properties: [
                {
                  contribution: {
                    label: "Contribution",
                    color: "",
                    description: "Most known contibution in the lifetime"
                  }
                }
              ]
            }
          ];
          
          this.highSizeData = [
              {
                id: "Radioactivity discovery",
                properties: {
                  discoveredBy: "Marie Curie"
                }
              },
              {
                id: "Observational Astronomy",
                properties: {
                  discoveredBy: "Galileo Galilei"
                }
              },
              {
                id: "Black Hole Theory",
                properties: {
                  discoveredBy: "Stephen Hawking",
                  year: "1930"
                }
              },
              {
                id: "Alternating Current",
                properties: {
                  discoveredBy: "Nikola Tesla"
                }
              },
              {
                id: "Computer Science",
                properties: {
                  discoveredBy: "Alan Turing"
                }
              },
              {
                id: "Electric Light Bulb",
                properties: {
                  discoveredBy: "Thomas Edison"
                }
              },
              {
                id: "Laws of Motion",
                properties: {
                  discoveredBy: "Isaac Newton"
                }
              },
              {
                id: "Theory of Relativity",
                properties: {
                  discoveredBy: "Albert Einstein"
                }
              },
              {
                id: "Mona Lisa",
                properties: {
                  discoveredBy: "Leonardo da Vinci"
                }
              },
              {
                id: "Mathematical Analysis",
                properties: {
                  discoveredBy: "Leonhard Euler"
                }
              },
              {
                id: "Germ Theory",
                properties: {
                  discoveredBy: "Louis Pasteur"
                }
              },
              {
                id: "Archimedes Principle",
                properties: {
                  discoveredBy: "Archimedes"
                }
              },
              {
                id: "Pythagorean Theorem",
                properties: {
                  discoveredBy: "Pythagoras"
                }
              },
              {
                id: "Elements",
                properties: {
                  discoveredBy: "Euclid"
                }
              },
              {
                id: "Laws of Planetary Motion",
                properties: {
                  discoveredBy: "Johannes Kepler"
                }
              },
              {
                id: "Electromagnetism",
                properties: {
                  discoveredBy: "Michael Faraday"
                }
              },
              {
                id: "Heliocentrism",
                properties: {
                  discoveredBy: "Nicolaus Copernicus"
                }
              },
              {
                id: "Nuclear Model of the Atom",
                properties: {
                  discoveredBy: "Ernest Rutherford"
                }
              },
              {
                id: "Quantum Theory",
                properties: {
                  discoveredBy: "Max Planck"
                }
              },
              {
                id: "Uncertainty Principle",
                properties: {
                  discoveredBy: "Werner Heisenberg"
                }
              },
              {
                id: "Nuclear Reactor",
                properties: {
                  discoveredBy: "Enrico Fermi"
                }
              },
              {
                id: "DNA Structure",
                properties: {
                  discoveredBy: "James Watson"
                }
              },
              {
                id: "DNA Structure",
                properties: {
                  discoveredBy: "Francis Crick"
                }
              },
              {
                id: "Genetics",
                properties: {
                  discoveredBy: "Gregor Mendel"
                }
              },
              {
                id: "Quantum Electrodynamics",
                properties: {
                  discoveredBy: "Richard Feynman"
                }
              },
              {
                id: "Schrödinger Equation",
                properties: {
                  discoveredBy: "Erwin Schrödinger"
                }
              },
              {
                id: "Marie Curie",
                properties: {
                  contribution: "Radioactivity discovery",
                  birthYear: "1867",
                  nationality: "Polish",
                  field: "Physics and Chemistry",
                  recognition: "Nobel Prize"
                }
              },
              {
                id: "Galileo Galilei",
                properties: {
                  contribution: "Observational Astronomy",
                  birthYear: "1564",
                  nationality: "Italian",
                  field: "Physics and Astronomy",
                  recognition: "Galileos telescope"
                }
              },
              {
                id: "Stephen Hawking",
                properties: {
                  contribution: "Black Hole Theory",
                  birthYear: "1942",
                  nationality: "British",
                  field: "Theoretical Physics",
                  recognition: "Hawking radiation"
                }
              },
              {
                id: "Nikola Tesla",
                properties: {
                  contribution: "Alternating Current",
                  birthYear: "1856",
                  nationality: "Serbian-American",
                  field: "Electrical Engineering",
                  recognition: "Tesla Coil"
                }
              },
              {
                id: "Alan Turing",
                properties: {
                  contribution: "Computer Science",
                  birthYear: "1912",
                  nationality: "British",
                  field: "Mathematics and Computer Science",
                  recognition: "Turing Machine"
                }
              },
              {
                id: "Thomas Edison",
                properties: {
                  contribution: "Electric Light Bulb",
                  birthYear: "1847",
                  nationality: "American",
                  field: "Invention and Engineering",
                  recognition: "Phonograph"
                }
              },
              {
                id: "Isaac Newton",
                properties: {
                  contribution: "Laws of Motion",
                  birthYear: "1643",
                  nationality: "English",
                  field: "Mathematics and Physics",
                  recognition: "Newtons laws of motion"
                }
              },
              {
                id: "Albert Einstein",
                properties: {
                  contribution: "Theory of Relativity",
                  birthYear: "1879",
                  nationality: "German-American",
                  field: "Physics",
                  recognition: "E=mc^2"
                }
              },
              {
                id: "Leonardo da Vinci",
                properties: {
                  contribution: "Mona Lisa",
                  birthYear: "1452",
                  nationality: "Italian",
                  field: "Art and Science",
                  recognition: "Vitruvian Man"
                }
              },
              {
                id: "Leonhard Euler",
                properties: {
                  contribution: "Mathematical Analysis",
                  birthYear: "1707",
                  nationality: "Swiss",
                  field: "Mathematics",
                  recognition: "Euler identity"
                }
              },
              {
                id: "Louis Pasteur",
                properties: {
                  contribution: "Germ Theory",
                  birthYear: "1822",
                  nationality: "French",
                  field: "Microbiology",
                  recognition: "Pasteurization"
                }
              },
              {
                id: "Archimedes",
                properties: {
                  contribution: "Archimedes Principle",
                  birthYear: "c. 287 BC",
                  nationality: "Greek",
                  field: "Mathematics and Physics",
                  recognition: "Buoyancy"
                }
              },
              {
                id: "Pythagoras",
                properties: {
                  contribution: "Pythagorean Theorem",
                  birthYear: "c. 570 BC",
                  nationality: "Greek",
                  field: "Mathematics",
                  recognition: "Pythagorean triple"
                }
              },
              {
                id: "Euclid",
                properties: {
                  contribution: "Elements",
                  birthYear: "c. 300 BC",
                  nationality: "Greek",
                  field: "Mathematics",
                  recognition: "Geometry"
                }
              },
              {
                id: "Johannes Kepler",
                properties: {
                  contribution: "Laws of Planetary Motion",
                  birthYear: "1571",
                  nationality: "German",
                  field: "Astronomy",
                  recognition: "Kepler laws"
                }
              },
              {
                id: "Michael Faraday",
                properties: {
                  contribution: "Electromagnetism",
                  birthYear: "1791",
                  nationality: "English",
                  field: "Physics",
                  recognition: "Faraday cage"
                }
              },
              {
                id: "Nicolaus Copernicus",
                properties: {
                  contribution: "Heliocentrism",
                  birthYear: "1473",
                  nationality: "Polish",
                  field: "Astronomy",
                  recognition: "Copernican revolution"
                }
              },
              {
                id: "Ernest Rutherford",
                properties: {
                  contribution: "Nuclear Model of the Atom",
                  birthYear: "1871",
                  nationality: "New Zealander",
                  field: "Physics",
                  recognition: "Rutherford model"
                }
              },
              {
                id: "Max Planck",
                properties: {
                  contribution: "Quantum Theory",
                  birthYear: "1858",
                  nationality: "German",
                  field: "Physics",
                  recognition: "Planck constant"
                }
              },
              {
                id: "Werner Heisenberg",
                properties: {
                  contribution: "Uncertainty Principle",
                  birthYear: "1901",
                  nationality: "German",
                  field: "Physics",
                  recognition: "Heisenberg uncertainty principle"
                }
              },
              {
                id: "Enrico Fermi",
                properties: {
                  contribution: "Nuclear Reactor",
                  birthYear: "1901",
                  nationality: "Italian",
                  field: "Physics",
                  recognition: "Fermi paradox"
                }
              },
              {
                id: "James Watson",
                properties: {
                  contribution: "DNA Structure",
                  birthYear: "1928",
                  nationality: "American",
                  field: "Genetics",
                  recognition: "Watson-Crick model"
                }
              },
              {
                id: "Francis Crick",
                properties: {
                  contribution: "DNA Structure",
                  birthYear: "1916",
                  nationality: "British",
                  field: "Molecular Biology",
                  recognition: "Watson-Crick model"
                }
              },
              {
                id: "Gregor Mendel",
                properties: {
                  contribution: "Genetics",
                  birthYear: "1822",
                  nationality: "Austrian",
                  field: "Genetics",
                  recognition: "Mendelian inheritance"
                }
              },
              {
                id: "Richard Feynman",
                properties: {
                  contribution: "Quantum Electrodynamics",
                  birthYear: "1918",
                  nationality: "American",
                  field: "Physics",
                  recognition: "Feynman diagrams"
                }
              },
              {
                id: "Erwin Schrödinger",
                properties: {
                  contribution: "Schrödinger Equation",
                  birthYear: "1887",
                  nationality: "Austrian",
                  field: "Physics",
                  recognition: "Schrödinger cat"
                }
              }
            ]

          this.highSizeConfigurationSettings = [
            {
              label: "Primary Node",
              color: "",
              description: "Scientists and Discoveries/Inventions",
              properties: [
                {
                  contribution: {
                    label: "Contribution",
                    color: "",
                    description: "Most known contibution in the lifetime"
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
    
    getMidSizeData() {
        return this.midSizeData;
      }
  
    getDefaultConfigurationSettings() {
        return this.defaultConfigurationSettings;
      }
    
    getMidSizeConfigurationSettings() {
        return this.midSizeConfigurationSettings;
      }
    
    getHighSizeConfigurationSettings() {
        return this.highSizeConfigurationSettings;
      }

      
}