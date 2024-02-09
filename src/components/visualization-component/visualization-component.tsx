import { Component, Prop, h, Element, Watch } from '@stencil/core';
import * as d3 from 'd3';
import { PrepareData } from '../../utils/dataUtil';
import { GraphSetup } from '../../utils/d3GraphSetup';
import { HandleEvents } from '../../utils/eventHandler';
@Component({
  tag: 'visualization-component',
  styleUrl: 'visualization-component.css',
  shadow: true,
})
/**
 * MyComponent is a custom web component that creates an interactive, force-directed graph
 * using D3.js. It visualizes nodes and links based on provided JSON data.
 */
export class VisualizationComponent {
  @Element() hostElement: HTMLElement;

  /**
   * The size of the graph. Defaults to '1350px,650px'.
   *
   * @prop
   * @type {string}
   */
  @Prop() size: string = '1350px,650px';

  /**
   * Whether to show attributes in the graph. Defaults to true.
   * If true it will show all the attributes/properties
   * If false it wont show any attributes
   * Default value : true
   *
   * @prop
   * @type {boolean}
   */
  @Prop() showAttributes: boolean = true;

  /**
   * Whether to show primary links in the graph.
   * If true it will show all the links between primary nodes
   * Defaults to true.
   *
   * @prop
   * @type {boolean}
   */
  @Prop() showPrimaryLinks: boolean = true;

  /**
   * Input data in JSON format for the graph.
   *
   * @prop
   * @type {string}
   */
  @Prop() data: string = '[]';

  /**
   * Properties to be excluded from outside the component. Defaults to an empty string.
   *
   * @prop
   * @type {string}
   */
  @Prop() excludeProperties: string = '';

  /**
   * Whether to show hover effects on the graph nodes. Defaults to true.
   *
   * @prop
   * @type {boolean}
   */
  @Prop() displayHovered: boolean = true;

  @Prop() showLegend: boolean = true;

  @Prop() config: any;

  private tooltip;
  public chartData: any;
  public parsedConfig: any;
  /**
   * Declare a private instance variable of the 'PrepareData' class.
   * It is used for preparing or processing data for the chart.
   */
  private dataUtil: PrepareData;

  /**
   * Declare a private instance variable of the 'GraphSetup' class.
   * It is used for setting up and configuring the D3.js graph.
   */
  private d3GraphSetup: GraphSetup;

  /**
   * Declare a private instance variable of the 'HandleEvents' class.
   * It is used for handling events related to the D3.js graph.
   */
  private handleEvents: HandleEvents;

  /**
   * Callback invoked when the 'data' property changes. Updates the visualization.
   *
   * @watch
   * @param {string} newData - The new data.
   */
  @Watch('data')
  inputDataChanged(newData) {
    // Update the visualization when the data is changed from outside the component.
    try {
      this.data = newData;
      this.chartData = JSON.parse(newData);
      this.generateD3Graph(this.chartData);
    } catch (error) {
      console.error('Error in input data', error);
      this.chartData = [];
    }
  }

  /**
   * Callback invoked when the 'showAttributes' property changes.
   * Updates the data utility and regenerates the D3 graph.
   *
   * @watch
   * @param {boolean} newValue - The new value of 'showAttributes'.
   */
  @Watch('showAttributes')
  showAttributesChanged(newValue: boolean) {
    // console.log('showAttributesChanged called with:', newValue);
    this.dataUtil = new PrepareData(this.showPrimaryLinks, newValue);
    this.generateD3Graph(this.chartData);
  }

  @Watch('showPrimaryLinks')
  showPrimaryLinksChanged(newValue: boolean) {
    this.dataUtil = new PrepareData(newValue, this.showAttributes);
    this.generateD3Graph(this.chartData);
  }

  /**
   * Lifecycle method invoked when the component is connected.
   * Initializes data utility, D3 graph setup, and parses input data.
   */
  connectedCallback() {
    this.dataUtil = new PrepareData(this.showPrimaryLinks, this.showAttributes);
    this.d3GraphSetup = new GraphSetup(this.hostElement);
    this.handleEvents = new HandleEvents(this.hostElement);
    // Parse the input data when the component is initialized
    try {
      if (this.data != '') {
        this.chartData = JSON.parse(this.data);
      } else {
        this.chartData = [];
      }
    } catch (error) {
      console.error('Error parsing input data:', error);
      this.chartData = [];
    }

    try {
      if (this.config && Object.keys(this.config).length > 0) {
        // Check if config is provided and not empty
        this.parsedConfig = JSON.parse(this.config); // Parse legendConfig
      } else {
        this.parsedConfig = [];
      }
    } catch (error) {
      console.error('Error parsing legendConfig:', error);
      this.parsedConfig = [];
    }
  }
  /**
   * Lifecycle method invoked when the component is loaded.
   * Initializes and sets up the D3.js graph.
   */
  componentDidLoad() {
    try {
      this.generateD3Graph(this.chartData);
    } catch (error) {
      console.error('Error in input data', error);
    }
  }

