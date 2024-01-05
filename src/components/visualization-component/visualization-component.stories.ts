/**
 * Storybook configuration for the 'visualization-component' web component.
 * Defines different stories and their corresponding parameters.
 *
 */
export default
  {
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
    }

  };
/**
 * Template function to create a basic story with the 'visualization-component'.
 *
 * @story
 * @type {Function}
 */
const Template = (args) => `<div style="display: flex; justify-content: center; align-items: center; height: 90vh;">
<visualization-component 
  show-attributes="${args.showAttributes}" 
  show-primary-links="${args.showPrimaryLinks}"
  display-hovered="${args.displayHovered}"
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
  showPrimaryLinks: false
};

// export const excludeProperties = Template.bind({});
// excludeProperties.args = {
//   excludeProperties: false
// };

export const displayHovered = Template.bind({});
displayHovered.args = {
  displayHovered: true
};

// export const size = Template.bind({});
// size.args = {
//   size: "1350px,650px"
// };