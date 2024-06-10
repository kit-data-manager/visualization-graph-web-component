import { DemoData } from '../../utils/storiesData/demoData';
import { DefaultData} from '../../utils/storiesData/defaultData';
import { MidSizeData} from '../../utils/storiesData/midSizeData';
import { HighSizeData} from '../../utils/storiesData/highSizeData';
/**
 * Storybook configuration for the 'visualization-component' web component.
 * Defines different stories and their corresponding parameters.
 *
 */
export default {
  /**
   * Title for the Storybook category.
   *
   * @story
   * @type {string}
   */
  title: 'Components/VisualizationComponent',
  component: 'visualization-component',

  /**
   * Argument types for the stories, allowing interactive control in Storybook.
   *
   * @story
   * @type {Object}
   */
};
/**
 * Template function to create a basic story with the 'visualization-component'.
 *
 * @story
 * @type {Function}
 */
const Template = args => `<div style="display: flex; justify-content: center; align-items: center; height: 90vh;">
<visualization-component 
  data='${args.data}'
  show-attributes="${args.showAttributes}" 
  show-primary-links="${args.showPrimaryLinks}"
  show-details-on-hover="${args.showDetailsOnHover}"
  exclude-properties="${args.excludeProperties}"
  show-legend="${args.showLegend}"
  size ="1350px,650px"
  configurations='${args.configurations}'
></visualization-component>`;


const defaultDataObj = new DefaultData();
const demoDataObj = new DemoData();
const midSizeDataObj = new MidSizeData();
const highSizeDataObj = new HighSizeData();

const config = defaultDataObj.getDefaultConfigurationSettings();
const defaultData = defaultDataObj.getDefaultData();
const midSizeData = midSizeDataObj.getMidSizeData();
const highSizeData = highSizeDataObj.getHighSizeData();
const ontologiesData = demoDataObj.getOntologiesData();
const singleObjectDemoData = demoDataObj.getSingleObjectDemoData();
const multipleObjectsDemoData = demoDataObj.getMultipleObjectsDemoData();
const demoData = demoDataObj.getDemoData();

const defaultConfigurationSettings = defaultDataObj.getDefaultConfigurationSettings();
const midSizeConfigurationSettings = midSizeDataObj.getMidSizeConfigurationSettings();
const highSizeConfigurationSettings = highSizeDataObj.getHighSizeConfigurationSettings();
const demoConfigurationSettings = demoDataObj.getDemoCongigurations();

export const Default = Template.bind({});
Default.args = {
  showAttributes: true,
  showLegend: true,
  showDetailsOnHover: true,
  showPrimaryLinks: true,
  data: JSON.stringify(defaultData, null, 2),
  configurations: JSON.stringify(config, null, 2)
};

export const ChangeConfigurationsSettings = Template.bind({});
ChangeConfigurationsSettings.args = {
  configurations: JSON.stringify(defaultConfigurationSettings, null, 2), // Pass the configuration data here
  showLegend: true,
  showAttributes: true,
  showPrimaryLinks: true,
  showDetailsOnHover: true,
  data: JSON.stringify(defaultData, null, 2),
};

export const ExcludeSomeProperties = Template.bind({});
ExcludeSomeProperties.args = {
  excludeProperties: 'genre,title',
  showLegend: true,
  showAttributes: true,
  showPrimaryLinks: true,
  showDetailsOnHover: true,
  data: JSON.stringify(defaultData, null, 2),
  configurations: JSON.stringify(defaultConfigurationSettings, null, 2), // Pass the configuration data here
};

export const EnterData = Template.bind({});
EnterData.args = {
  data: JSON.stringify(defaultData, null, 2),
  configurations: JSON.stringify(defaultConfigurationSettings, null, 2), // Pass the configuration data here
  showLegend: true,
  showAttributes: true,
  showPrimaryLinks: true,
  showDetailsOnHover: true,
};

export const HideAttributes = Template.bind({});
HideAttributes.args = {
  showAttributes: false,
  showLegend: true,
  showPrimaryLinks: true,
  showDetailsOnHover: true,
  data: JSON.stringify(defaultData, null, 2),
  configurations: JSON.stringify(defaultConfigurationSettings, null, 2)
};

export const HidePrimaryLinks = Template.bind({});
HidePrimaryLinks.args = {
  showPrimaryLinks: false,
  showLegend: true,
  showAttributes: true,
  showDetailsOnHover: true,
  data: JSON.stringify(defaultData, null, 2),
  configurations: JSON.stringify(defaultConfigurationSettings, null, 2)
};

export const HideDetailsOnHover = Template.bind({});
HideDetailsOnHover.args = {
  showDetailsOnHover: false,
  showLegend: true,
  showAttributes: true,
  showPrimaryLinks: true,
  data: JSON.stringify(defaultData, null, 2),
  configurations: JSON.stringify(defaultConfigurationSettings, null, 2)
};

export const HideLegend = Template.bind({});
HideLegend.args = {
  showLegend: false,
  showAttributes: true,
  showPrimaryLinks: true,
  showDetailsOnHover: true,
  data: JSON.stringify(defaultData, null, 2),
  configurations: JSON.stringify(defaultConfigurationSettings, null, 2)
};

export const MidComplexityExample = Template.bind({});
MidComplexityExample.args = {
  showLegend: true,
  showAttributes: true,
  showPrimaryLinks: true,
  showDetailsOnHover: true,
  data: JSON.stringify(midSizeData, null, 2),
  configurations: JSON.stringify(midSizeConfigurationSettings, null, 2),
  size: "900px,650px"
};

export const HighComplexityExample = Template.bind({});
HighComplexityExample.args = {
  showLegend: true,
  showAttributes: true,
  showPrimaryLinks: true,
  showDetailsOnHover: true,
  data: JSON.stringify(highSizeData, null, 2),
  configurations: JSON.stringify(highSizeConfigurationSettings, null, 2),
  size: "900px,650px"
};

export const OntologiesDemo = Template.bind({});
OntologiesDemo.args = {
  showAttributes: true,
  showLegend: true,
  showDetailsOnHover: true,
  showPrimaryLinks: true,
  data: JSON.stringify(ontologiesData, null, 2),
  configurations: JSON.stringify(defaultConfigurationSettings, null, 2)
};

export const SingleObjectDemo = Template.bind({});
SingleObjectDemo.args = {
  showAttributes: true,
  showLegend: true,
  showDetailsOnHover: true,
  showPrimaryLinks: true,
  data: JSON.stringify(singleObjectDemoData, null, 2),
  configurations: JSON.stringify(defaultConfigurationSettings, null, 2)
};

export const MultipleObjectsDemo = Template.bind({});
MultipleObjectsDemo.args = {
  showAttributes: true,
  showLegend: true,
  showDetailsOnHover: true,
  showPrimaryLinks: true,
  data: JSON.stringify(multipleObjectsDemoData, null, 2),
  configurations: JSON.stringify(defaultConfigurationSettings, null, 2)
};

export const Demo = Template.bind({});
Demo.args = {
  configurations: JSON.stringify(demoConfigurationSettings, null, 2),
  showAttributes: true,
  showLegend: true,
  showDetailsOnHover: true,
  showPrimaryLinks: true,
  data: JSON.stringify(demoData, null, 2),
};