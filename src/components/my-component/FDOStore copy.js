import { FDO} from './FDO.js'; // Import the FDOStore class

class FDOStore {

    
    constructor(initialFDOData = []) {
        this.fdos = new Map();
        this.links = []; // Step 1: Create a links array to store the links
        this.proplength = 0;
        this.props=[];

        for (const fdoData of initialFDOData) {
            const fdo = new FDO(fdoData.label,fdoData.pid,fdoData.properties); // Assuming FDO can be constructed from its data
            this.addFdo(fdo);
        }
    }

    addFdo(fdo) {
        this.fdos.set(fdo.getPid(), fdo);
    }

    getPids() {
        return Array.from(this.fdos.keys());
    }


    getFdo(pid) {
        return this.fdos.get(pid);
    }
    //helper function to get properties 
    getProperties() {
        let allProperties = [];
        this.fdos.forEach((fdo, fdoKey) => {
            let properties = fdo.getProperties(); // Assuming getProperties is a method of FDO class
            allProperties.push(properties);
        });
        return allProperties;
    }


toDataWithClusters(excludedprops) {
    let data = { "nodes": [], "links": [] };
    let pids = this.getPids();
    let allPropertyValues = [];
    let primaryNodeIds = []; // Store IDs of primary nodes
    let primaryNodePropertyMap = {}; // Map primary node IDs to their properties
    const clusterCount =pids.length;

    // Generate clusters
    // Assuming you want to create a cluster for each existing FDO in the store
    for (const [pid, fdo] of this.fdos.entries()) {
        let node = fdo.toNode();
        data.nodes.push(node);
        primaryNodeIds.push(node.id);
        primaryNodePropertyMap[node.id] = Object.values(node.props);
           // Create secondary nodes and links within the cluster
           for (const [propKey, propValue] of Object.entries(node.props)) {
            if (!excludedprops.includes(propKey)) {
                // Create secondary nodes only for properties not in the exclusion list
                let secondaryNode = {
                    id: `secondary_${pid}_${propKey}`,
                    [propKey]: propValue, // Copy the property to the secondary node
                    // Define other properties for secondary nodes
                };
                data.nodes.push(secondaryNode);

                // Create a link between the primary node and the secondary node
                let link = {
                    source: node.id,
                    target: secondaryNode.id,
                    category: "secondary",
                    name: propKey,
                };
                data.links.push(link);
            }}
        
    }

    // Populate allPropertyValues after data.nodes is populated
    // data.nodes.forEach(node => {
    //     for (const propValue of Object.values(node.props)) {
    //         allPropertyValues.push(propValue);
    //     }
    // });

    // // Create primary links between primary nodes
    // const probability = 0.09;
    // const primaryNodesWithSecondaryLinks = 10; // Adjust the number of primary nodes with secondary links
    // for (let i = 0; i < primaryNodesWithSecondaryLinks; i++) {
    //     const sourcePrimaryNodeId = primaryNodeIds[i];
    //     if (Math.random() < probability) {
    //         for (let j = i + 1; j < primaryNodesWithSecondaryLinks; j++) {
    //             const targetPrimaryNodeId = primaryNodeIds[j];
    //             let link = {
    //                 "source": sourcePrimaryNodeId,
    //                 "target": targetPrimaryNodeId,
    //                 "category": "primary"
    //             };
    //             data.links.push(link);
    //         }
    //     }
    // }

    return data;
}


    getPrimaryNodesData() {
        let data = { "nodes": [], "links": [] };

        // Add only primary nodes
        this.fdos.forEach((fdo, fdoKey) => {
            let node = fdo.toNode();
            if (node.type === "primaryNodes") {
                data.nodes.push(node);
            }
        });

        return data;
    }
    getPrimaryNodesWithLinksData(includedProperties = []) {
        let data = { "nodes": [], "links": [] };
    
        // Add only primary nodes
        const primaryNodeIds = []; // To store primary node IDs for later link creation
        const primaryNodeMap = {}; // To store primary nodes for later link creation
    
        this.fdos.forEach((fdo, fdoKey) => {
            let node = fdo.toNode();
            if (node.type === "primaryNodes") {
                if (includedProperties.length > 0) {
                    node.props = Object.fromEntries(Object.entries(node.props).filter(([key]) => includedProperties.includes(key)));
                }
                primaryNodeIds.push(node.id);
                primaryNodeMap[node.id] = node;
                data.nodes.push(node);
            }
        });
    
        const probability=0.08;
        const primaryNodesWithSecondaryLinks = 10; // Adjust the number of primary nodes with secondary links
        for (let i = 0; i < primaryNodesWithSecondaryLinks; i++) {
            const sourcePrimaryNodeId = primaryNodeIds[i];
            if( Math.random() < probability){
                for (let j = i + 1; j < primaryNodesWithSecondaryLinks; j++) {
                    const targetPrimaryNodeId = primaryNodeIds[j];
                    let link = { "source": sourcePrimaryNodeId, "target": targetPrimaryNodeId, "category": "primary" };
                    data.links.push(link);
                }
    
            }
          
        }
    
        return data;
        }
    

}

export { FDOStore };
    