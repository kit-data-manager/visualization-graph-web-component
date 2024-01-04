export class PrepareData {
    private showPrimaryLinks: boolean;
    private showAttributes: boolean;
    constructor(showPrimaryLinks: boolean, showAttributes: boolean) {
        this.showPrimaryLinks = showPrimaryLinks;
        this.showAttributes = showAttributes;
    }
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
                    checksum: 'md5sum',
                    dateCreated: '24-04-2010',
                    dataModified: '24-04-2020'
                }
            },
            {
                pid: "21.11152/ba06424b-17c7-4e3f",
                properties: {
                    profile: "AachenProfile",
                    hasMetadata: "21.11152/dd01234b-22f8-4b2f-b66e-9a34df554a4f",
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
    setShowAttributes(value: boolean)
    {
        this.showAttributes = value;
    }

    public transformData(data: any[], excludedProperties: string[]) {
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
                        type: propKey,
                        category: 'non_attribute',
                        visible: this.showPrimaryLinks
                    }
                    allLinks.push(link);
                }
                //Attribute nodes and links (if it is not in the property value it should be an ordinary node)
                else {
                    if (!excludedProperties.includes(propKey) && this.showAttributes) {
                        const secondaryNode =
                        {
                            id: `secondary_${item.pid}_${propKey}`,
                            [propKey]: propValue,
                            category: 'attribute'
                        }
                        nodes.push(secondaryNode);
                        const link =
                        {
                            source: item.pid,
                            target: secondaryNode.id,
                            category: 'attribute',
                            visible: true
                        }
                        allLinks.push(link);
                    }

                }
            }
            links = allLinks.filter(link => link.visible);
        }
        return { nodes, links, primaryNodeIds };
    }

}
