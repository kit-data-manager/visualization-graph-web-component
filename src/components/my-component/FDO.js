class FDO {
    constructor(customName, pid, properties = {}) {
        this.customName = customName;
        this.pid = pid;
        this.properties = properties;
    }
    setPid(pid) {
        this.pid = pid;
    }
    getPid() {
        return this.pid;
    }
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
        node.customName = this.customName;
        return node;
    }
}
export { FDO };