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

  /**
   * Default force properties for the graph simulation.
   *
   * @private
   * @type {{
   *   center: { x: number, y: number },
   *   charge: { enabled: boolean, strength: number, distanceMin: number, distanceMax: number },
   *   link: { distance: number }
   * }}
   */
  private forceProperties = {
    center: {
      x: 0,
      y: 0,
    },
    charge: {
      enabled: true,
      strength: 0,
      distanceMin: 40,
      distanceMax: 2000,
    },
    link: {
      distance: 70,
    },
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
  initializeSVG(numPrimaryNodes: number) {
    const svg = d3.select(this.hostElement.shadowRoot.querySelector("#graph"));
    const [width, height] = this.size.split(',').map(s => s.trim());
    svg.attr("viewBox", `0 0 ${parseInt(width, 10)} ${parseInt(height, 10)}`).attr("preserveAspectRatio", "xMidYMid meet");
    const numericWidth = parseInt(width, 10);
    const numericHeight = parseInt(height, 10);

    // Set up zoom behavior directly on the SVG element
    const zoom = d3.zoom()
      .extent([[1000, 1000], [numericWidth, numericHeight]])
      .scaleExtent([0, 5]) // Adjust scale extent as needed
      .on("zoom", (event) => {
        svg.attr("transform", event.transform); // Apply zoom directly to SVG
      });

    const initialZoomScale = numPrimaryNodes > 30 ? 0.5 : 1;
    svg.call(zoom).call(zoom.transform, d3.zoomIdentity.scale(initialZoomScale));

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
          .distance(d => (d.category === 'attribute' ? 35 : 70)), // Shorter distance for attribute links
      )
      .force(
        'charge',
        d3.forceManyBody().strength(this.forceProperties.charge.strength).distanceMin(this.forceProperties.charge.distanceMin).distanceMax(this.forceProperties.charge.distanceMax),
      )
      .force('center', d3.forceCenter(numericWidth * this.forceProperties.center.x, numericHeight * this.forceProperties.center.y));
    return simulation;
  }

  /**
   * Updates the force simulation properties.
   *
   * @param {{ [forceName: string]: { [propName: string]: any } }} newProps - The new properties to update.
   */
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
      .text(d => d.category === 'attribute' ? '' : d.relationType)
      .attr('stroke-opacity', 0)
      .attr('opacity', '1')
      .attr('fill', 'black') // Style as needed
      .attr('font-size', 3)
      .attr('text-anchor', 'middle')
      .attr('dy', d => {
        // Calculate the vertical position of the text relative to the line
        const yOffset = -5; // Adjust this value to control the vertical offset
        return d.source.y < d.target.y ? yOffset : -yOffset; // Position above or below the line based on y-coordinates of source and target nodes
      })
      .attr('dx', d => {
        // Calculate the horizontal position of the text relative to the line
        const xOffset = 5; // Adjust this value to control the horizontal offset
        return (d.source.x + d.target.x) / 2 > 0 ? xOffset : -xOffset; // Position to the right or left of the line based on the average x-coordinates of source and target nodes
      });

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
  createNodes(svg, nodes, primaryNodeConfig, attributeColorMap, config) {
    const userConfigs = Array.isArray(config) ? config : [];
    // Extract primary values from the first configuration in the config array
    const userConfig = userConfigs[0];
    const primaryLabel = userConfig.label || '';
    const primaryColor = userConfig.color || '#008080';

    // Provide default values for the maps
    let typeRegExColorMap = new Map([['defaultColor', primaryColor]]);
    let typeRegExLabelMap = new Map([['defaultLabel', primaryLabel]]);
    primaryNodeConfig.forEach(primaryNode => {
      typeRegExColorMap.set(primaryNode.typeRegEx, primaryNode.nodeColor);
      typeRegExLabelMap.set(primaryNode.typeRegEx, primaryNode.nodeLabel);
    });

    // Extract unique attribute names from attribute nodes
    // Create a color scale for attribute nodes
    let defaultPrimaryNodeColor = '#add8e6';
    let typeMatchedPrimaryNodes = [];
    let nodesCreated = svg
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('r', d => (d.category === 'attribute' ? 6 : 10)) // Smaller radius for attribute nodes
      .attr('fill', d => {
        if (d.category === 'attribute') {
          // Assuming the attribute name is the second key of the node object
          const attributeName = Object.keys(d)[1];
          return attributeColorMap.get(attributeName); // Directly use color from attributeColorMap
        } else {
          const color = typeRegExColorMap.get(d.type) || primaryColor;
          const label = typeRegExLabelMap.get(d.type) || primaryLabel;
          if (color && color !== primaryColor) {
            typeMatchedPrimaryNodes.push({ node: d, color: color, label: label });
          }
          return color || defaultPrimaryNodeColor; // Use primaryNodeColor for non-attribute nodes
        }
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);
    return { nodesCreated, typeMatchedPrimaryNodes };

  }
  /**
   * Creates a map which contains configuration information of nodes(Color, Label)
   *
   */
  createPrimaryNodeMap(nodes, primaryNodeConfig) {
    let primaryNodeMap = new Map();
    // Extract primaryNodeConfigurations from the configuration
    // Loop through each node
    nodes.forEach(node => {
      if (node.category === 'non_attribute') {
        // Loop through each primaryNodeConfiguration
        primaryNodeConfig.forEach(primaryNode => {
          const regex = new RegExp(primaryNode.typeRegEx, 'i');
          if (regex.test(node.type)) {
            // Store the node's ID, label, and color in the map
            primaryNodeMap.set(node.id, {
              nodeLabel: primaryNode.nodeLabel,
              nodeColor: primaryNode.nodeColor,
              matchedBy: primaryNode.typeRegEx
            });
          }
        });
      }
    });

    return primaryNodeMap;
  }
  /**
   * Creates custom markers for links based on their types.
   *
   * @param {d3.Selection} svg - The SVG element.
   * @param {any[]} links - The array of link data.
   * @param {(type: string) => string} colorType - Function to retrieve color based on link type.
   */
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

  /**
 * Sets up attribute color mapping based on provided configurations if not provided then used default colors.
 *
 * @param {string[]} uniqueAttributeNames - The unique attribute names.
 * @param {any[]} parsedConfig - The parsed configuration data.
 * @returns {{ attributeColorMap: Map<string, string>, attributeColorScale: d3.ScaleOrdinal<string, string> }} - The attribute color map and scale.
 */
  attributeColorSetup(uniqueAttributeNames, parsedConfig) {
    // Prepare attribute color mapping based on config
    let attributeColorMap = new Map();
    const defaultColorScale = d3.scaleOrdinal(d3.schemeCategory10);
    uniqueAttributeNames.forEach(attributeName => {
      // Initialize an array to store properties for each matching attribute
      let color;

      // Search for the attribute in properties of each config item
      parsedConfig.forEach(item => {
        if (item.properties) {
          item.properties.forEach(propertyObj => {
            // Iterate over keys of each property object
            Object.keys(propertyObj).forEach(key => {
              // Check if the attributeName matches the key and if the property object has a color
              if (key === attributeName && propertyObj[key].color) {
                // Add property object to the properties array
                color = propertyObj[key].color;
              }
            });
          });
        }
      });

      if (color && color.length > 0) {
        // Use properties from matching attributes if available
        attributeColorMap.set(attributeName, color);
      } else {
        // Directly assign a color using the attribute name from default scale
        const color = defaultColorScale(attributeName);
        attributeColorMap.set(attributeName, color);
      }
    });
    const attributeColorScale = d3.scaleOrdinal(uniqueAttributeNames, d3.schemeCategory10);
    return { attributeColorMap, attributeColorScale };
  }
}
