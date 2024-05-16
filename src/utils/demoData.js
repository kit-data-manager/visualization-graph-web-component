/**
 * Class responsible for providing data for stories.
 */ 
export class DemoData {
    /**
     * Initializes an instance of StoriesData with pre-defined network data.
     */  
    constructor() {
        this.firstDemoData = [
            {
                id: "21.T11981/6ab464ed-978b-4996-876f-f68ea913a308",
                properties: {
                    kernelInformationProfile: "21.T11148/863d938d632b53d62d52",
                    hasMetadata: "21.T11981/73bfcca4-9f2b-4cfc-a003-30f5a51aab84",
                    digitalObjectLocation: "https://b2share.eudat.eu/api/files/5fc88ad5-2f13-483c-8b80-a5862c91dbbb/Biological.tar#L7_dc3e2161576ff12aa04a2f6a4f7bb69a.jpg",
                    version: "1.0.0",
                    digitalObjectType:"21.T11148/1a1e620666cb1713acde",
                    contact: "https://www.scc.kit.edu/personen/14958.php"
                }
            },
            {
                id: "21.T11981/73bfcca4-9f2b-4cfc-a003-30f5a51aab84",
                properties: {
                    kernelInformationProfile: "21.T11148/828b74888f3774d97f73",
                    digitalObjectLocation: "http://mm3.datamanager.kit.edu:8040/api/v1/metadata/SEMDataSetV2",
                    dateCreated: "20220605 19:48:04 UTC",
                    checksum: "653e874977b3695aac75ef20f237cfc25b5cfff1e72bab0c5cbec5ce0eb7fa3b0a6b29049cbfcf0d2e6f961c7a2d5c5ad1ac2b7d83db194f7aba6ab2518ddc9f" 
                }
            }
        ];

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
    }

    getFirstDemoData(){
        return this.firstDemoData;
      }
      getOntologiesData(){
        return this.ontologiesData;
      }
}