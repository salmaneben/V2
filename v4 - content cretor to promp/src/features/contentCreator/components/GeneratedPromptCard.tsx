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
  onCopy
}) => {
  return (
    <Card className="w-full mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Generated Prompt</CardTitle>
        <Button
          onClick={onCopy}
          variant="outline"
          className="min-w-[100px]"
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-md max-h-[500px] overflow-auto font-mono text-sm whitespace-pre-wrap">
          {prompt.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm text-blue-700">
          <p className="font-medium">How to use this prompt:</p>
          <ol className="list-decimal pl-5 mt-1">
            <li>Copy the prompt above using the Copy button</li>
            <li>Paste it into your preferred AI tool (ChatGPT, Claude, etc.)</li>
            <li>The AI will generate content based on your specifications</li>
            <li>You can modify the prompt further if needed</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};