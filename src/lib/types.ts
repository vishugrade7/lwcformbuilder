import type { LucideIcon } from 'lucide-react';

export type ComponentType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'checkbox'
  | 'dropdown'
  | 'textarea';

export interface FormComponent {
  id: string;
  type: ComponentType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For dropdown
  validations?: string[];
}

export interface AvailableComponent {
  name: string;
  icon: LucideIcon;
  type: ComponentType;
}
