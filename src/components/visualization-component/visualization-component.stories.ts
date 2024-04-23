import { StoriesData } from '../../utils/storiesData';
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

const storiesData = new StoriesData();

const entityNetworkData = storiesData.getNetworkData();
const defaultData = storiesData.getDefaultData();
const midSizeData = storiesData.getMidSizeData();
const highSizeData = storiesData.getMidSizeData();

const defaultConfigurationSettings = storiesData.getDefaultConfigurationSettings();
const midSizeConfigurationSettings = storiesData.getMidSizeConfigurationSettings();
const highSizeConfigurationSettings = storiesData.getHighSizeConfigurationSettings();


export const Default = Template.bind({});
Default.args = {
  showAttributes: true,
  showLegend: true,
  showDetailsOnHover: true,
  showPrimaryLinks: true,
  data: JSON.stringify(defaultData, null, 2),
  configurations: JSON.stringify(defaultConfigurationSettings,null,2)
};

export const ChangeConfigurationsSettings = Template.bind({});
ChangeConfigurationsSettings.args = {
  configurations: JSON.stringify(defaultConfigurationSettings,null,2), // Pass the configuration data here
  showLegend: true,
  showAttributes: true,
  showPrimaryLinks: true,
  showDetailsOnHover: true,
  data: JSON.stringify(entityNetworkData, null, 2),
};

export const ExcludeSomeProperties = Template.bind({});
ExcludeSomeProperties.args = {
  excludeProperties: 'genre,title',
  showLegend: true,
  showAttributes: true,
  showPrimaryLinks: true,
  showDetailsOnHover: true,
  data: JSON.stringify(entityNetworkData, null, 2),
  configurations: JSON.stringify(defaultConfigurationSettings,null,2), // Pass the configuration data here
};

export const EnterData = Template.bind({});
EnterData.args = {
  data: JSON.stringify(entityNetworkData, null, 2),
  configurations: JSON.stringify(defaultConfigurationSettings,null,2), // Pass the configuration data here
  showLegend: true,
  showAttributes: true,
  showPrimaryLinks: true,
  showDetailsOnHover: true,
};

/**
 * Story for the 'visualization-component' with showAttributes set to true.
 *
 * @story
 * @type {Object}
 */
export const HideAttributes = Template.bind({});
HideAttributes.args = {
  showAttributes: false,
  showLegend: true,
  showPrimaryLinks: true,
  showDetailsOnHover: true,
  data: JSON.stringify(defaultData, null, 2),
  configurations: JSON.stringify(defaultConfigurationSettings,null,2)
};

/**
 * Story for the 'visualization-component' with showAttributes set to false.
 *
 * @story
 * @type {Object}
 */

export const HidePrimaryLinks = Template.bind({});
HidePrimaryLinks.args = {
  showPrimaryLinks: false,
  showLegend: true,
  showAttributes: true,
  showDetailsOnHover: true,
  data: JSON.stringify(defaultData, null, 2),
  configurations: JSON.stringify(defaultConfigurationSettings,null,2)
};

export const HideDetailsOnHover = Template.bind({});
HideDetailsOnHover.args = {
  showDetailsOnHover: false,
  showLegend: true,
  showAttributes: true,
  showPrimaryLinks: true,
  data: JSON.stringify(defaultData, null, 2),
  configurations: JSON.stringify(defaultConfigurationSettings,null,2)
};

export const HideLegend = Template.bind({});
HideLegend.args = {
  showLegend: false,
  showAttributes: true,
  showPrimaryLinks: true,
  showDetailsOnHover: true,
  data: JSON.stringify(defaultData, null, 2),
  configurations: JSON.stringify(defaultConfigurationSettings,null,2)
};

export const MidComplexityExample = Template.bind({});
MidComplexityExample.args = {
  showLegend: false,
  showAttributes: false,
  showPrimaryLinks: true,
  showDetailsOnHover: true,
  data: JSON.stringify(midSizeData, null, 2),
  configurations: JSON.stringify(midSizeConfigurationSettings,null,2),
  size :"900px,650px"
};

export const HighComplexityExample = Template.bind({});
HighComplexityExample.args = {
  showLegend: false,
  showAttributes: false,
  showPrimaryLinks: true,
  showDetailsOnHover: true,
  data: JSON.stringify(highSizeData, null, 2),
  configurations: JSON.stringify(highSizeConfigurationSettings,null,2),
  size :"900px,650px"
};