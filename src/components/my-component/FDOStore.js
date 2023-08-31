import { FDO} from './FDO.js'; // Import the FDOStore class

class FDOStore {

    
    constructor() {
        this.fdos = new Map();
        this.links = []; // Step 1: Create a links array to store the links
        this.proplength = 0;
        this.props=[];
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


    generateClusters(props) {
        // console.log('props inside MEE', props); // Use props here

        // console.log('props inside clusture ', this.includedProperties);
        // console.log('generateClusters is called')
        // props=this.props;
        // this.props=['contact','url','KIP','location','version','checksum'];
        this.proplength=props.length;
        // console.log('props inside clusture ', this.proplength);
        //primary Nodes
        for (let i = 0; i < 10; i++) {
            const baseNodeId = `${i}`;
            let baseFDO = new FDO(` ${baseNodeId}`, baseNodeId);
            baseFDO.setLabel(` ${baseNodeId}`);
            baseFDO.setGroup(`Group 15`);
            baseFDO.setType('primaryNodes');
            this.addFdo(baseFDO);

        //seconday nodes = attributes
            for (let j = 0; j < this.proplength; j++) {
                const connectedNodeId = `${i}_${j}`;
                let connectedFDO = new FDO(`${connectedNodeId}`, connectedNodeId);
                connectedFDO.setLabel(`${connectedNodeId}`);
                connectedFDO.setGroup(`Group ${j}`);
                connectedFDO.setType('attribute');
                // connectedFDO.addProperty(`${connectedNodeId}`,`${connectedNodeId}`);
                   // Add properties based on the propertyNames list
            for (const properties of props) {
                connectedFDO.addProperty(properties, properties);
            }

                this.addFdo(connectedFDO);
            }
        }
    }


    toData() {

        let data = { "nodes": [], "links": [] };
        let pids = this.getPids();
        let allPropertyValues = [];
        let primaryNodeIds = []; // Store IDs of primary nodes
        let primaryNodePropertyMap = {}; // Map primary node IDs to their properties
        this.fdos.forEach((fdo, fdoKey) => {
            let node = fdo.toNode();

            data.nodes.push(node);

        if (node.type === "primaryNodes") {
            primaryNodeIds.push(node.id);
            primaryNodePropertyMap[node.id] = Object.values(node.props);

        }
        });
        // Populate allPropertyValues after data.nodes is populated
        data.nodes.forEach(node => {
            for (const propValue of Object.values(node.props)) {
                allPropertyValues.push(propValue);
            }
        });

        let nodeIds = data.nodes.map(node => node.id);
        // console.log('all nodeids ', nodeIds )
 
        // Create secondary links between primary nodes and their attributes (secondary nodes)
        // console.log('primaryNodeIds', primaryNodeIds)
        primaryNodeIds.forEach(primaryNodeId => {
            for (let j = 0; j < this.proplength; j++) { // Loop through attribute IDs
                const secondaryNodeId = `${primaryNodeId}_${j}`;
                let link = { "source": primaryNodeId, "target": secondaryNodeId, "category": "secondary", "name":this.props[j]};
                data.links.push(link);
            }
        });

    // Create primary  links between a few primary nodes
   const probability=0.09;
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
    