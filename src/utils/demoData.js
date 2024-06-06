/**
 * Class responsible for providing data for stories.
 */ 
export class DemoData {
    /**
     * Initializes an instance of StoriesData with pre-defined network data.
     */  
    constructor() {
        this.ontologiesData = [
            {
              id: "https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:18248",
              properties: {
                type: "http://purls.helmholtz-metadaten.de/cmso/Element",
                hasMetadata: "21.T11981/73bfcca4-9f2b-4cfc-a003-30f5a51aab84",
                hasElementRatio: "1.0",
                hasSymbol: "Fe",
              }
            },
            {
              id: "sample:13cab138-c3a0-481d-8c09-2584e24f30ff_ChemicalSpecies",
              properties: {
                type: "http://purls.helmholtz-metadaten.de/cmso/ChemicalSpecies",
                hasElement: "https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:18248",
                hasElementRatio: "1.0",
                hasSymbol: "Fe",
              }
            },
            {
              id: "sample:b2421053-c682-4976-a9eb-49efbc4cb463_ChemicalSpecies",
              properties: {
                type: "http://purls.helmholtz-metadaten.de/cmso/ChemicalSpecies",
                hasElement: "https://www.ebi.ac.uk/chebi/searchId.do?chebiId=CHEBI:18248"
              }
            }
          ]

          this.singleObjectDemoData  = [{
            id: "AlbertEinstein",
            properties: {
              notableWork:"Theory of Relativity"
                }
            }
          ];

          this.multipleObjectsDemoData =[{
            id: "AlbertEinstein",
            properties: {
              notableWork:"Theory of Relativity"
                }
            },
            {
            id: "MarieCurie",
            properties: {
              notableWork:"Discovery of Radium"
                }
            },
            {
            id: "WilliamShakespeare",
            properties: {
              notableWork:"Hamlet"
                }
            }
          ];


          this.demoData =[{
            id: "AlbertEinstein",
            properties: {
              notableWork:"Theory of Relativity",
              type : "person"
                }
            },
            {
            id: "MarieCurie",
            properties: {
              notableWork:"Discovery of Radium",
              type : "person"
                }
            },
            {
            id: "WilliamShakespeare",
            properties: {
              notableWork:"Hamlet",
              type : "person"
                }
            },
            {
              id: "Theory of Relativity",
              properties: {
                year:"1905",
                type : "discovery"
                  }
              },
              {
                id: "Discovery of Radium",
                properties: {
                  year:"1898",
                  type : "discovery"
                    }
                },
                {
                  id: "Hamlet",
                  properties: {
                    year:"1898",
                    type : "discovery"
                      }
                  }
          ];
          this.demoConfigurations =
          [
            {
              label: "Primary Nodes",
              color: "brown",
              description: "Famous people",
              properties: [
                {
              
                  year: {
                    label: "Creation year",
                    color: "blue",
                    description: ""
                  },
                  notableWork: {
                    label: "Most famous work",
                    color: "green",
                    description: ""
                  }
                }
              ],
              primaryNodeConfigurations: [
                {
                  typeRegEx: "person",
                  nodeLabel: "Celebrity/artist",
                  nodeColor: "blue"
                },
                {
                  typeRegEx: "discovery",
                  nodeLabel: "Discovery/Invention",
                  nodeColor: "orange"
                }
              ]
            }
          ]
    }
    
      getOntologiesData(){
        return this.ontologiesData;
      }
      getSingleObjectDemoData(){
        return this.singleObjectDemoData;
      }
      getMultipleObjectsDemoData(){
        return this.multipleObjectsDemoData;
      }
      getDemoData(){
        return this.demoData;
      }
      getDemoCongigurations(){
        return this.demoConfigurations;
      }
}