  /**
   * Sets up the D3.js graph visualization based on the input data.
   *
   * @param {any[]} setupData - The data to set up the graph.
   */
  generateD3Graph(setupData: any[]) {
    this.dataUtil.setShowAttributes(this.showAttributes);
    // Prepare data
    let defaultComponentData = Array.isArray(setupData) && setupData.length > 0 ? setupData : this.dataUtil.getDefaultComponentData();
    const excludeProperties = this.excludeProperties.split(',');
    let transformedData = this.dataUtil.transformData(defaultComponentData, excludeProperties);

    // Set up color scale for links
    const colorType = d3.scaleOrdinal(transformedData.links.map(d => d.relationType).sort(d3.ascending), d3.schemeCategory10);

    // Initialize SVG and graph setup
    const { svg, numericWidth, numericHeight } = this.d3GraphSetup.initializeSVG();
    this.d3GraphSetup.clearSVG(svg);

    this.d3GraphSetup.createCustomMarkers(svg, transformedData.links, colorType);

    //Legend:
    // Extract unique attribute names
    const uniqueAttributeNames = Array.from(new Set(transformedData.nodes.filter(node => node.category === 'attribute').map(node => Object.keys(node)[1])));
    // Prepare attribute color mapping based on config
    try {
      let attributeColorMap = new Map();
      const defaultColorScale = d3.scaleOrdinal(d3.schemeCategory10);
      uniqueAttributeNames.forEach(attributeName => {
        const configItem = this.parsedConfig.find(item => item.attributeKey === attributeName);
        if (configItem && configItem.color) {
          // Use color from config if available
          attributeColorMap.set(attributeName, configItem.color);
        } else {
          // Directly assign a color using the attribute name
          // Here, defaultColorScale is used to assign a color based on the attribute name
          const color = defaultColorScale(attributeName);
          attributeColorMap.set(attributeName, color);
        }
      });
      const attributeColorScale = d3.scaleOrdinal(uniqueAttributeNames, d3.schemeCategory10);
      // The color for primary nodes
      const primaryNodeColor = '#008080'; 
      const legendConfigurations = this.d3GraphSetup.prepareLegend(uniqueAttributeNames, this.parsedConfig, attributeColorScale);
      // Create the node legend
      this.d3GraphSetup.createNodeLegend(svg, primaryNodeColor, this.showLegend, legendConfigurations, attributeColorMap);

      //

      this.d3GraphSetup.updateForceProperties({
        center: {
          x: 0.5, // Center position on the x-axis (0.5 for the middle of the SVG)
          y: 0.5, // Center position on the y-axis (0.5 for the middle of the SVG)
        },
        charge: {
          enabled: true,
          strength: -10,
          distanceMin: 40,
          distanceMax: 2000,
        },
        link: {
          distance: 90, // Adjust link distance as needed
        },
        // Add or update additional force properties as needed
      });
      // Create force simulation
      const simulation = this.d3GraphSetup.createForceSimulation(transformedData.nodes, transformedData.links, numericWidth, numericHeight);

      // Create links and nodes
      const links = this.d3GraphSetup.createLinks(svg, transformedData.links, colorType);
      const nodes = this.d3GraphSetup.createNodes(svg, transformedData.nodes, primaryNodeColor, attributeColorMap);

      // this.tooltip = svg.append('g').attr('class', 'tooltip').style('opacity', 0).style('position', 'absolute');
      this.tooltip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0).style('position', 'absolute').style('pointer-events', 'none');

      // Apply event handlers
      this.handleEvents.onClick(nodes, links);
      if (this.displayHovered) this.handleEvents.applyMouseover(nodes, links, this.tooltip);
      this.handleEvents.applyDragToNodes(nodes, simulation);
      this.handleEvents.applyClickHandler();

      // Apply simulation
      this.d3GraphSetup.applySimulation(nodes, links, simulation);
    } catch (error) {
      console.error('Error in generateD3Graph:', error);
    }
  }

  /**
   * Renders the component with an SVG element for the graph.
   *
   * @return {JSX.Element}
   */
  render() {
    const [width, height] = this.size.split(',').map(s => s.trim());
    return (
      <div>
        <svg id="graph" style={{ width: width, height: height }}></svg>
      </div>
    );
  }
}
