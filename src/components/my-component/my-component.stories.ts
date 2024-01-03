// import exp from "constants";

export default
{

    title: 'Components/MyComponent',
    component: 'my-component',
    argTypes: {
        showAttributes: { control: 'radio', options: [true, false] },
      }

};


const Template = () => '<my-component .show-attributes = "${showAttributes}"></my-component>';

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

// // import { h } from '@stencil/core';
// // import { storiesOf } from '@storybook/web-components';
// // import { MyComponent } from './my-component';

// // export default
// // {

// //     title: 'Components/MyComponent',
// // };

// storiesOf('Components/MyComponent', module).add('Example', () => {
//     const includedProperties = 'KIP,SIP,TIP,KIT,SAP,RWTH,BIRLA,KPMG,IIT';
//     const visualizationMode = 'all';
//     const first = 'Ajay';
//     const middle = 'Singh';
//     const last = 'Kirar';
  
//     return (
//       <my-component
//         included-properties={includedProperties}
//         visualization-mode={visualizationMode}
//         first={first}
//         middle={middle}
//         last={last}
//       ></my-component>
//     );
//   });



// import './my-component.tsx'; // Import your component
// import { h } from '@stencil/core';
// import { storiesOf } from '@storybook/web-components';


// storiesOf('Components/MyComponent', module).add('Example', () => {
//   const includedProperties = 'KIP,SIP,TIP,KIT,SAP,RWTH,BIRLA,KPMG,IIT';
//   const visualizationMode = 'all';
//   const first = 'Ajay';
//   const middle = 'Singh';
//   const last = 'Kirar';

//   return (
//     <div>
//     <my-component
//     includedProperties={includedProperties}
//     visualizationMode={visualizationMode}
//     first={first}
//     middle={middle}
//     last={last}
//   ></my-component>
//     </div>
   
//   );
// });

