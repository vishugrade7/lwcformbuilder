import type { AvailableComponent } from '@/lib/types';
import {
  CaseSensitive,
  CheckSquare,
  ChevronDown,
  CircleDot,
  Hash,
  KeyRound,
  Mail,
  MessageSquare,
  CalendarDays,
  ToggleRight,
} from 'lucide-react';

export const AVAILABLE_COMPONENTS: AvailableComponent[] = [
  { name: 'Text Input', icon: CaseSensitive, type: 'text' },
  { name: 'Email', icon: Mail, type: 'email' },
  { name: 'Password', icon: KeyRound, type: 'password' },
  { name: 'Number', icon: Hash, type: 'number' },
  { name: 'Text Area', icon: MessageSquare, type: 'textarea' },
  { name: 'Dropdown', icon: ChevronDown, type: 'dropdown' },
  { name: 'Checkbox', icon: CheckSquare, type: 'checkbox' },
  { name: 'Date', icon: CalendarDays, type: 'date' },
  { name: 'Radio Group', icon: CircleDot, type: 'radiogroup' },
  { name: 'Switch', icon: ToggleRight, type: 'switch' },
];
