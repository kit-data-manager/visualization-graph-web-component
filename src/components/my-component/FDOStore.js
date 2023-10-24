// // import { FDO } from './FDO.js'; // Import the FDOStore class

// class FDOStore {
//     constructor(initialFDOData = []) {
//         this.fdos = new Map();
//         this.links = []; // Step 1: Create a links array to store the links
//         this.proplength = 0;
//         this.props = [];
//         for (const fdoData of initialFDOData) {
//             const fdo = {
//                 customName: fdoData.label, // Assuming fdoData.label represents customName
//                 pid: fdoData.pid,
//                 properties: fdoData.properties // Assuming fdoData.properties is an object
//             };
            
//             // Now, you can use the 'fdo' object directly
//             this.addFdo(fdo);
//         }
        
//     }
//     addFdo(fdo) {
//         this.fdos.set(fdo.pid, fdo);
//     }
//     getPids() {
//         return Array.from(this.fdos.keys());
//     }
//     toDataWithClusters(excludedprops) {
//         let data = { "nodes": [], "links": [] };
//         let primaryNodeIds = []; // Store IDs of primary nodes
//         let primaryNodePropertyMap = {}; // Map primary node IDs to their properties
    
//         // Generate clusters
//         // Assuming you want to create a cluster for each existing node in the store
//         for (const fdoData of this.fdos.values()) {
//             let node = {
//                 id: fdoData.pid,
//                 label: fdoData.label,
//                 group: fdoData.group,
//                 type: fdoData.type,
//                 props: [],
//             };
            
//             if (fdoData.properties && typeof fdoData.properties === 'object') {
//                 for (const [propKey, propValue] of Object.entries(fdoData.properties)) {
//                     if (!excludedprops.includes(propKey)) {
//                         // Create secondary nodes only for properties not in the exclusion list
//                         let secondaryNode = {
//                             id: `secondary_${fdoData.pid}_${propKey}`,
//                             [propKey]: propValue, // Copy the property to the secondary node
//                             // Define other properties for secondary nodes
//                         };
//                         data.nodes.push(secondaryNode);
    
//                         // Create a link between the primary node and the secondary node
//                         let link = {
//                             source: node.id,
//                             target: secondaryNode.id,
//                             category: "secondary",
//                             name: propKey,
//                         };
//                         data.links.push(link);
//                     }
//                 }
//             }
    
//             data.nodes.push(node);
//             primaryNodeIds.push(node.id);
//             primaryNodePropertyMap[node.id] = Object.values(node.props);
//         }
    
//         return data;
//     }
    

// }

// export { FDOStore };
