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
  | 'switch';

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
}

export interface AvailableComponent {
  name: string;
  icon: LucideIcon;
  type: ComponentType;
}
