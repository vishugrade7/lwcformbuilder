'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '../ui/button';
import { Check, Copy } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

interface CodeModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  htmlCode: string;
  jsCode: string;
}

function CodeBlock({ code }: { code: string }) {
  const { isCopied, copy } = useCopyToClipboard();
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-7 w-7"
        onClick={() => copy(code)}
      >
        {isCopied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
      <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
        <code className="font-code">{code}</code>
      </pre>
    </div>
  );
}

export default function CodeModal({
  isOpen,
  onOpenChange,
  htmlCode,
  jsCode,
}: CodeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Generated LWC Code</DialogTitle>
          <DialogDescription>
            Copy and paste this code into your Salesforce DX project.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          <Tabs defaultValue="html">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="html">form.html</TabsTrigger>
              <TabsTrigger value="js">form.js</TabsTrigger>
            </TabsList>
            <TabsContent value="html">
              <CodeBlock code={htmlCode} />
            </TabsContent>
            <TabsContent value="js">
              <CodeBlock code={jsCode} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
