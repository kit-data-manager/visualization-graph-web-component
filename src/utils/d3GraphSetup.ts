import * as d3 from 'd3';

/**
 * Class responsible for setting up and managing the D3.js graph visualization.
 *
 * @class
 */
export class GraphSetup {
  /**
   * The HTML host element where the D3.js graph will be rendered.
   *
   * @private
   * @type {HTMLElement}
   */
  private hostElement: HTMLElement;

  /**
   * The size of the graph. Defaults to '1350px,650px'.
   *
   * @private
   * @type {string}
   */
  private size: string = '1350px,650px';

  private forceProperties = {
    center: {
      x: 0.5,
      y: 0.5,
    },
    charge: {
      enabled: true,
      strength: -70,
      distanceMin: 40,
      distanceMax: 2000,
    },
    link: {
      distance: 70,
    },
    // You can add more properties for other forces like collision if needed
  };

  constructor(hostElement) {
    this.hostElement = hostElement;
  }

  /**
   * Clears all elements inside the provided SVG element.
   *
   * @param {d3.Selection} svg - The SVG element to clear.
   */
  clearSVG(svg) {
    svg.selectAll('*').remove();
  }

  /**
   * Initializes the SVG element for the graph based on the host element.
   *
   * @returns {{ svg: d3.Selection, numericWidth: number, numericHeight: number }} - The initialized SVG element and its dimensions.
   */
  initializeSVG() {
    const svg = d3.select(this.hostElement.shadowRoot.querySelector('#graph'));
    const [width, height] = this.size.split(',').map(s => s.trim());
    svg.attr('width', width).attr('height', height).attr('marker-end', 'url(#arrow)');
    const numericWidth = parseInt(width, 10);
    const numericHeight = parseInt(height, 10);

    // Create a container group for all graph elements
    const container = svg.append('g').attr('class', 'zoom-container');

    // Set up zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 10]) // Adjust scale extent as needed
      .on('zoom', event => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom);
    return { svg, numericWidth, numericHeight };
  }

