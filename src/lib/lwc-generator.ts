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
      } = component;

      const commonProps = `label="${label}"
            name="${fieldName}"
            ${required ? 'required' : ''}
            ${disabled ? 'disabled' : ''}
            ${readOnly ? 'readonly' : ''}
            ${helpText ? `help-text="${helpText}"` : ''}`;

      switch (type) {
        case 'text':
        case 'email':
        case 'password':
        case 'number':
          return `        <lightning-input
            type="${type}"
            ${commonProps}
            ${placeholder ? `placeholder="${placeholder}"` : ''}
            ${minLength !== undefined ? `min-length="${minLength}"` : ''}
            ${maxLength !== undefined ? `max-length="${maxLength}"` : ''}
            ${pattern ? `pattern="${pattern}"` : ''}
            class="slds-m-bottom_small"
        ></lightning-input>`;
        case 'textarea':
          return `        <lightning-textarea
            ${commonProps}
            ${placeholder ? `placeholder="${placeholder}"` : ''}
            ${minLength !== undefined ? `min-length="${minLength}"` : ''}
            ${maxLength !== undefined ? `max-length="${maxLength}"` : ''}
            class="slds-m-bottom_small"
        ></lightning-textarea>`;
        case 'checkbox':
          return `        <lightning-input
            type="checkbox"
            ${commonProps}
            class="slds-m-bottom_small"
        ></lightning-input>`;
        case 'dropdown':
          return `        <lightning-combobox
            ${commonProps}
            value={value}
            placeholder="${placeholder || 'Select an Option'}"
            options={${fieldName}Options}
            class="slds-m-bottom_small"
        ></lightning-combobox>`;
        case 'date':
          return `        <lightning-input
            type="date"
            ${commonProps}
            class="slds-m-bottom_small"
        ></lightning-input>`;
        case 'radiogroup':
          return `        <lightning-radio-group
            ${commonProps}
            options={${fieldName}Options}
            value={value}
            class="slds-m-bottom_small"
        ></lightning-radio-group>`;
        case 'switch':
          return `        <lightning-input
            type="toggle"
            label="${label}"
            name="${fieldName}"
            ${disabled ? 'disabled' : ''}
            ${helpText ? `help-text="${helpText}"` : ''}
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
