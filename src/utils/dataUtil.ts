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
                pid: "21.11152/ba06424b",
                properties: {
                    profile: "KIP",
                    hasMetadata: "21.11152/ba06424b-17c7-4e3f-9a2e-8d09cf797be3",
                    digitalObjectType: "object",
                    digitalObjectLocation: "github",
                    license: "cc4",
                    checksum: "md5sum",
                    dateCreated: "24-04-2010",
                    dataModified: "24-04-2020"
                }
            },
            {
                pid: "21.11152/ba06424b-17c7-4e3f-9a2e-8d09cf797be3",
                properties: {
                    profile: "HMCProfile",
                    licence: "cc4",
                    digitalObjectType: 'object',
                    digitalObjectLocation: 'github',
                    isMetada:'21.11152/ba06424b',
                    checksum: 'md5sum',
                    dateCreated: '24-04-2010',
                    dataModified: '24-04-2020'
                }
            },
            {
                pid: "21.11152/ba06424b-17c7-4e3f",
                properties: {
                    profile: "AachenProfile",
                    // hasMetadata: "21.11152/dd01234b-22f8-4b2f-b66e-9a34df554a4f",
                    digitalObjectType: 'object',
                    digitalObjectLocation: 'github',
                    license: 'cc4',
                    checksum: 'md5sum',
                    dateCreated: '24-04-2010',
                    dataModified: '24-04-2020'
                }
            },
            {
                pid: "21.11152/dd01234b-22f8-4b2f-b66e-9a34df554a4f",
                properties: {
                    profile: "Data Analysis",
                    licence: "cc4",
                    digitalObjectType: 'object',
                    digitalObjectLocation: 'github',
                    checksum: 'md5sum',
                    dateCreated: '24-04-2010',
                    dataModified: '24-04-2020'
                }
            },
            {
                pid: "21.11152/ee05678b-33c9",
                properties: {
                    profile: "AachenProfile",
                    hasMetadata: "21.11152/ee05678b-33c9-4b1f-a99f-1d62ef657abc",
                    digitalObjectType: 'object',
                    digitalObjectLocation: 'github',
                    license: 'cc4',
                    checksum: 'md5sum',
                    dateCreated: '24-04-2010',
                    dataModified: '24-04-2020'
                }
            },
            {
                pid: "21.11152/ee05678b-33c9-4b1f-a99f-1d62ef657abc",
                properties: {
                    profile: "HMCProfile",
                    licence: "MIT",
                    digitalObjectType: 'object',
                    digitalObjectLocation: 'github',
                    license: 'cc4',
                    checksum: 'md5sum',
                    dateCreated: '24-04-2010',
                    dataModified: '24-04-2020'
                }
            }
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
                id: item.pid,
                props: [],
                category: 'non_attribute'
            };
            primaryNodeIds.push(item.pid);
            nodes.push(node);
        }
        for (const item of data) {
            for (const [propKey, propValue] of Object.entries(item.properties)) {
                //Primary links (between FDOs) as pidList has FDOs and if propvalue is among those pids that means it is a primary link.
                if (primaryNodeIds.includes(propValue)) {
                    const link =
                    {
                        source: item.pid,
                        target: propValue,
                        relationType: propKey,
                        category: 'non_attribute',
                        visible: this.showPrimaryLinks
                    }
                    allLinks.push(link);
                }
                //Attribute nodes and links (if it is not in the property value it should be an ordinary node)
                else {
                    if (!excludeProperties.includes(propKey) && this.showAttributes) {
                        const secondaryNode =
                        {
                            id: `${item.pid}_${propValue}`,
                            [propKey]: propValue,
                            category: 'attribute'
                        }
                        nodes.push(secondaryNode);
                        const link =
                        {
                            source: item.pid,
                            target: secondaryNode.id,
                            category: 'attribute',
                            relationType: propKey,
                            visible: true
                        }
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