  /**
   * Creates a force simulation for the graph nodes and links.
   *
   * @param {any[]} nodes - The array of node data.
   * @param {any[]} links - The array of link data.
   * @param {number} numericWidth - The numeric width of the graph.
   * @param {number} numericHeight - The numeric height of the graph.
   * @returns {d3.Simulation<any, any>} - The configured force simulation.
   */
  createForceSimulation(nodes, links, numericWidth, numericHeight) {
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(d => d.category === 'attribute' ? 50 : 70), // Shorter distance for attribute links

          // .distance(this.forceProperties.link.distance),
      )
      .force(
        'charge',
        d3.forceManyBody().strength(this.forceProperties.charge.strength).distanceMin(this.forceProperties.charge.distanceMin).distanceMax(this.forceProperties.charge.distanceMax),
      )
      .force('center', d3.forceCenter(numericWidth * this.forceProperties.center.x, numericHeight * this.forceProperties.center.y));
    return simulation;
  }
  updateForceProperties(newProps: { [forceName: string]: { [propName: string]: any } }) {
    // Iterate over the object to update force properties
    for (const forceName of Object.keys(newProps)) {
      for (const propName of Object.keys(newProps[forceName])) {
        if (this.forceProperties[forceName]) {
          this.forceProperties[forceName][propName] = newProps[forceName][propName];
        }
      }
    }
  }

  /**
   * Creates and appends link elements to the graph SVG.
   *
   * @param {d3.Selection} svg - The SVG element to which links will be appended.
   * @param {any[]} links - The array of link data.
   * @returns {d3.Selection} - The created link elements.
   */
  createLinks(svg, links, colorType) {
    // Create a group for each link
    const linkGroup = svg.selectAll('.link').data(links).enter().append('g').attr('class', 'link');

    // Append the line to each group
    linkGroup
      .append('line')
      .attr('stroke-opacity', 1)
      .attr('opacity', '1')
      .attr('stroke', d => (d.category === 'non_attribute' ? colorType(d.relationType) : '#d3d3d3'))
      .attr('marker-end', d => `url(#arrowhead-${d.relationType})`) // Add arrow marker
      .attr('marker-start', d => `url(#arrowtail-${d.relationType})`)
      .attr('stroke-dasharray', d => (d.relationType === 'someType' ? '0, 5' : 'none')); // Adjust condition as per your data

    // Append the text to each group
    linkGroup
      .append('text')
      .text(d => d.relationType) // Replace 'type' with the name of the property in your data
      .attr('fill', 'black') // Style as needed
      .attr('font-size', 3)
      .attr('text-anchor', 'middle')
      .attr('dy', -5); // Offset from the line

    return linkGroup;
  }

  /**
   * Creates and appends node elements to the graph SVG.
   *
   * @param {d3.Selection} svg - The SVG element to which nodes will be appended.
   * @param {any[]} nodes - The array of node data.
   * @param {d3.ScaleOrdinal<string, string>} colorScale - The color scale for node colors.
   * @returns {d3.Selection} - The created node elements.
   */
  createNodes(svg, nodes, primaryNodeColor) {
    // Extract unique attribute names from attribute nodes
    const attributeNames = nodes.filter(node => node.category === 'attribute').map(node => Object.keys(node)[1]); // Assuming the attribute name is the second key
    const uniqueAttributeNames = [...new Set(attributeNames)];

    // Create a color scale for attribute nodes
    const attributeColorScale = d3.scaleOrdinal(uniqueAttributeNames, d3.schemeCategory10);

    // Separate color scale for primary nodes
    // const primaryNodeColor = '#4682B4'; 

    return svg
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', d => d.category === 'attribute' ? 6 : 10) // Smaller radius for attribute nodes
      .attr('fill', d => (d.category === 'attribute' ? attributeColorScale(Object.keys(d)[1]) : primaryNodeColor))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);
  }

  createCustomMarkers(svg, links, colorType) {
    let defs = svg.append('defs');
    let set = [...new Set(links.filter(d => d.category === 'non_attribute').map(d => d.relationType))];

    set.forEach(elem => {
      // Marker for the end of the link (arrowhead)
      defs
        .append('svg:marker')
        .attr('id', `arrowhead-${elem}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 28)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', colorType(elem));

      // Marker for the start of the link (reverse arrowhead)
      defs
        .append('svg:marker')
        .attr('id', `arrowtail-${elem}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', -18) // Adjust for positioning the tail
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M10,-5L0,0L10,5')
        .attr('fill', colorType(elem));
    });
  }

  createMarker(defs, id, color) {
    defs
      .append('svg:marker')
      .attr('id', id)
      .attr('refX', 20)
      .attr('refY', 20)
      .attr('markerWidth', 40)
      .attr('markerHeight', 40)
      .attr('markerUnits', 'userSpaceOnUse')
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,0Q15,0,20,10,15,20,0,20A1,1,0,000,0') //d3.line()([[0, 0], [0, 20], [20, 10]]))
      .style('fill', color);
  }

  /**
   * Applies the force simulation to update link and node positions on each simulation tick.
   *
   * @param {d3.Selection} nodes - The node elements in the graph.
   * @param {d3.Selection} links - The link elements in the graph.
   * @param {d3.Simulation<any, any>} simulation - The configured force simulation.
   */
  applySimulation(nodes, links, simulation) {
    const ticked = () => {
      links
        .select('line')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      links
        .select('text')
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2);

      nodes.attr('cx', d => d.x).attr('cy', d => d.y);
    };

    simulation.on('tick', ticked);
  }

  //Legend stationary attemp
  /**
   * Creates a legend for the node colors in the graph.
   *
   * @param {d3.Selection} svg - The SVG element to which the legend will be appended.
   * @param {d3.ScaleOrdinal<string, string>} attributeColorScale - The color scale for attribute nodes.
   * @param {string[]} uniqueAttributeNames - The unique attribute names used in the color scale.
   * @param {string} primaryNodeColor - The color used for primary nodes.
   */
  // createNodeLegend(svg, attributeColorScale, uniqueAttributeNames, primaryNodeColor) {

  //   const legend = svg.append('g')
  //     .attr('class', 'legend')
  //     .attr('transform', 'translate(1220,320)'); // Adjust the position as needed

  //   // Adding primary node color to the legend
  //   legend.append('circle')
  //     .attr('cx', 0)
  //     .attr('cy', 0)
  //     .attr('r', 5)
  //     .style('fill', primaryNodeColor);
  //   legend.append('text')
  //     .attr('x', 20)
  //     .attr('y', 0)
  //     .attr('dy', '0.35em')
  //     .text('Primary Node');

  //   // Adding attribute colors to the legend
  //   uniqueAttributeNames.forEach((attr, index) => {
  //     const color = attributeColorScale(attr);
  //     const yPosition = (index + 1) * 20; // Adjust spacing

  //     legend.append('circle')
  //       .attr('cx', 0)
  //       .attr('cy', yPosition)
  //       .attr('r', 5)
  //       .style('fill', color);

  //     legend.append('text')
  //       .attr('x', 20)
  //       .attr('y', yPosition)
  //       .attr('dy', '0.35em')
  //       .text(attr);
  //   });
  // }

  //Scrollable legend attempt
  createNodeLegend(svg, attributeColorScale, uniqueAttributeNames, primaryNodeColor) {
    const svgWidth = parseInt(svg.style('width'));
    const rightOffset = 50;
    const legendX = svgWidth - rightOffset;

    // Set a fixed size for the legend area and make it scrollable
    const legendHeight = 200; // Adjust as needed
    const legendWidth = 250; // Adjust as needed

    // Create a container for the scrollable legend
    const legendContainer = svg
      .append('foreignObject')
      .attr('x', legendX - legendWidth)
      .attr('y', 420)
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .append('xhtml:div')
      .style('overflow', 'auto')
      .style('height', `${legendHeight}px`);

    const legend = legendContainer.append('div').style('cursor', 'pointer');

    // Add primary node color to the legend
    this.addLegendItem(legend, primaryNodeColor, 'Primary Node', 10); // Size 10 for primary nodes

    // Add attribute colors to the legend
    uniqueAttributeNames.forEach(attr => {
      const color = attributeColorScale(attr);
      this.addLegendItem(legend, color, `${attr} `, 6); // Size 6 for secondary nodes, adjust as per your setup
    });
  }

  // Helper method to add items to the legend
 // Adjust the method to include a size parameter
addLegendItem(legend, color, label, size) {
  const item = legend.append('div')
    .style('display', 'flex')
    .style('align-items', 'center')
    .style('margin-bottom', '10px'); // Increase spacing if needed

  // Adjust the circle to reflect the node size
  item.append('svg')
    .attr('width', 24) // Adjust width and height as needed
    .attr('height', 24)
    .append('circle')
    .attr('cx', 12) // Center the circle in the SVG
    .attr('cy', 12) // Adjust cy to vertically center, considering the SVG's height
    .attr('r', size) // Use the dynamic size for the circle
    .style('fill', color);

  // Adjust text to include information about the node
  item.append('span')
    .style('margin-left', '10px')
    .text(label); // The label already describes the node
}


  //link type texxt to be didsplayed :
}
