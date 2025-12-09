'use client';

import type { FormComponent } from '@/lib/types';
import CanvasItem from './canvas-item';

interface FormCanvasProps {
  components: FormComponent[];
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onSelectComponent: (id: string) => void;
  onDeleteComponent: (id: string) => void;
  selectedComponentId: string | null;
}

export default function FormCanvas({
  components,
  onDrop,
  onSelectComponent,
  onDeleteComponent,
  selectedComponentId,
}: FormCanvasProps) {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <main
      className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto"
      onDragOver={handleDragOver}
      onDrop={onDrop}
    >
      <div className="max-w-4xl mx-auto bg-card p-6 sm:p-8 rounded-xl shadow-sm border min-h-[calc(100vh-150px)]">
        {components.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-border rounded-lg p-12 text-center">
            <p className="text-lg font-semibold text-muted-foreground">
              Build Your Form
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Drag and drop components from the left panel to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {components.map((component) => (
              <CanvasItem
                key={component.id}
                component={component}
                isSelected={selectedComponentId === component.id}
                onSelect={onSelectComponent}
                onDelete={onDeleteComponent}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
