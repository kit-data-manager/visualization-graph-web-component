/**
 * Class responsible for preparing and transforming data for graph visualization.
 */
export class PrepareData {
  private showPrimaryLinks: boolean;
  private showAttributes: boolean;

  /**
   * Creates an instance of PrepareData.
   *
   * @constructor
   * @param {boolean} showPrimaryLinks - Whether to show primary links in the graph.
   * @param {boolean} showAttributes - Whether to show attributes in the graph.
   */
  constructor(showPrimaryLinks: boolean, showAttributes: boolean) {
    this.showPrimaryLinks = showPrimaryLinks;
    this.showAttributes = showAttributes;
  }

  /**
   * Retrieves default data for the component.
   *
   * @return {any[]} Default data for the component.
   */
  getDefaultComponentData() {
    return [
      {
        id: 'Einstein',
        properties: {
          name: 'Albert Einstein',
          contribution: 'Theory of Relativity',
          associatedArtifact: 'einstein-manuscript',
          field: 'Physics',
          birthYear: '1879',
          deathYear: '1955',
          type: 'person'
        },
      },
      {
        id: 'Einstein-Manuscript',
        properties: {
          title: 'Original Manuscript of Theory of Relativity',
          createdBy: 'Einstein',
          location: 'Berlin',
          yearCreated: '1915',
          type: 'manuscript',
        },
      },
      {
        id: 'Newton',
        properties: {
          name: 'Isaac Newton',
          contribution: 'Laws of Motion',
          associatedArtifact: 'Newton-Apple',
          field: 'Mathematics and Physics',
          birthYear: '1643',
          deathYear: '1727',
          type: 'person'
        },
      },
      {
        id: 'Newton-Apple',
        properties: {
          title: 'Newton’s Apple',
          description: "Symbolic of Newton's discovery of gravity",
          associatedWith: 'Newton',
          location: 'Woolsthorpe Manor, England',
          year: 'Around 1666',
          type: 'symbolic object',
        },
      },
      {
        id: 'Da-Vinci',
        properties: {
          name: 'Leonardo da Vinci',
          contribution: 'Mona Lisa',
          associatedArtifact: 'mona-lisa',
          field: 'Art and Science',
          birthYear: '1452',
          deathYear: '1519',
          type: 'person'
        },
      },
      {
        id: 'Mona-Lisa',
        properties: {
          title: 'Mona Lisa',
          paintedBy: 'Da-Vinci',
          location: 'Louvre Museum, Paris',
          yearCreated: '1503',
          type: 'painting'
        },
      },
    ];
  }

  /**
   * Sets the value of 'showAttributes'.
   *
   * @param {boolean} value
   */
  setShowAttributes(value: boolean) {
    this.showAttributes = value;
  }

  /**
   * Transforms input data into nodes and links for graph visualization.
   *
   * @param {any[]} data - Input data in JSON format.
   * @param {string[]} excludeProperties - Properties to be excluded from the transformation.
   * @return {{ nodes: any[], links: any[], primaryNodeIds: string[] }} Transformed nodes and links.
   */
  public transformData(data: any[], excludeProperties: string[]) {
    const nodes = [];
    const primaryNodeIds = [];
    const allLinks = [];
    let links = [];
    //Primary nodes creation
    for (const item of data) {
      const node = {
        id: item.id,
        props: [],
        name: item.id,
        category: 'non_attribute',
        type: item.properties.type
      };
      primaryNodeIds.push(item.id);
      nodes.push(node);
    }
    for (const item of data) {
      for (const [propKey, propValue] of Object.entries(item.properties)) {
        //Primary links (between FDOs) as idList has FDOs and if propvalue is among those ids that means it is a primary link.
        if (primaryNodeIds.includes(propValue)) {
          const link = {
            source: item.id,
            target: propValue,
            relationType: propKey,
            category: 'non_attribute',
            visible: this.showPrimaryLinks,
          };
          allLinks.push(link);
        }
        //Attribute nodes and links (if it is not in the property value it should be an ordinary node)
        else {
          if (!excludeProperties.includes(propKey) && this.showAttributes) {
            const secondaryNode = {
              id: `${item.id}_${propValue}`,
              [propKey]: propValue,
              name: propValue,
              category: 'attribute',
              type: item.type
            };
            nodes.push(secondaryNode);
            const link = {
              source: item.id,
              target: secondaryNode.id,
              category: 'attribute',
              relationType: propKey,
              visible: true,
            };
            allLinks.push(link);
          }
        }
      }
      // Filter links based on visibility
      links = allLinks.filter(link => link.visible);
    }
    return { nodes, links, primaryNodeIds };
  }
}
