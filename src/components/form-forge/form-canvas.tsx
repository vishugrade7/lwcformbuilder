'use client';

import { useState } from 'react';
import type { FormComponent } from '@/lib/types';
import CanvasItem from './canvas-item';
import { cn } from '@/lib/utils';

interface FormCanvasProps {
  components: FormComponent[];
  onDrop: (e: React.DragEvent<HTMLDivElement>, targetId?: string) => void;
  onSelectComponent: (id: string) => void;
  onDeleteComponent: (id: string) => void;
  selectedComponentId: string | null;
  onReorder: (draggedId: string, targetId: string) => void;
}

export default function FormCanvas({
  components,
  onDrop,
  onSelectComponent,
  onDeleteComponent,
  selectedComponentId,
  onReorder,
}: FormCanvasProps) {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.setData('componentId', id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleItemDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedItemId && draggedItemId !== id) {
      setDragOverId(id);
    }
  };

  const handleDragEnd = () => {
    if (draggedItemId && dragOverId) {
      onReorder(draggedItemId, dragOverId);
    }
    setDraggedItemId(null);
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDrop(e);
    handleDragEnd();
  };

  return (
    <main
      className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={() => setDragOverId(null)}
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
          <div className="grid grid-cols-12 gap-x-4 gap-y-2">
            {components.map((component) => (
              <div
                key={component.id}
                className={cn(
                  'col-span-12 transition-all duration-200',
                  dragOverId === component.id &&
                    'pt-10 -mt-10 border-t-2 border-primary'
                )}
              >
                <CanvasItem
                  component={component}
                  isSelected={selectedComponentId === component.id}
                  onSelect={onSelectComponent}
                  onDelete={onDeleteComponent}
                  onDragStart={(e) => handleDragStart(e, component.id)}
                  onDragOver={(e) => handleItemDragOver(e, component.id)}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedItemId === component.id}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
