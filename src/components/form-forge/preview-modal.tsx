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

interface PreviewModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  components: FormComponent[];
}

export default function PreviewModal({
  isOpen,
  onOpenChange,
  components,
}: PreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Form Preview</DialogTitle>
          <DialogDescription>
            This is how your form will look to end-users.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 p-6 border rounded-lg max-h-[60vh] overflow-y-auto">
          <form className="space-y-6">
            {components.map((component) => {
              const { id, type, label, placeholder, required, options } =
                component;
              const inputId = `preview-input-${id}`;

              switch (type) {
                case 'textarea':
                  return (
                    <div key={id}>
                      <Label htmlFor={inputId}>
                        {label}
                        {required && <span className="text-destructive"> *</span>}
                      </Label>
                      <Textarea
                        id={inputId}
                        placeholder={placeholder}
                        required={required}
                        className="mt-1"
                      />
                    </div>
                  );
                case 'dropdown':
                  return (
                    <div key={id}>
                      <Label htmlFor={inputId}>
                        {label}
                        {required && <span className="text-destructive"> *</span>}
                      </Label>
                      <Select required={required}>
                        <SelectTrigger id={inputId} className="mt-1">
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
                    </div>
                  );
                case 'checkbox':
                  return (
                    <div key={id} className="flex items-center space-x-2">
                      <Checkbox id={inputId} required={required} />
                      <Label htmlFor={inputId} className="font-normal">
                        {label}
                        {required && <span className="text-destructive"> *</span>}
                      </Label>
                    </div>
                  );
                case 'date':
                  return (
                    <div key={id}>
                      <Label>
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
                          <Calendar
                            mode="single"
                            initialFocus
                            required={required}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  );
                case 'radiogroup':
                  return (
                    <div key={id}>
                      <Label>
                        {label}
                        {required && <span className="text-destructive"> *</span>}
                      </Label>
                      <RadioGroup required={required} className="mt-2 space-y-2">
                        {options?.map((option, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <RadioGroupItem
                              value={option}
                              id={`${inputId}-${i}`}
                            />
                            <Label
                              htmlFor={`${inputId}-${i}`}
                              className="font-normal"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  );
                case 'switch':
                  return (
                    <div key={id} className="flex items-center space-x-2">
                      <Switch id={inputId} />
                      <Label htmlFor={inputId} className="font-normal">
                        {label}
                      </Label>
                    </div>
                  );
                default:
                  return (
                    <div key={id}>
                      <Label htmlFor={inputId}>
                        {label}
                        {required && <span className="text-destructive"> *</span>}
                      </Label>
                      <Input
                        id={inputId}
                        type={type}
                        placeholder={placeholder}
                        required={required}
                        className="mt-1"
                      />
                    </div>
                  );
              }
            })}
            <div className="flex justify-end pt-4">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
