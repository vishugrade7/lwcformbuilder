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
      };
      if (componentType === 'dropdown' || componentType === 'radiogroup') {
        newComponent.options = ['Option 1', 'Option 2'];
      }
      if (componentType === 'switch') {
        newComponent.label = 'Enable Feature';
        newComponent.fieldName = toCamelCase(newComponent.label);
      }
      setComponents((prev) => [...prev, newComponent]);
      setSelectedComponentId(newComponent.id);
    }
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
