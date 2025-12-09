'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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
import { Button } from '../ui/button';
import type { FormComponent } from '@/lib/types';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
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

interface PreviewModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  components: FormComponent[];
}

const renderInput = (component: FormComponent) => {
  const {
    id,
    type,
    placeholder,
    options,
    required,
    label,
    src,
    alt,
    value,
    columns,
  } = component;
  const inputId = `preview-input-${id}`;

  switch (type) {
    case 'textarea':
      return (
        <Textarea
          id={inputId}
          placeholder={placeholder}
          required={required}
          className="mt-1"
        />
      );
    case 'dropdown':
      return (
        <Select required={required}>
          <SelectTrigger id={inputId} className="w-full">
            <SelectValue placeholder={placeholder} />
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
        <div className="flex items-center space-x-2 pt-2">
          <Checkbox id={inputId} required={required} />
          <Label htmlFor={inputId} className="font-normal">
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
            <Calendar mode="single" initialFocus required={required} />
          </PopoverContent>
        </Popover>
      );
    case 'radiogroup':
      return (
        <RadioGroup required={required} className="mt-2 space-y-2">
          {options?.map((option, i) => (
            <div key={i} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`${inputId}-${i}`} />
              <Label htmlFor={`${inputId}-${i}`} className="font-normal">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
    case 'switch':
      return (
        <div className="flex items-center space-x-2 pt-2">
          <Switch id={inputId} />
          <Label htmlFor={inputId} className="font-normal">
            {label}
          </Label>
        </div>
      );
    case 'image':
      return src ? (
        <Image
          src={src}
          alt={alt || ''}
          width={400}
          height={300}
          className="w-full h-auto object-contain rounded-md"
        />
      ) : null;
    case 'richtext':
      return (
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: value || '' }}
        />
      );
    case 'datatable':
      const sampleData = Array(3)
        .fill(0)
        .map((_, i) =>
          columns?.reduce(
            (acc, col) => ({ ...acc, [col.fieldName]: `Row ${i + 1} Data` }),
            { id: i }
          )
        );

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
            {sampleData.map((row) => (
              <TableRow key={row.id}>
                {columns?.map((col, i) => (
                  <TableCell key={i}>{row[col.fieldName]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    default:
      return (
        <Input
          id={inputId}
          type={type}
          placeholder={placeholder}
          required={required}
        />
      );
  }
};

const renderLabel = (component: FormComponent) => {
  const { id, type, label, required, variant } = component;
  const inputId = `preview-input-${id}`;

  if (
    variant === 'label-hidden' ||
    type === 'checkbox' ||
    type === 'switch' ||
    variant === 'label-inline' ||
    type === 'image' ||
    type === 'richtext' ||
    type === 'datatable'
  )
    return null;

  return (
    <Label htmlFor={inputId}>
      {label}
      {required && <span className="text-destructive"> *</span>}
    </Label>
  );
};

const renderComponent = (component: FormComponent) => {
  const { id, label, required, variant, type } = component;
  const inputId = `preview-input-${id}`;
  const widthClass = `col-span-${component.width || 12}`;

  if (variant === 'label-inline' && type !== 'checkbox' && type !== 'switch') {
    return (
      <div key={id} className={cn('grid grid-cols-3 items-center', widthClass)}>
        <Label htmlFor={inputId} className="text-right pr-4">
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
        <div className="col-span-2">{renderInput(component)}</div>
      </div>
    );
  }

  return (
    <div key={id} className={widthClass}>
      {renderLabel(component)}
      <div className={cn(renderLabel(component) && 'mt-1')}>
        {renderInput(component)}
      </div>
    </div>
  );
};

export default function PreviewModal({
  isOpen,
  onOpenChange,
  components,
}: PreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Form Preview</DialogTitle>
          <DialogDescription>
            This is how your form will look to end-users.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 p-6 border rounded-lg max-h-[60vh] overflow-y-auto">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="w-full space-y-4"
          >
            <div className="grid grid-cols-12 gap-x-4 gap-y-6">
              {components.map((component) => renderComponent(component))}
            </div>
            <div className="flex justify-end pt-4 col-span-12">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
