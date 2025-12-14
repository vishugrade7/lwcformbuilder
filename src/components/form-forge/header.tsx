'use client';

import { Button } from '@/components/ui/button';
import { Code, Eye, LayoutGrid } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ThemeToggleButton } from './theme-toggle-button';

interface HeaderProps {
  onPreviewClick: () => void;
  onCodeClick: () => void;
}

export default function Header({ onPreviewClick, onCodeClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b bg-card z-10 shrink-0">
      <div className="flex items-center gap-3">
        <LayoutGrid className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold text-primary font-headline tracking-tight">
          LWC form builder
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggleButton />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onPreviewClick}
                aria-label="Preview"
                className="h-8 w-8"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Preview</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                onClick={onCodeClick}
                aria-label="Generate Code"
                className="h-8 w-8"
              >
                <Code className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Generate Code</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
}
