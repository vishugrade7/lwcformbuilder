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
        src,
        alt,
        value,
        columns,
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
        case 'tel':
        case 'url':
        case 'search':
          componentHtml = `        <lightning-input
            type="${type}"
            ${commonProps}
            ${placeholder ? `placeholder="${placeholder}"` : ''}
            ${minLength !== undefined ? `min-length="${minLength}"` : ''}
            ${maxLength !== undefined ? `max-length="${maxLength}"` : ''}
            ${pattern ? `pattern="${pattern}"` : ''}
        ></lightning-input>`;
          break;
        case 'file':
          componentHtml = `        <lightning-input
            type="file"
            label="${label}"
            name="${fieldName}"
            ${required ? 'required' : ''}
            ${disabled ? 'disabled' : ''}
            ${helpText ? `field-level-help="${helpText}"` : ''}
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
        case 'image':
          componentHtml = `        <img src="${src}" alt="${
            alt || ''
          }" class="slds-image slds-image_responsive">`;
          break;
        case 'richtext':
          componentHtml = `        <lightning-formatted-rich-text
            value={${fieldName}Value}
        ></lightning-formatted-rich-text>`;
          break;
        case 'datatable':
          componentHtml = `        <lightning-datatable
            key-field="id"
            data={${fieldName}Data}
            columns={${fieldName}Columns}
            hide-checkbox-column
        ></lightning-datatable>`;
          break;
        case 'section-heading':
          componentHtml = `        <h2 class="slds-text-heading_medium slds-m-bottom_small">${label}</h2>`;
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
      const { type, fieldName, value, options, columns } = component;
      if (type === 'dropdown' || type === 'radiogroup') {
        const opts =
          options?.map((opt) => ({ label: opt, value: opt })) || [];
        return `    ${fieldName}Options = ${JSON.stringify(opts, null, 4)};`;
      }
      if (type === 'richtext') {
        return `    ${fieldName}Value = \`${value || ''}\`;`;
      }
      if (type === 'datatable') {
        const colDefs = columns?.map(col => ({ label: col.label, fieldName: col.fieldName })) || [];
        const data = Array(3).fill(0).map((_, i) => 
          columns?.reduce((acc, col) => ({...acc, [col.fieldName]: `Sample Data ${i+1}`}), {id: i}) || {}
        );
        return `    ${fieldName}Columns = ${JSON.stringify(colDefs, null, 4)};
    ${fieldName}Data = ${JSON.stringify(data, null, 4)};`;
      }
      return null;
    })
    .filter(Boolean)
    .join('\n\n');

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
