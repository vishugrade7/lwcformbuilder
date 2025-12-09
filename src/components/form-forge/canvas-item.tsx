'use client';
import { cn } from '@/lib/utils';
import type { FormComponent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Switch } from '../ui/switch';

interface CanvasItemProps {
  component: FormComponent;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

const ComponentPreview = ({ component }: { component: FormComponent }) => {
  const { type, label, placeholder, required, options } = component;
  const id = `preview-${component.id}`;
  switch (type) {
    case 'textarea':
      return (
        <div>
          <Label htmlFor={id}>
            {label}
            {required && <span className="text-destructive"> *</span>}
          </Label>
          <Textarea id={id} placeholder={placeholder} readOnly />
        </div>
      );
    case 'dropdown':
      return (
        <div>
          <Label htmlFor={id}>
            {label}
            {required && <span className="text-destructive"> *</span>}
          </Label>
          <Select>
            <SelectTrigger id={id}>
              <SelectValue placeholder={placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {options?.map((opt, i) => (
                <SelectItem key={i} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    case 'checkbox':
      return (
        <div className="flex items-center space-x-2">
          <Checkbox id={id} />
          <Label htmlFor={id}>
            {label}
            {required && <span className="text-destructive"> *</span>}
          </Label>
        </div>
      );
    case 'date':
      return (
        <div>
          <Label htmlFor={id}>
            {label}
            {required && <span className="text-destructive"> *</span>}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal mt-1',
                  !label && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Pick a date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      );
    case 'radiogroup':
      return (
        <div>
          <Label htmlFor={id}>
            {label}
            {required && <span className="text-destructive"> *</span>}
          </Label>
          <RadioGroup id={id} className="mt-2 space-y-2">
            {options?.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${id}-${i}`} />
                <Label htmlFor={`${id}-${i}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );
    case 'switch':
      return (
        <div className="flex items-center space-x-2">
          <Switch id={id} />
          <Label htmlFor={id}>{label}</Label>
        </div>
      );
    default:
      return (
        <div>
          <Label htmlFor={id}>
            {label}
            {required && <span className="text-destructive"> *</span>}
          </Label>
          <Input
            id={id}
            type={type}
            placeholder={placeholder}
            readOnly
            className="bg-muted"
          />
        </div>
      );
  }
};

export default function CanvasItem({
  component,
  isSelected,
  onSelect,
  onDelete,
}: CanvasItemProps) {
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete(component.id);
  };
  return (
    <div
      onClick={() => onSelect(component.id)}
      className={cn(
        'p-4 rounded-lg cursor-pointer relative group transition-all',
        isSelected
          ? 'bg-primary/5 border-2 border-primary'
          : 'bg-transparent border-2 border-transparent hover:bg-accent'
      )}
      aria-selected={isSelected}
    >
      <div className="pointer-events-none">
        <ComponentPreview component={component} />
      </div>

      <Button
        variant="destructive"
        size="icon"
        className={cn(
          'absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity',
          isSelected && 'opacity-100'
        )}
        onClick={handleDelete}
        aria-label={`Delete ${component.label} component`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
