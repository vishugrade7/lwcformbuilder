import type { FormComponent } from './types';

function toCamelCase(str: string): string {
  return str.replace(/[^a-zA-Z0-9]+(.)?/g, (m, chr) => chr.toUpperCase());
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
        default:
          return '';
      }
    })
    .join('\n\n');

  return `<template>
    <lightning-card title="Generated Form" icon-name="standard:account">
        <div class="slds-p-around_medium">
${inputs}
        </div>
    </lightning-card>
</template>`;
}

export function generateLwcJs(components: FormComponent[]): string {
  const properties = components
    .map((component) => {
      if (component.type === 'dropdown') {
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
}
`;
}
