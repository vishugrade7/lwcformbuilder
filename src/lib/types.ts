import type { LucideIcon } from 'lucide-react';

export type ComponentType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'checkbox'
  | 'dropdown'
  | 'textarea'
  | 'date'
  | 'radiogroup'
  | 'switch'
  | 'tel'
  | 'url'
  | 'search'
  | 'file';

export type ComponentVariant = 'standard' | 'label-hidden' | 'label-inline';
export type ComponentWidth = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';

export interface FormComponent {
  id: string;
  type: ComponentType;
  fieldName: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For dropdown, radiogroup
  helpText?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  disabled?: boolean;
  readOnly?: boolean;
  variant?: ComponentVariant;
  width?: ComponentWidth;
}

export interface AvailableComponent {
  name: string;
  icon: LucideIcon;
  type: ComponentType;
}
