let store = new FDOStore();
let currentlyClicked = null;
let clicked = false;

// store.generateClusters(includedProperties);
// store.generateClusterLinks();
let data = store.toData(includedProperties);

document.addEventListener("DOMContentLoaded", function () {
    if (typeof visualizationMode !== "undefined") {
        const includedPropertiesInput = document.getElementById("includedProperties");
        const includedProperties = includedPropertiesInput.value.split(",");
        console.log('includedProperties', includedProperties)
        store.generateClusters(includedProperties); // Generate clusters using the included properties
        updateVisualization(visualizationMode);
    }
});

// Set up the SVG container
const svg = d3.select("#graph")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr('marker-end', 'url(#arrow)')

    // .attr("transform","scale(0.2,0.2)")
    ;
const width = +svg.style('width').replace('px', '');
const height = +svg.style('height').replace('px', '');
// Create a color scale for node groups
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Create a force simulation
const simulation = d3.forceSimulation(data.nodes)
    .force("link", d3.forceLink(data.links).id(d => d.id).distance(50))
    .force("charge", d3.forceManyBody().strength(-90))
    .force("x", d3.forceX(width / 2))
    .force("y", d3.forceY(height / 2));




// Create the links
const links = svg.selectAll(".link")
    .data(data.links)
    .enter()
    .append("line")
    .attr("class", "link")
    .attr("opacity", "1")
    .attr("opacity", "1")
    .attr("category", d => d.category)  // Add a category attribute to identify link type




// Create the nodes
const nodes = svg.selectAll(".node")
    .data(data.nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", 10)
    .attr("fill", d => colorScale(d.group))
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .call(drag(simulation))
// Step 1: Check if the clicked node is a primary node (based on our data model).


// The unhighlight function
// Create the labels for nodes
const nodeLabels = svg.selectAll(".label")
    .data(data.nodes)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("dx", 15)
    .attr("dy", 5)
    .text(d => d.label)

// Define the tick function
const ticked = () => {
    links
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);


    nodes
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

    nodeLabels
        .attr("x", d => d.x)
        .attr("y", d => d.y);


    if (zoomTransform) {
        links.attr("transform", zoomTransform);
        nodes.attr("transform", zoomTransform);
        nodeLabels.attr("transform", zoomTransform);
    }
};
// Enable dragging behavior for nodes

function drag(simulation) {
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
    }

    function dragged(event, d) {
        d.x = event.x;
        d.y = event.y;
        ticked();  // Manually call the ticked function
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
    }

    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

// Run the simulation
// simulation.on("tick", ticked);

// Tooltip functions
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

function showTooltip(event, d) {
    tooltip.transition().duration(200).style("opacity", 0.9);
    tooltip.html("Node ID: " + d.id + "<br>Label: " + d.label + "<br>Group: " + d.group)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 30) + "px");
}

function updateTooltip(event) {
    tooltip.style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 30) + "px");
}

function hideTooltip() {
    tooltip.transition().duration(200).style("opacity", 0);
}

let zoomTransform = null;

svg.call(d3.zoom()
    .extent([[0, 0], [width, height]])
    .scaleExtent([0, 8])
    .on("zoom", zoomed));

