import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle2, FileText } from 'lucide-react';

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
  // Add animation state
  const [showAnimation, setShowAnimation] = useState(false);
  
  // Trigger animation when component mounts
  useEffect(() => {
    setShowAnimation(true);
  }, []);

  return (
    <Card className={`w-full mt-6 border-l-4 border-emerald-500 border-t border-r border-b border-emerald-200 shadow-md rounded-xl overflow-hidden ${showAnimation ? 'animate-[fadeIn_0.3s_ease-in-out]' : 'opacity-0'}`}>
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-transparent border-b border-emerald-100 flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl text-emerald-800 font-semibold flex items-center gap-2">
          <span className="bg-emerald-100 text-emerald-700 p-1 rounded-md flex items-center justify-center">
            <FileText className="h-5 w-5 text-emerald-600" />
          </span>
          Generated Content
        </CardTitle>
        <Button
          onClick={onCopy}
          variant="outline"
          className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 min-w-[100px] group transition-colors"
        >
          {copied ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-1" /> Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" /> Copy
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="bg-emerald-50 p-5 rounded-md max-h-[600px] overflow-auto whitespace-pre-wrap border border-emerald-200 shadow-inner">
          {content.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-end">
          <div className="py-1 px-3 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 text-xs font-medium inline-flex items-center">
            <span className="mr-1 text-emerald-500">•</span> Content ready to use
          </div>
        </div>
      </CardContent>
    </Card>
  );
};