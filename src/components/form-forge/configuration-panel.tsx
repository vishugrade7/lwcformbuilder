'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FormComponent } from '@/lib/types';
import { Plus, X } from 'lucide-react';
import { Switch } from '../ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface ConfigurationPanelProps {
  selectedComponent: FormComponent | null;
  onUpdateComponent: (id: string, updates: Partial<FormComponent>) => void;
}

export default function ConfigurationPanel({
  selectedComponent,
  onUpdateComponent,
}: ConfigurationPanelProps) {
  const handleOptionChange = (index: number, value: string) => {
    if (!selectedComponent || !selectedComponent.options) return;
    const newOptions = [...selectedComponent.options];
    newOptions[index] = value;
    onUpdateComponent(selectedComponent.id, { options: newOptions });
  };

  const addOption = () => {
    if (!selectedComponent) return;
    const newOptions = [...(selectedComponent.options || []), 'New Option'];
    onUpdateComponent(selectedComponent.id, { options: newOptions });
  };

  const removeOption = (index: number) => {
    if (!selectedComponent || !selectedComponent.options) return;
    const newOptions = selectedComponent.options.filter((_, i) => i !== index);
    onUpdateComponent(selectedComponent.id, { options: newOptions });
  };

  if (!selectedComponent) {
    return (
      <aside className="w-80 p-4 border-l bg-card hidden lg:flex flex-col items-center justify-center text-center">
        <p className="text-lg font-semibold text-muted-foreground">
          Configuration
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Select a component on the canvas to see its properties.
        </p>
      </aside>
    );
  }

  const showPlaceholder = [
    'text',
    'email',
    'password',
    'number',
    'textarea',
    'dropdown',
  ].includes(selectedComponent.type);

  const showRequired = !['switch'].includes(selectedComponent.type);

  const showOptions = ['dropdown', 'radiogroup'].includes(
    selectedComponent.type
  );

  const showLength = ['text', 'password', 'textarea'].includes(
    selectedComponent.type
  );
  const showPattern = ['text', 'password', 'email', 'number'].includes(
    selectedComponent.type
  );

  const showVariant = ![
    'checkbox',
    'switch',
    'radiogroup',
    'date',
  ].includes(selectedComponent.type);

  return (
    <aside className="w-80 p-4 border-l bg-card overflow-y-auto hidden lg:block">
      <h2 className="text-xl font-semibold mb-6">Configuration</h2>
      <div className="space-y-6">
        <div>
          <Label htmlFor="fieldName">Field Name</Label>
          <Input
            id="fieldName"
            value={selectedComponent.fieldName}
            onChange={(e) =>
              onUpdateComponent(selectedComponent.id, {
                fieldName: e.target.value,
              })
            }
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={selectedComponent.label}
            onChange={(e) =>
              onUpdateComponent(selectedComponent.id, { label: e.target.value })
            }
            className="mt-1"
          />
        </div>
        {showPlaceholder && (
          <div>
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              className="mt-1"
              value={selectedComponent.placeholder || ''}
              onChange={(e) =>
                onUpdateComponent(selectedComponent.id, {
                  placeholder: e.target.value,
                })
              }
            />
          </div>
        )}
        <div>
          <Label htmlFor="helpText">Help Text</Label>
          <Input
            id="helpText"
            className="mt-1"
            value={selectedComponent.helpText || ''}
            onChange={(e) =>
              onUpdateComponent(selectedComponent.id, {
                helpText: e.target.value,
              })
            }
          />
        </div>

        {showVariant && (
          <div>
            <Label htmlFor="variant">Variant</Label>
            <Select
              value={selectedComponent.variant || 'standard'}
              onValueChange={(value) =>
                onUpdateComponent(selectedComponent.id, {
                  variant: value as FormComponent['variant'],
                })
              }
            >
              <SelectTrigger id="variant" className="mt-1">
                <SelectValue placeholder="Select variant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="label-hidden">Label Hidden</SelectItem>
                <SelectItem value="label-inline">Label Inline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label htmlFor="width">Width</Label>
          <Select
            value={selectedComponent.width || '12'}
            onValueChange={(value) =>
              onUpdateComponent(selectedComponent.id, {
                width: value as FormComponent['width'],
              })
            }
          >
            <SelectTrigger id="width" className="mt-1">
              <SelectValue placeholder="Select width" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>
                  {i + 1}/12
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          {showRequired && (
            <div className="flex items-center justify-between">
              <Label htmlFor="required">Required</Label>
              <Switch
                id="required"
                checked={selectedComponent.required}
                onCheckedChange={(checked) =>
                  onUpdateComponent(selectedComponent.id, {
                    required: !!checked,
                  })
                }
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <Label htmlFor="disabled">Disabled</Label>
            <Switch
              id="disabled"
              checked={selectedComponent.disabled}
              onCheckedChange={(checked) =>
                onUpdateComponent(selectedComponent.id, {
                  disabled: !!checked,
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="readOnly">Read-only</Label>
            <Switch
              id="readOnly"
              checked={selectedComponent.readOnly}
              onCheckedChange={(checked) =>
                onUpdateComponent(selectedComponent.id, {
                  readOnly: !!checked,
                })
              }
            />
          </div>
        </div>

        {showLength && (
          <>
            <div>
              <Label htmlFor="minLength">Min Length</Label>
              <Input
                id="minLength"
                type="number"
                className="mt-1"
                value={selectedComponent.minLength || ''}
                onChange={(e) =>
                  onUpdateComponent(selectedComponent.id, {
                    minLength: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="maxLength">Max Length</Label>
              <Input
                id="maxLength"
                type="number"
                className="mt-1"
                value={selectedComponent.maxLength || ''}
                onChange={(e) =>
                  onUpdateComponent(selectedComponent.id, {
                    maxLength: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
          </>
        )}

        {showPattern && (
          <div>
            <Label htmlFor="pattern">Pattern</Label>
            <Input
              id="pattern"
              className="mt-1"
              value={selectedComponent.pattern || ''}
              onChange={(e) =>
                onUpdateComponent(selectedComponent.id, {
                  pattern: e.target.value,
                })
              }
            />
          </div>
        )}

        {showOptions && (
          <div className="space-y-2">
            <Label>Options</Label>
            <div className="space-y-2">
              {selectedComponent.options?.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={addOption}>
              <Plus className="mr-2 h-4 w-4" /> Add Option
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
