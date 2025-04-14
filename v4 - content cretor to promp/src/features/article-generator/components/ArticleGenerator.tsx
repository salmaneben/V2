// src/features/article-generator/components/ArticleGenerator.tsx
import React, { useState, useEffect } from 'react';
import { TitleStep } from './TitleStep';
import { DescriptionStep } from './DescriptionStep';
import { TagsStep } from './TagsStep';
import { ArticleContentStep } from './ArticleContentStep';
import { ArticleGeneratorData, NicheType } from '../types';

// إضافة مكون مؤشر الخطوة - نسخة مبسطة لتجنب التبعيات
const StepIndicator: React.FC<{
  steps: string[];
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}> = ({ steps, currentStep, completedSteps, onStepClick }) => {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = completedSteps.includes(stepNumber);
        const isClickable = isCompleted || stepNumber === currentStep || completedSteps.includes(currentStep) && stepNumber === currentStep + 1;
        
        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              {/* خط قبل */}
              {index > 0 && (
                <div 
                  className={`flex-1 h-1 ${
                    completedSteps.includes(index) ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                ></div>
              )}
              
              {/* دائرة الخطوة */}
              <button
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-blue-600 text-white' : 
                  isCompleted ? 'bg-blue-500 text-white' : 
                  'bg-gray-200 text-gray-600'
                } ${isClickable ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-50'}`}
                onClick={() => isClickable && onStepClick(stepNumber)}
                disabled={!isClickable}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </button>
              
              {/* خط بعد */}
              {index < steps.length - 1 && (
                <div 
                  className={`flex-1 h-1 ${
                    completedSteps.includes(index + 1) ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
            
            {/* اسم الخطوة */}
            <div className={`mt-2 text-xs ${
              isActive ? 'text-blue-600 font-medium' : 'text-gray-500'
            }`}>
              {step}
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface ArticleGeneratorProps {
  initialStep?: number;
  onSave?: () => void; // استدعاء اختياري عند جاهزية المحتوى النهائي
}

export const ArticleGenerator: React.FC<ArticleGeneratorProps> = ({ 
  initialStep = 1, // الافتراضي هو البدء بالخطوة 1
  onSave 
}) => {
  // حالة للخطوة النشطة الحالية
  const [currentStep, setCurrentStep] = useState(initialStep);
  // حالة لتتبع الخطوات التي تم إكمالها بنجاح
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  // حالة لحفظ جميع البيانات التي تم جمعها وإنشاؤها عبر الخطوات
  const [data, setData] = useState<ArticleGeneratorData>({
    focusKeyword: '',
    metaTitle: '',
    metaDescription: '',
    tags: '',
    // حقول جديدة للنيش والروابط
    niche: 'recipes' as NicheType, // النيش الافتراضي هو الوصفات
    relatedKeywords: '',
    internalLink: '',
    externalLink: '',
    // محتوى منشأ
    generatedTitles: [],
    generatedDescriptions: [],
    generatedTags: [],
    generatedArticle: '',
    apiSettings: null,
    version: '1.0.0' // للترقيات المستقبلية
  });

  // إنشاء وظيفة منفصلة لتحديد حالة إكمال الخطوة
  const calculateCompletedSteps = (): number[] => {
    const newCompletedSteps: number[] = [];
    
    // الخطوة 1 - إكمال العنوان: يتطلب عنوانًا مختارًا
    if (data.metaTitle) {
      newCompletedSteps.push(1);
    }
    
    // الخطوة 2 - إكمال الوصف: يكتمل إذا كانت البيانات موجودة أو انتقل المستخدم بعدها
    if (data.metaDescription || currentStep > 2) {
      newCompletedSteps.push(2);
    }
    
    // الخطوة 3 - الوسوم: يكتمل إذا كانت البيانات موجودة أو انتقل المستخدم بعدها
    if (data.tags || currentStep > 3) {
      newCompletedSteps.push(3);
    }
    
    // الخطوة 4 - إنشاء المقال: يتطلب مقالًا منشأ
    if (data.generatedArticle) {
      newCompletedSteps.push(4);
    }
    
    return [...new Set(newCompletedSteps)].sort((a, b) => a - b);
  };

  // تأثير لتحديث قائمة الخطوات المكتملة بناءً على البيانات المتاحة
  useEffect(() => {
    const newCompletedSteps = calculateCompletedSteps();
    
    // تحديث الحالة فقط إذا تغير محتوى المصفوفة بالفعل لمنع الحلقات اللانهائية
    const sortedOldSteps = [...completedSteps].sort((a, b) => a - b);
    if (JSON.stringify(newCompletedSteps) !== JSON.stringify(sortedOldSteps)) {
      setCompletedSteps(newCompletedSteps);
    }
  }, [data.metaTitle, data.metaDescription, data.tags, data.generatedArticle, currentStep, completedSteps]);

  // تأثير لتشغيل استدعاء onSave عند إنشاء المقال النهائي
  useEffect(() => {
    const isStep4Completed = completedSteps.includes(4);
    const shouldTriggerSave = data.generatedArticle && onSave && isStep4Completed;
    
    if (shouldTriggerSave) {
      // تشغيل استدعاء الحفظ
      onSave();
      
      // إرسال حدث مخصص للمستمعين المحتملين الخارجيين (مثل التحليلات)
      document.dispatchEvent(new CustomEvent('article-saved', { 
        detail: { timestamp: new Date().toISOString() } 
      }));
    }
  }, [data.generatedArticle, completedSteps, onSave]);

  // تعامل محسن مع localStorage مع التحقق من الإصدار
  const saveDataToLocalStorage = (dataToSave: ArticleGeneratorData) => {
    try {
      localStorage.setItem('articleGeneratorData', JSON.stringify({
        ...dataToSave,
        lastUpdated: new Date().toISOString()
      }));
    } catch (e) {
      console.error('Failed to save article generator data to localStorage:', e);
      // اختياريًا تنفيذ تخزين احتياطي أو إخطار المستخدم
    }
  };

  // وظيفة لتحديث حالة البيانات المركزية والحفظ في localStorage
  const updateData = (newData: Partial<ArticleGeneratorData>) => {
    setData(prevData => {
      const updatedData = {
        ...prevData,
        ...newData
      };
      
      // حفظ البيانات المحدثة في localStorage للحفاظ عليها
      saveDataToLocalStorage(updatedData);
      
      return updatedData;
    });
  };

  // تحميل محسن من localStorage مع معالجة الأخطاء والتحقق من الإصدار
  const loadDataFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem('articleGeneratorData');
      if (!savedData) return null;
      
      const parsedData = JSON.parse(savedData) as ArticleGeneratorData & { lastUpdated?: string };
      
      // التحقق من الإصدار للترقيات المستقبلية
      if (parsedData.version !== '1.0.0') {
        console.log('Data version mismatch, migration might be needed');
        // تنفيذ منطق ترحيل البيانات هنا إذا لزم الأمر
      }
      
      return parsedData;
    } catch (e) {
      console.error('Failed to load article generator data from localStorage:', e);
      // مسح البيانات التي قد تكون تالفة
      localStorage.removeItem('articleGeneratorData');
      return null;
    }
  };

  // تأثير لتحميل البيانات المحفوظة من localStorage عند تركيب المكون
  useEffect(() => {
    const savedData = loadDataFromLocalStorage();
    
    if (savedData) {
      // تحديث الحالة بالبيانات المحملة
      setData(prevData => ({
        ...prevData,
        ...savedData
      }));
      
      // تهيئة completedSteps بناءً على البيانات المحملة
      const initialCompletedSteps: number[] = [];
      if (savedData.metaTitle) initialCompletedSteps.push(1);
      if (savedData.metaDescription) initialCompletedSteps.push(2);
      if (savedData.tags) initialCompletedSteps.push(3);
      if (savedData.generatedArticle) initialCompletedSteps.push(4);
      
      setCompletedSteps([...new Set(initialCompletedSteps)].sort((a, b) => a - b));
    }
  }, []); // مصفوفة التبعية الفارغة تضمن تشغيل هذا مرة واحدة فقط عند التركيب

  // معالج للانتقال إلى الخطوة التالية مع تحذير التغييرات غير المحفوظة
  const handleNextStep = () => {
    // اختياري: إضافة منطق تحذير التغييرات غير المحفوظة هنا
    setCurrentStep(prev => prev + 1);
  };

  // معالج للانتقال إلى الخطوة السابقة
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // معالج للنقر على خطوة في StepIndicator
  const handleStepClick = (step: number) => {
    const canNavigateToStep = 
      completedSteps.includes(step) || 
      step === currentStep || 
      (completedSteps.includes(currentStep) && step === currentStep + 1);
    
    if (canNavigateToStep) {
      setCurrentStep(step);
    } else {
      console.warn(`Navigation to step ${step} blocked. Current step ${currentStep} not completed or target step too far ahead.`);
      // اختياريًا عرض إشعار للمستخدم هنا
    }
  };

  // تحديد عناوين كل خطوة في سير العمل
  const steps = [
    "العنوان",         // الخطوة 1
    "الوصف",          // الخطوة 2
    "الوسوم",         // الخطوة 3
    "محتوى المقال"    // الخطوة 4
  ];

  // وظيفة لعرض المكون للخطوة النشطة حاليًا
  const renderStep = () => {
    const commonProps = {
        data: data,
        updateData: updateData,
        onPrevStep: handlePrevStep // معظم الخطوات تحتاج إلى طريقة للعودة
    };

    switch (currentStep) {
      case 1:
        return <TitleStep 
          {...commonProps} 
          onNextStep={handleNextStep} 
          onPrevStep={null} // لا توجد خطوة سابقة من الخطوة 1
        />;
      case 2:
        return <DescriptionStep 
          {...commonProps} 
          onNextStep={handleNextStep} 
        />;
      case 3:
        return <TagsStep 
          {...commonProps} 
          onNextStep={handleNextStep} 
        />;
      case 4:
        return <ArticleContentStep 
          {...commonProps} 
          onNextStep={null} // الإشارة إلى أن هذه هي الخطوة الأخيرة
        />;
      default:
        // الرجوع إلى الخطوة الأولى إذا كان currentStep غير صالح
        console.warn(`Invalid step number: ${currentStep}. Defaulting to step 1.`);
        setCurrentStep(1); // إعادة التعيين إلى الخطوة 1
        return <TitleStep 
            {...commonProps} 
            onNextStep={handleNextStep} 
            onPrevStep={null} 
        />;
    }
  };

  // طريقة العرض الرئيسية للمكون
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* عرض مؤشر الخطوة المرئي */}
      <StepIndicator 
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        completedSteps={completedSteps}
      />
      
      {/* عرض المكون للخطوة النشطة */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6"> 
        {renderStep()}
      </div>
    </div>
  );
};