import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface GeneratedContentCardProps {
  content: string;
  copied: boolean;
  onCopy: () => void;
}

export const GeneratedContentCard: React.FC<GeneratedContentCardProps> = ({
  content,
  copied,
  onCopy
}) => {
  return (
    <Card className="w-full mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Generated Content</CardTitle>
        <Button
          onClick={onCopy}
          variant="outline"
          className="min-w-[100px]"
        >
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 p-4 rounded-md max-h-[600px] overflow-auto whitespace-pre-wrap">
          {content.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};