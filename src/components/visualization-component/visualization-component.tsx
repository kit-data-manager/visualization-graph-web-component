import { Component, Prop, h, Element, Watch } from '@stencil/core';
import * as d3 from 'd3';
import { PrepareData } from '../../utils/dataUtil';
import { GraphSetup } from '../../utils/d3GraphSetup';
import { HandleEvents } from '../../utils/handleEvents';
import { LegendSetup } from '../../utils/legendSetup';

@Component({
  tag: 'visualization-component',
  styleUrl: 'visualization-component.css',
  shadow: true,
})
/**
 * VisualizationComponent is a custom web component that creates an interactive, force-directed graph
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
  @Prop() showDetailsOnHover: boolean = true;

  /**
   * Whether to show the legend in the graph. Defaults to true.
   *
   * @prop
   * @type {boolean}
   */
  @Prop() showLegend: boolean = true;

  /**
   * The configuration object for customizing the graph color, and legend.
   *
   * @prop
   * @type {any}
   */
  @Prop() configurations: any;

  private tooltip;
  public chartData: any;
  public parsedConfig: any;
  public primaryNodeColor = '#008080';

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
 * Declare a private instance variable of the 'HandleEvents' class.
 * It is used for handling events related to the D3.js graph.
 */
  private legendSetup: LegendSetup;

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
    this.dataUtil = new PrepareData(this.showPrimaryLinks, newValue);
    this.generateD3Graph(this.chartData);
  }

  /**
   * Callback invoked when the 'showPrimaryLinks' property changes.
   * Updates the data utility and regenerates the D3 graph.
   *
   * @watch
   * @param {boolean} newValue - The new value of 'showPrimaryLinks'.
   */
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
    this.d3GraphSetup = new GraphSetup(this.hostElement);
    this.dataUtil = new PrepareData(this.showPrimaryLinks, this.showAttributes);
    this.handleEvents = new HandleEvents(this.hostElement);
    this.legendSetup = new LegendSetup();

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
      if (this.configurations && Object.keys(this.configurations).length > 0) {
        this.parsedConfig = JSON.parse(this.configurations); // Parse legendConfig
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
    this.tooltip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0).style('position', 'absolute').style('pointer-events', 'none');
    this.d3GraphSetup.updateForceProperties({
      center: {
        x: 0.5, // Center position on the x-axis (0.5 for the middle of the SVG)
        y: 0.5, // Center position on the y-axis (0.5 for the middle of the SVG)
      },
      charge: {
        enabled: true,
        strength: -5,
        distanceMin: 0,
        distanceMax: 2000,
      },
      link: {
        distance: 90, // Adjust link distance as needed
      },
    });
  
    /**
    * Data preparation from dataUtil class
    *
    * 
    */ 
    let defaultComponentData = Array.isArray(setupData) && setupData.length > 0 ? setupData : this.dataUtil.getDefaultComponentData();
    const excludeProperties = this.excludeProperties.split(',');    
    //Conversion of input data to nodes and links
    let transformedData = this.dataUtil.transformData(defaultComponentData, excludeProperties);
    const uniqueAttributeNames = Array.from(new Set(transformedData.nodes.filter(node => node.category === 'attribute').map(node => Object.keys(node)[1])));
    const uniquePrimaryNodeNames = Array.from(new Set(transformedData.nodes.filter(node => node.category == 'non_attribute').map(node => Object.values(node)[0])));
    // Set up color scale for links
    const colorType = d3.scaleOrdinal(transformedData.links.map(d => d.relationType).sort(d3.ascending), d3.schemeCategory10);
    const numPrimaryNodes = transformedData.nodes.filter(node => node.category === 'non_attribute').length;


    /**
    * Graph setup from d3GraphSetup class
    *
    * 
    */ 
    // Initialize SVG and graph setup
    const { svg, numericWidth, numericHeight } = this.d3GraphSetup.initializeSVG(numPrimaryNodes);
    this.d3GraphSetup.clearSVG(svg);
    const simulation = this.d3GraphSetup.createForceSimulation(transformedData.nodes, transformedData.links, numericWidth, numericHeight);
    const { attributeColorMap, attributeColorScale } = this.d3GraphSetup.attributeColorSetup(uniqueAttributeNames, this.parsedConfig);
    this.d3GraphSetup.attributeColorSetup(uniquePrimaryNodeNames, this.parsedConfig);
    const primaryNodeConfig = this.parsedConfig[0]?.primaryNodeConfigurations || [];
    //Nodes and links creation. DONOT Create Nodes before Link
    const links = this.d3GraphSetup.createLinks(svg, transformedData.links, colorType);
    const { nodesCreated, typeMatchedPrimaryNodes } = this.d3GraphSetup.createNodes(svg, transformedData.nodes, primaryNodeConfig, attributeColorMap, this.parsedConfig);
    // Apply simulation
    this.d3GraphSetup.applySimulation(nodesCreated, links, simulation);



    /**
    * Legend related code from LegendSetup class
    *
    * 
    */
    const { legendAttributesConfig, legendPrimaryConfig } = this.legendSetup.prepareLegend(typeMatchedPrimaryNodes, uniqueAttributeNames, this.parsedConfig, attributeColorScale);
    this.legendSetup.createLegendNodes(svg, this.primaryNodeColor, this.showLegend, legendAttributesConfig, attributeColorMap, this.tooltip, legendPrimaryConfig);


    /**
    * Events related code from handleEvents class
    *
    * 
    */
    this.handleEvents.onClick(nodesCreated, links);
    if (this.showDetailsOnHover) this.handleEvents.applyMouseover(nodesCreated, links, this.tooltip);
    this.handleEvents.applyDragToNodes(nodesCreated, simulation);
    this.handleEvents.applyClickHandler();


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
