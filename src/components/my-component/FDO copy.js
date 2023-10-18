class FDO {
    constructor(customName, pid, properties = {}) {
        this.customName = customName;
        this.pid = pid;
        this.properties = properties;

    }
    setLabel(label) {
        this.label = label;
    }

    getLabel() {
        return this.label;
    }
    setType(type) {
        this.type = type;
    }

    getType(type) {
        this.type = type;
    }

    setGroup(group) {
        this.group = group;
    }

    getGroup() {
        return this.group;
    }

    setPid(pid) {
        this.pid = pid;
    }

    getPid() {
        return this.pid;
    }

    // setCustomName(customName) {
    //     this.customName = customName;
    // }

    // getCustomName() {
    //     return this.customName;
    // }

    // addProperty(key, value) {
    //     this.properties.push({ "key": key, "value": value });
    // }

    // getProperties() {
    //     return this.properties;
       
    // }
    // fromTypedPidMaker(document) {
    //     let result = new FDO();
    //     result.pid = document.pid;
    //     for (let i = 0; i < document.entries; i++) {
    //         this.addProperty(document.entries[i].key, document.entries[id].value);
    //     }
    //     return result;
    // }

    // fromJson(formOutput, known_types) {
    //     let result = new FDO();
    //     result.pid = "(:tba) - " + new Date().getTime();
    //     let labelMap = known_types.map(a => a.label);
    //     let formOutputObject = JSON.parse(formOutput);
    //     let keys = Object.keys(formOutputObject);
    //     result.setCustomName(formOutputObject["customName"])
    //     for (let i = 0; i < keys.length; i++) {
    //         //obtain PID from schema
    //         let pid = model['properties'][keys[i]]['pid'];
    //         //check if attribute value is a digitalObjectType label
    //         if (labelMap.indexOf(formOutputObject[keys[i]]) >= 0) {
    //             //We have a type label, set final record value to PID for digitalObjectType label
    //             result.addProperty(pid, known_types.slice(labelMap.indexOf(formOutputObject[keys[i]]), 1).at(0)['pid']);
    //         } else {
    //             //check for checksum
    //             if (pid == '21.T11148/82e2503c49209e987740') {
    //                 //process checksum
    //                 let checksumValue = formOutputObject[keys[i]];
    //                 let checksumAlg = undefined;
    //                 switch (checksumValue.length) {
    //                     case 32: {
    //                         //md5
    //                         checksumAlg = "md5";
    //                         break;
    //                     }
    //                     default: {
    //                         checksumAlg = "sha" + (4 * checksumValue.length);
    //                     }
    //                 }
    //                 let checksumRecordValue = {};
    //                 checksumRecordValue[checksumAlg + "sum"] = checksumValue;
    //                 result.addProperty(pid, checksumRecordValue);
    //             } else if (pid == '21.T11148/b415e16fbe4ca40f2270') {
    //                 //topic
    //                 result.addProperty(pid, formOutputObject[keys[i]]);
    //             } else {
    //                 //we have another attribute value, check if valid and set if true
    //                 if (formOutputObject[keys[i]]) {
    //                     result.addProperty(pid, formOutputObject[keys[i]]);
    //                 }
    //             }
    //         }
    //     }

    //     return result;
    // }

    toNode() {
        let node = {};
        node.id = this.pid;
        node.label = this.label;
        node.group = this.group;
        node.type = this.type;
        node.props = []; 
        
        if (this.properties && typeof this.properties === 'object') {
            for (const [key, value] of Object.entries(this.properties)) {
                    node.props[key] = value; // Copy other properties to node.props
                }
            

    }
        // console.log('node.props',node.props)
        // for (const [key, value] of Object.entries(this.properties)) {
        //     if (key == "21.T11148/1c699a5d1b4ad3ba4956") {
        //         node.type = value;
        //         break;
        //     }
        //     else {
        //         node.props[key] = value; // Copy other properties to node.props
        //     }
        // }
        node.customName = this.customName;
    

        // let props = {};
        // const propertyKeys = Object.keys(this.properties);
   
        // for (let i = 0; i < propertyKeys.length; i++) {
        //     const key = propertyKeys[i];
        //     const value = this.properties[key];
            
        //     console.log('Inside loop - Key:', key, 'Value:', value);
        //     props[key] = value;
        // }
        // node.props = props;
        // console.log('Props after loop:', props);

        // for (const [key, value] of Object.entries(this.properties)) {
        //     console.log('Inside loop - Key:');

        //     props[key] = key;
        //     // props[value] = value;
        // }
        // node.props = props;
        // console.log('Props after loop:', props);
    
        // console.log('node.props', node.props);
        

        

        return node;
    }
}
export { FDO };