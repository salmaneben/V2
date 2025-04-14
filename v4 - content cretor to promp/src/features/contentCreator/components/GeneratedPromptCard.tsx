import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle2, LightbulbIcon } from 'lucide-react';

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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#059669" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          Generated Prompt
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
        <div className="bg-emerald-50 p-4 rounded-md max-h-[500px] overflow-auto font-mono text-sm whitespace-pre-wrap border border-emerald-200 shadow-inner">
          {prompt.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>
        <div className="mt-4 p-3 bg-emerald-50 rounded-md text-sm text-emerald-700 border-l-4 border-emerald-500">
          <p className="font-medium flex items-center">
            <LightbulbIcon className="h-4 w-4 mr-1 text-emerald-600" />
            <span>How to use this prompt:</span>
          </p>
          <ol className="list-decimal pl-5 mt-1 space-y-1">
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