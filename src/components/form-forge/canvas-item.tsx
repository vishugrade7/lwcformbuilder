'use client';
import { cn } from '@/lib/utils';
import type { FormComponent } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { CalendarIcon, GripVertical, Trash2 } from 'lucide-react';
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
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';

interface CanvasItemProps {
  component: FormComponent;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  isDragging: boolean;
}

const ComponentPreview = ({ component }: { component: FormComponent }) => {
  const {
    type,
    label,
    placeholder,
    required,
    options,
    variant,
    src,
    alt,
    value,
    columns,
  } = component;
  const id = `preview-${component.id}`;
  const hideLabel = variant === 'label-hidden';

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return <Textarea id={id} placeholder={placeholder} readOnly />;
      case 'dropdown':
        return (
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
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
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
        );
      case 'radiogroup':
        return (
          <RadioGroup id={id} className="mt-2 space-y-2">
            {options?.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${id}-${i}`} />
                <Label htmlFor={`${id}-${i}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'switch':
        return (
          <div className="flex items-center space-x-2">
            <Switch id={id} />
            <Label htmlFor={id}>{label}</Label>
          </div>
        );
      case 'image':
        return (
          <div className="w-full bg-muted rounded-md aspect-video flex items-center justify-center">
            {src ? (
              <Image
                src={src}
                alt={alt || 'placeholder'}
                width={300}
                height={200}
                className="object-cover rounded-md"
              />
            ) : (
              <span className="text-muted-foreground text-sm">Image</span>
            )}
          </div>
        );
      case 'richtext':
        return (
          <div
            className="prose prose-sm max-w-none p-2 border rounded-md bg-muted"
            dangerouslySetInnerHTML={{
              __html: value || '<p>Rich text content...</p>',
            }}
          />
        );
      case 'datatable':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                {columns?.map((col, i) => (
                  <TableHead key={i}>{col.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                {columns?.map((col, i) => (
                  <TableCell key={i}>Sample Data</TableCell>
                ))}
              </TableRow>
              <TableRow>
                {columns?.map((col, i) => (
                  <TableCell key={i}>Sample Data</TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        );
      default:
        return (
          <Input
            id={id}
            type={type}
            placeholder={placeholder}
            readOnly
            className="bg-muted"
          />
        );
    }
  };

  const renderLabel = () => {
    if (
      hideLabel ||
      type === 'checkbox' ||
      type === 'switch' ||
      variant === 'label-inline' ||
      type === 'image' ||
      type === 'richtext' ||
      type === 'datatable'
    )
      return null;
    return (
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
    );
  };

  if (variant === 'label-inline' && type !== 'checkbox' && type !== 'switch') {
    return (
      <div className="grid grid-cols-3 items-center gap-4">
        <Label htmlFor={id} className="text-right">
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
        <div className="col-span-2">{renderInput()}</div>
      </div>
    );
  }

  return (
    <div>
      {renderLabel()}
      <div className={cn(renderLabel() && 'mt-1')}>{renderInput()}</div>
    </div>
  );
};

export default function CanvasItem({
  component,
  isSelected,
  onSelect,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
}: CanvasItemProps) {
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onDelete(component.id);
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, component.id)}
      onDragOver={(e) => onDragOver(e, component.id)}
      onDragEnd={onDragEnd}
      onClick={() => onSelect(component.id)}
      className={cn(
        'p-4 rounded-lg cursor-pointer relative group transition-all',
        isSelected
          ? 'bg-primary/5 border-2 border-primary'
          : 'bg-transparent border-2 border-transparent hover:bg-accent',
        isDragging && 'opacity-50'
      )}
      aria-selected={isSelected}
    >
      <div className={cn('pointer-events-none')}>
        <ComponentPreview component={component} />
      </div>

      <div
        className={cn(
          'absolute top-1/2 -translate-y-1/2 -left-1 h-8 w-6 items-center justify-center rounded-l-md bg-transparent opacity-0 group-hover:opacity-100 transition-opacity',
          isSelected && 'opacity-100'
        )}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
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
