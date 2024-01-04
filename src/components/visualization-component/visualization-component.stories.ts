// import exp from "constants";

export default
{

    title: 'Components/VisualizationComponent',
    component: 'visualization-component',
    argTypes: {
        showAttributes: { control: 'radio', options: [true, false] },
      }

};


const Template = () => '<visualization-component show-attributes = "${showAttributes}"></visualization-component>';

export const Example =Template.bind({});
Example.args ={
         includedProperties : 'KIP,SIP,TIP,KIT,SAP,RWTH,BIRLA,KPMG,IIT',
     visualizationMode : 'all',

}
export const ShowAttributesTrue = Template.bind({});
ShowAttributesTrue.args = {
  showAttributes: true,
};
export const ShowAttributesFalse = Template.bind({});
ShowAttributesFalse.args = {
  showAttributes: false,
};


