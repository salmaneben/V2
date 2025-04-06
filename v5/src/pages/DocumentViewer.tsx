// src/pages/DocumentViewer.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';

const DocumentViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get the document from localStorage
    try {
      const storedDoc = localStorage.getItem('current_document');
      if (storedDoc) {
        setDocument(JSON.parse(storedDoc));
      } else {
        // If not in localStorage, try to get it from the recent documents
        const recentDocs = JSON.parse(localStorage.getItem('recent_documents') || '[]');
        const index = parseInt(id || '0');
        if (recentDocs[index]) {
          setDocument(recentDocs[index]);
        }
      }
    } catch (error) {
      console.error('Error loading document:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Recent';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return 'Recent';
    }
  };

  // Handle back button click
  const handleBack = () => {
    navigate('/dashboard');
  };

  // Handle copy content
  const handleCopyContent = () => {
    if (document?.content) {
      navigator.clipboard.writeText(document.content)
        .then(() => {
          addToast('Content copied to clipboard', 'success');
        })
        .catch(() => {
          addToast('Failed to copy content', 'error');
        });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleBack} className="mr-4">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Document Not Found</h1>
        </div>
        <Card className="p-8 text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium mb-2">Document not found or expired</h2>
          <p className="text-gray-600 mb-6">The document you're looking for is no longer available or may have been removed.</p>
          <Button onClick={handleBack}>Return to Dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={handleBack} className="mr-4">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-800 truncate">
          {document.title || 'Untitled Document'}
        </h1>
      </div>

      <div className="bg-white border rounded-lg shadow-sm mb-6">
        <div className="bg-gray-50 border-b px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-indigo-500 mr-2" />
            <span className="font-medium">Document Details</span>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
        
        <div className="p-4">
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Created on {formatDate(document.date)}</span>
          </div>
          
          <div className="prose max-w-none">
            <div className="bg-gray-50 border rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium mb-2">Document Title</h3>
              <p className="text-gray-800">{document.title || 'Untitled Document'}</p>
            </div>
            
            <h3 className="text-lg font-medium mb-2">Document Content</h3>
            <div className="bg-white border rounded-lg p-4 whitespace-pre-wrap">
              {document.content || 'No content available'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Return to Dashboard
        </Button>
        <Button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={handleCopyContent}
        >
          Copy Content
        </Button>
      </div>
    </div>
  );
};

export default DocumentViewer;