function zoomed(event) {
    zoomTransform = event.transform;
    links.attr("transform", zoomTransform);
    nodes.attr("transform", zoomTransform);
    nodeLabels.attr("transform", zoomTransform);
}
function updateVisualization(mode, includedProperties) {


    // Clear the existing SVG content
    svg.selectAll("*").remove();
    // let includedProperties = document.getElementById("includedProperties").value.split(",");

    let data;
    switch (mode) {
        case "primary":
            data = store.getPrimaryNodesData(includedProperties);
            break;
        case "all":
            data = store.toData(includedProperties);
            break;
        case "primaryWithLinks":
            data = store.getPrimaryNodesWithLinksData(includedProperties);
            break;
        default:
            console.error("Invalid visualization mode:", mode);
            return;
    }

    // Create a force simulation
    const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).id(d => d.id).distance(70)) // Ensure the id accessor is correct
        .force("charge", d3.forceManyBody().strength(-90))
        .force("x", d3.forceX(width / 2))
        .force("y", d3.forceY(height / 2));


    // Create the arrow markers
    svg.append("defs")
        .append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", [0, -5, 10, 10])
        .attr("refX", 18)  // Controls the position of the arrowhead relative to the end of the line
        .attr("refY", 0)
        .attr("markerWidth", 5)
        .attr("markerHeight", 6)
        .attr("orient", "auto-start-reverse")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")  // The path that defines the arrowhead shape
        .attr("fill", "#999");

    svg.select("defs")
        .append("marker")
        .attr("id", "arrowhead2")
        .attr("viewBox", [0, -5, 10, 10])
        .attr("refX", 18)  // Controls the position of the arrowhead relative to the end of the line
        .attr("refY", 0)
        .attr("markerWidth", 5)
        .attr("markerHeight", 6)
        .attr("orient", "auto-start-reverse")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")  // The path that defines the arrowhead shape
        .attr("fill", "#999");  // Change the fill color for the second arrow


    // Create the highlighted arrow markers
    svg.select("defs")
        .append("marker")
        .attr("id", "arrowhead-highlighted")
        .attr("viewBox", [0, -5, 10, 10])
        .attr("refX", 15)  // Controls the position of the arrowhead relative to the end of the line
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto-start-reverse")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")  // The path that defines the arrowhead shape
        .attr("fill", '#FF0000');  // Change the fill color for highlighted state

    // Create the links
    const links = svg.selectAll(".link")
        .data(data.links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("opacity", "1")
        .attr("category", d => d.category)  // Add a category attribute to identify link type
        // .style("stroke", d => d.category === "primary" ? "#999" : "#ccc")  // Change the stroke color based on category
        .style("stroke-width", d => d.category === "primary" ? 2 : 1)  // Change the stroke width based on category
        .attr("marker-end", d => d.category === "primary" ? "url(#arrowhead)" : null)
        .attr("marker-start", d => d.category === "primary" ? "url(#arrowhead)" : null);
    // .on("click", function (event, d) {
    //     clicked = true;
    //     // un-highlight currently clicked nodes
    //     unHighlight();
    //     // highlight new clicked node
    //     highlightConnectedPrimaryNodes(event, d);
    //     // set the new clicked node
    //     currentlyClicked = d;
    // });

    // Create the nodes
    const nodes = svg.selectAll(".node")
        .data(data.nodes)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", 10)
        .attr("fill", d => colorScale(d.group))
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .call(drag(simulation))
        // .on("mouseover", function (event, d) {
        //     showTooltip(event, d);
        //     // highlightConnected(event, d);
        //     if (!currentlyClicked) {
        //         highlightConnected(event, d);
                
        //     }
        // })
        .on("click", function (event, d) {
            clicked = true;
            // un-highlight currently clicked nodes
            unHighlight();
            // highlight new clicked node
            highlightConnectedPrimaryNodes(event, d);
            // set the new clicked node
            currentlyClicked = d;
            // Add a class to the link
            d3.select(this).classed("link-highlighted", true);
            d3.select(this).attr("marker-end", "url(#arrowhead-highlighted)");

        }).on("mouseover", function (event, d) {
            // If a node has been clicked previously and it's not the current node being hovered over
            if (clicked && currentlyClicked && currentlyClicked !== d) {
                // Un-highlight previously highlighted nodes and links
                // unHighlight();

                // Highlight connected nodes and links of the hovered node
                highlightConnectedNodesAndLinks(event, d);

                  // Highlight connected links
    const connectedLinks = data.links.filter(link =>
        link.source.id === d.id || link.target.id === d.id
    );


    function highlightConnected(event, d) {
        d3.select(event.currentTarget).classed("primary", true);
        links.each(function (l) {
            if (l.category === 'non_attribute' && (l.source.id === d.id || l.target.id === d.id)) {
                d3.select(this).classed("primary", true);
                nodes.filter(n => n.id === l.source.id || n.id === l.target.id).classed("secondary", true);
                d3.select(this).attr("opacity", "1");
            }
        });
    }

    connectedLinks.forEach(link => {
        d3.select(`.link[source="${link.source.id}"][target="${link.target.id}"]`)
            .classed("link-highlighted", true)
            .attr("marker-end", "url(#arrowhead-highlighted)");
        d3.select(`.link[source="${link.target.id}"][target="${link.source.id}"]`)
            .classed("link-highlighted", true)
            .attr("marker-end", "url(#arrowhead-highlighted)");
    });

            }
        })
        .on("mouseout", function (event, currentlyClicked) {
            if (currentlyClicked && clicked) {
                // Un-highlight nodes and links when mouse moves out of the node
                unHighlightOtherThanSelected();
                // Highlight connected nodes and links of the clicked node
                highlightConnectedNodesAndLinks(event, currentlyClicked);
            } else {
                // Un-highlight nodes and links when mouse moves out of the node
                unHighlight();
            }
        }).on("click.secondary", function (event, d) {
            if (d.type === "attribute") {
                // Trigger the display of the component here
                displayComponent(d);
            }
        });

    function displayComponent(d) {
        // Assuming you have a container element with the id "component-container"
        const componentContainer = document.getElementById("component-container");

        // Create the element for the component
        const componentElement = document.createElement("display-magic");
        componentElement.setAttribute("value", d.id); // Set the value attribute

        // Clear the container and add the component
        componentContainer.innerHTML = "";
        componentContainer.appendChild(componentElement);
    }

    function unHighlightOtherThanSelected() {
        nodes.classed("primary", false);
        // nodes.classed("secondary", false);
        // links.classed("primary", false);
        links.classed("secondary", false);
    }
    // .on("mouseout", function (event, d) {
    //     if (currentlyClicked) return;
    //     unHighlight();
    //     // hideTooltip();
    //     // Hide the links again
    //     links.each(function (l) {
    //         // Change opacity only for 'non_attribute' links
    //         if (l.category === 'primary' && (l.source.id === d.id || l.target.id === d.id)) {
    //             d3.select(this).attr("opacity", "0");
    //         }
    //     })
    // });

    function highlightConnectedNodesAndLinks(event, clickedNode) {
        // Highlight the clicked node
        d3.select(`.node[id="${clickedNode.id}"]`).classed("primary", true);

        // Find the links connected to the clicked node
        const connectedLinks = data.links.filter(link =>
            link.source.id === clickedNode.id || link.target.id === clickedNode.id
        );

        // Highlight the connected links and nodes
        connectedLinks.forEach(link => {
            d3.select(`.link[source="${link.source.id}"][target="${link.target.id}"]`).classed("primary", true);
            d3.select(`.link[source="${link.target.id}"][target="${link.source.id}"]`).classed("primary", true);
            d3.select(`.node[id="${link.source.id}"]`).classed("secondary", true);
            d3.select(`.node[id="${link.target.id}"]`).classed("secondary", true);
        });

        d3.select(event.currentTarget).classed("primary", true);
        links.each(function (l) {
            if (l.category === 'primary' && (l.source.id === clickedNode.id || l.target.id === clickedNode.id)) {
                d3.select(this).classed("primary", true);
                nodes.filter(n => n.id === l.source.id || n.id === l.target.id).classed("secondary", true);
                d3.select(this).attr("opacity", "1");
            }
        });
    }

    //When clicking outside nodes or links unhighlight everything
    d3.select("body").on("click", function (event) {
        if (event.target.nodeName === "body" || event.target.nodeName === "svg") {
            unHighlight();
            currentlyClicked = null;
        }
    });


    function unHighlight() {
        nodes.classed("primary", false);
        nodes.classed("secondary", false);
        links.classed("primary", false);
        links.classed("secondary", false);
    }
    function highlightConnectedPrimaryNodes(event, d) {

        d3.select(event.currentTarget).classed("primary", true);
        links.each(function (l) {
            if (l.category === 'primary' && (l.source.id === d.id || l.target.id === d.id)) {
                d3.select(this).classed("primary", true);
                nodes.filter(n => n.id === l.source.id || n.id === l.target.id).classed("secondary", true);
                d3.select(this).attr("opacity", "1");
            }
        });

    }


    // Create the labels for nodes
    const nodeLabels = svg.selectAll(".label")
        .data(data.nodes)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("dx", 15)
        .attr("dy", 5)
        .text(d => d.label);

    // Define the tick function
    const ticked = () => {
        links
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y)
        // .attr("class", d => `link ${d.category}`);  // Apply the category class to links


        nodes
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        nodeLabels
            .attr("x", d => d.x)
            .attr("y", d => d.y);

        // if (zoomTransform) {
        //     links.attr("transform", zoomTransform);
        //     nodes.attr("transform", zoomTransform);
        //     nodeLabels.attr("transform", zoomTransform);
        // }

    };

    // Run the simulation
    simulation.on("tick", ticked);
}

// function setIncludedProperties(properties) {

//     document.getElementById("includedProperties").value = properties.join(",");
//     const includedPropertiesInput = document.getElementById("includedProperties");
//     const includedProperties = includedPropertiesInput.value.split(",");
//     updateVisualization(visualizationMode);
// }



