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
  argTypes: {
    showAttributes: { control: 'radio', options: [true, false] },
    excludeProperties: {
      control: 'text',
      description: 'Comma-separated list of properties to exclude',
    },
  },
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
  display-hovered="${args.displayHovered}"
  exclude-properties="${args.excludeProperties}"
  size ="1350px,650px"
></visualization-component>`;

export const Default = Template.bind({});
Default.args = {
  showAttributes: true,
  showPrimaryLinks: true,
  displayHovered: true,
};
/**
 * Story for the 'visualization-component' with showAttributes set to true.
 *
 * @story
 * @type {Object}
 */
export const ShowAttributes = Template.bind({});
ShowAttributes.args = {
  showAttributes: true,
};

/**
 * Story for the 'visualization-component' with showAttributes set to false.
 *
 * @story
 * @type {Object}
 */
// export const ShowAttributesFalse = Template.bind({});
// ShowAttributesFalse.args = {
//   showAttributes: false,
// };

export const showPrimaryLinks = Template.bind({});
showPrimaryLinks.args = {
  showPrimaryLinks: false,
};

export const displayHovered = Template.bind({});
displayHovered.args = {
  displayHovered: true,
};

export const ExcludeProperties = Template.bind({});
ExcludeProperties.args = {
  showAttributes: true,
  showPrimaryLinks: true,
  displayHovered: true,
  size: '1350px,650px',
  excludeProperties: '', //
};

/**
 * Story for the 'visualization-component' with dynamic data input.
 *
 * @story
 * @type {Object}
 */
export const DynamicData = Template.bind({});
DynamicData.args = {
  showAttributes: true,
  showPrimaryLinks: true,
  displayHovered: true,
  excludeProperties: '',
  data: '[]', // Start with empty data or a default dataset
};
DynamicData.argTypes = {
  ...Default.argTypes,
  data: {
    control: 'text',
    description: 'JSON data for the visualization',
  },
};

// export const size = Template.bind({});
// size.args = {
//   size: "1350px,650px"
// };
