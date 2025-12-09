'use client';

import { AVAILABLE_COMPONENTS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export default function ComponentLibrary() {
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    componentType: string
  ) => {
    e.dataTransfer.setData('componentType', componentType);
  };

  return (
    <aside className="w-72 p-4 border-r bg-card overflow-y-auto hidden md:block">
      <h2 className="text-xl font-semibold mb-4 px-2">Components</h2>
      <div className="grid grid-cols-2 gap-3">
        {AVAILABLE_COMPONENTS.map((comp) => (
          <div
            key={comp.type}
            draggable
            onDragStart={(e) => handleDragStart(e, comp.type)}
            className="flex flex-col items-center justify-center p-4 text-center border rounded-lg cursor-grab transition-all bg-card hover:bg-accent hover:text-accent-foreground hover:shadow-md hover:scale-105 active:cursor-grabbing"
            aria-label={`Drag to add ${comp.name} component`}
          >
            <comp.icon className="w-8 h-8 mb-2 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {comp.name}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
