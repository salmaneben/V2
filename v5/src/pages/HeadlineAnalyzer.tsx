import React from 'react';
import HeadlineAnalyzer from '@/features/headline-analyzer';

interface HeadlineAnalyzerPageProps {
  sidebarState: string;
}

const HeadlineAnalyzerPage: React.FC<HeadlineAnalyzerPageProps> = ({ sidebarState }) => {
  return <HeadlineAnalyzer sidebarState={sidebarState} />;
};

export default HeadlineAnalyzerPage;