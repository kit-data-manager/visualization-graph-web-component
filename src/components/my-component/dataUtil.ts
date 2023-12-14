export class PrepareData {
    private showPrimaryLinks: boolean;
    private showAttributes: boolean;
    constructor(showPrimaryLinks: boolean, showAttributes: boolean) {
        this.showPrimaryLinks = showPrimaryLinks;
        this.showAttributes = showAttributes;
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
