import React from 'react';
import { ContentCreatorForm } from '../features/contentCreator/components/ContentCreatorForm';
import { getApiConfigFromSettings } from "@/api";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ContentCreator = () => {
  const apiConfig = getApiConfigFromSettings();
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Prompt Generator</h1>
        </div>
        
        {!apiConfig || !apiConfig.apiKey ? (
          <Card className="p-6 bg-yellow-50 border-yellow-200">
            <div className="flex flex-col gap-4 items-center text-center">
              <h2 className="text-xl font-semibold text-yellow-800">API Key Required</h2>
              <p className="text-yellow-700">
                You need to configure an API key in the API Settings page before using the Prompt Generator.
              </p>
              <Button 
                variant="outline" 
                className="mt-2 bg-white" 
                onClick={() => window.location.href = '/api-settings'}
              >
                Go to API Settings
              </Button>
            </div>
          </Card>
        ) : (
          <ContentCreatorForm 
            apiConfig={apiConfig}
          />
        )}
      </div>
    </div>
  );
};

export default ContentCreator;