'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { FormComponent } from '@/lib/types';
import { Plus, X } from 'lucide-react';

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

  return (
    <aside className="w-80 p-4 border-l bg-card overflow-y-auto hidden lg:block">
      <h2 className="text-xl font-semibold mb-6">Configuration</h2>
      <div className="space-y-6">
        <div>
          <Label htmlFor="label">Label</Label>
          <div className="flex items-center gap-1 mt-1">
            <Input
              id="label"
              value={selectedComponent.label}
              onChange={(e) =>
                onUpdateComponent(selectedComponent.id, { label: e.target.value })
              }
            />
          </div>
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
        {showRequired && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="required"
              checked={selectedComponent.required}
              onCheckedChange={(checked) =>
                onUpdateComponent(selectedComponent.id, {
                  required: !!checked,
                })
              }
            />
            <Label htmlFor="required">Required</Label>
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
