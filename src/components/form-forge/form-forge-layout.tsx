'use client';

import { useState } from 'react';
import { nanoid } from 'nanoid';
import type { FormComponent } from '@/lib/types';
import Header from './header';
import ComponentLibrary from './component-library';
import FormCanvas from './form-canvas';
import ConfigurationPanel from './configuration-panel';
import PreviewModal from './preview-modal';
import CodeModal from './code-modal';
import { generateLwcHtml, generateLwcJs } from '@/lib/lwc-generator';

function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)?/g, (m, chr) => (chr ? chr.toUpperCase() : ''))
    .replace(/^./, (str) => str.toLowerCase());
}

export default function FormForgeLayout() {
  const [components, setComponents] = useState<FormComponent[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCodeOpen, setIsCodeOpen] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData(
      'componentType'
    ) as FormComponent['type'];
    if (componentType) {
      const baseLabel = `New ${componentType}`;
      const newComponent: FormComponent = {
        id: nanoid(),
        type: componentType,
        label: baseLabel,
        fieldName: toCamelCase(baseLabel),
        required: false,
        variant: 'standard',
        width: '12',
      };
      if (componentType === 'dropdown' || componentType === 'radiogroup') {
        newComponent.options = ['Option 1', 'Option 2'];
      }
      if (componentType === 'switch') {
        newComponent.label = 'Enable Feature';
        newComponent.fieldName = toCamelCase(newComponent.label);
      }
      if (componentType === 'image') {
        newComponent.fieldName = '';
        newComponent.label = 'Image';
        newComponent.src = 'https://picsum.photos/seed/1/600/400';
        newComponent.alt = 'Placeholder image';
      }
      if (componentType === 'richtext') {
        newComponent.fieldName = '';
        newComponent.label = 'Rich Text';
        newComponent.value = '<h2>Rich Text</h2><p>This is some rich text content.</p>';
      }
      if (componentType === 'datatable') {
        newComponent.label = 'Data Table';
        newComponent.fieldName = 'dataTable';
        newComponent.columns = [
          { label: 'Column 1', fieldName: 'col1' },
          { label: 'Column 2', fieldName: 'col2' },
        ];
      }
      setComponents((prev) => [...prev, newComponent]);
      setSelectedComponentId(newComponent.id);
    }
  };

  const handleReorder = (draggedId: string, targetId: string) => {
    setComponents((prev) => {
      const draggedIndex = prev.findIndex((c) => c.id === draggedId);
      const targetIndex = prev.findIndex((c) => c.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1) return prev;

      const newComponents = [...prev];
      const [draggedItem] = newComponents.splice(draggedIndex, 1);
      newComponents.splice(targetIndex, 0, draggedItem);

      return newComponents;
    });
  };

  const handleSelectComponent = (id: string) => {
    setSelectedComponentId(id);
  };

  const handleUpdateComponent = (
    id: string,
    updates: Partial<FormComponent>
  ) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const handleDeleteComponent = (id: string) => {
    setComponents((prev) => prev.filter((c) => c.id !== id));
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
  };

  const selectedComponent =
    components.find((c) => c.id === selectedComponentId) || null;

  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-body">
      <Header
        onPreviewClick={() => setIsPreviewOpen(true)}
        onCodeClick={() => setIsCodeOpen(true)}
      />
      <div className="flex flex-1 overflow-hidden">
        <ComponentLibrary />
        <FormCanvas
          components={components}
          onDrop={handleDrop}
          onSelectComponent={handleSelectComponent}
          onDeleteComponent={handleDeleteComponent}
          selectedComponentId={selectedComponentId}
          onReorder={handleReorder}
        />
        <ConfigurationPanel
          selectedComponent={selectedComponent}
          onUpdateComponent={handleUpdateComponent}
        />
      </div>
      <PreviewModal
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        components={components}
      />
      <CodeModal
        isOpen={isCodeOpen}
        onOpenChange={setIsCodeOpen}
        htmlCode={generateLwcHtml(components)}
        jsCode={generateLwcJs(components)}
      />
    </div>
  );
}
