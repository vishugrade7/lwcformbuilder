'use client';

import { Button } from '@/components/ui/button';
import { Code, Eye, LayoutGrid } from 'lucide-react';

interface HeaderProps {
  onPreviewClick: () => void;
  onCodeClick: () => void;
}

export default function Header({ onPreviewClick, onCodeClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b bg-card z-10 shrink-0">
      <div className="flex items-center gap-3">
        <LayoutGrid className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold text-primary font-headline tracking-tight">
          FormForge
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onPreviewClick}>
          <Eye />
          Preview
        </Button>
        <Button onClick={onCodeClick}>
          <Code />
          Generate Code
        </Button>
      </div>
    </header>
  );
}
