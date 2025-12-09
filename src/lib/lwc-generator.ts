import type { FormComponent } from './types';

function toCamelCase(str: string): string {
  // Replace spaces and special characters, and capitalize the next letter
  let camel = str
    .replace(/[^a-zA-Z0-9]+(.)?/g, (m, chr) => (chr ? chr.toUpperCase() : ''))
    .replace(/^./, (str) => str.toLowerCase());
  return camel;
}

export function generateLwcHtml(components: FormComponent[]): string {
  const inputs = components
    .map((component) => {
      const { type, label, placeholder, required, options } = component;
      const fieldName = toCamelCase(label);

      switch (type) {
        case 'text':
        case 'email':
        case 'password':
        case 'number':
          return `        <lightning-input
            type="${type}"
            label="${label}"
            name="${fieldName}"
            ${placeholder ? `placeholder="${placeholder}"` : ''}
            ${required ? 'required' : ''}
            class="slds-m-bottom_small"
        ></lightning-input>`;
        case 'textarea':
          return `        <lightning-textarea
            label="${label}"
            name="${fieldName}"
            ${placeholder ? `placeholder="${placeholder}"` : ''}
            ${required ? 'required' : ''}
            class="slds-m-bottom_small"
        ></lightning-textarea>`;
        case 'checkbox':
          return `        <lightning-input
            type="checkbox"
            label="${label}"
            name="${fieldName}"
            ${required ? 'required' : ''}
            class="slds-m-bottom_small"
        ></lightning-input>`;
        case 'dropdown':
          return `        <lightning-combobox
            name="${fieldName}"
            label="${label}"
            value={value}
            placeholder="${placeholder || 'Select an Option'}"
            options={${fieldName}Options}
            ${required ? 'required' : ''}
            class="slds-m-bottom_small"
        ></lightning-combobox>`;
        case 'date':
          return `        <lightning-input
            type="date"
            label="${label}"
            name="${fieldName}"
            ${required ? 'required' : ''}
            class="slds-m-bottom_small"
        ></lightning-input>`;
        case 'radiogroup':
          return `        <lightning-radio-group
            name="${fieldName}"
            label="${label}"
            options={${fieldName}Options}
            value={value}
            ${required ? 'required' : ''}
            class="slds-m-bottom_small"
        ></lightning-radio-group>`;
        case 'switch':
          return `        <lightning-input
            type="toggle"
            label="${label}"
            name="${fieldName}"
            class="slds-m-bottom_small"
        ></lightning-input>`;
        default:
          return '';
      }
    })
    .join('\n\n');

  return `<template>
    <lightning-card title="Generated Form" icon-name="standard:account">
        <div class="slds-p-around_medium">
${inputs}
            <div class="slds-m-top_medium">
                <lightning-button
                    variant="brand"
                    label="Submit"
                    onclick={handleSubmit}
                ></lightning-button>
            </div>
        </div>
    </lightning-card>
</template>`;
}

export function generateLwcJs(components: FormComponent[]): string {
  const properties = components
    .map((component) => {
      if (component.type === 'dropdown' || component.type === 'radiogroup') {
        const fieldName = toCamelCase(component.label);
        const options =
          component.options?.map((opt) => ({ label: opt, value: opt })) || [];
        return `    ${fieldName}Options = ${JSON.stringify(options, null, 4)};`;
      }
      return null;
    })
    .filter(Boolean)
    .join('\n');

  return `import { LightningElement, track } from 'lwc';

export default class MyFormComponent extends LightningElement {
${properties ? properties + '\n' : ''}
    @track value;

    // Add your form handling logic here
    // e.g., handleChange(event) { ... }
    handleSubmit(event) {
        // Implement your submit logic
        console.log('Form submitted');
    }
}
`;
}
