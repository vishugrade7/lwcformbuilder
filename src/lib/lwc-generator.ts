import type { FormComponent } from './types';

export function generateLwcHtml(components: FormComponent[]): string {
  const inputs = components
    .map((component) => {
      const {
        type,
        label,
        fieldName,
        placeholder,
        required,
        options,
        helpText,
        minLength,
        maxLength,
        pattern,
        disabled,
        readOnly,
        variant,
        width,
      } = component;

      const commonProps = `label="${label}"
            name="${fieldName}"
            ${required ? 'required' : ''}
            ${disabled ? 'disabled' : ''}
            ${readOnly ? 'readonly' : ''}
            ${variant ? `variant="${variant}"` : ''}
            ${helpText ? `field-level-help="${helpText}"` : ''}`;

      let componentHtml = '';

      switch (type) {
        case 'text':
        case 'email':
        case 'password':
        case 'number':
          componentHtml = `        <lightning-input
            type="${type}"
            ${commonProps}
            ${placeholder ? `placeholder="${placeholder}"` : ''}
            ${minLength !== undefined ? `min-length="${minLength}"` : ''}
            ${maxLength !== undefined ? `max-length="${maxLength}"` : ''}
            ${pattern ? `pattern="${pattern}"` : ''}
        ></lightning-input>`;
          break;
        case 'textarea':
          componentHtml = `        <lightning-textarea
            ${commonProps}
            ${placeholder ? `placeholder="${placeholder}"` : ''}
            ${minLength !== undefined ? `min-length="${minLength}"` : ''}
            ${maxLength !== undefined ? `max-length="${maxLength}"` : ''}
        ></lightning-textarea>`;
          break;
        case 'checkbox':
          componentHtml = `        <lightning-input
            type="checkbox"
            ${commonProps}
        ></lightning-input>`;
          break;
        case 'dropdown':
          componentHtml = `        <lightning-combobox
            ${commonProps}
            value={value}
            placeholder="${placeholder || 'Select an Option'}"
            options={${fieldName}Options}
        ></lightning-combobox>`;
          break;
        case 'date':
          componentHtml = `        <lightning-input
            type="date"
            ${commonProps}
        ></lightning-input>`;
          break;
        case 'radiogroup':
          componentHtml = `        <lightning-radio-group
            ${commonProps}
            options={${fieldName}Options}
            value={value}
        ></lightning-radio-group>`;
          break;
        case 'switch':
          componentHtml = `        <lightning-input
            type="toggle"
            label="${label}"
            name="${fieldName}"
            ${disabled ? 'disabled' : ''}
            ${helpText ? `message-toggle-active="" message-toggle-inactive=""` : ''}
        ></lightning-input>`;
          break;
        default:
          return '';
      }
      return `<lightning-layout-item size="${
        width || '12'
      }" padding="horizontal-small" class="slds-m-bottom_small">
${componentHtml}
        </lightning-layout-item>`;
    })
    .join('\n\n');

  return `<template>
    <lightning-card title="Generated Form" icon-name="standard:account">
        <div class="slds-p-around_medium">
            <lightning-layout multiple-rows="true">
${inputs}
            </lightning-layout>
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
        const fieldName = component.fieldName;
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
