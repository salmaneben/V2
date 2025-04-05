import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GeneratedPromptCardProps {
  prompt: string;
  copied: boolean;
  onCopy: () => void;
}

export const GeneratedPromptCard: React.FC<GeneratedPromptCardProps> = ({
  prompt,
  copied,
  onCopy,
}) => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-gray-50 to-gray-100 border-b px-6 py-4">
        <CardTitle className="text-xl font-bold text-gray-800">
          Generated Prompt
        </CardTitle>
        <Button
          onClick={onCopy}
          variant="outline"
          className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
        >
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <pre className="whitespace-pre-wrap bg-gray-50 p-6 rounded-lg text-sm font-mono border border-gray-100 shadow-inner overflow-auto">
          {prompt}
        </pre>
      </CardContent>
    </Card>
  );
};