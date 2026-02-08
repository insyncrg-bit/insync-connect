import { useState, useEffect, useCallback } from "react";

export interface OnboardingStep {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const useOnboardingStorage = <T extends Record<string, any>>(
  storageKey: string,
  stepKey: string,
  defaultData: T
) => {
  const [data, setData] = useState<T>(defaultData);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(storageKey);
      const savedStep = localStorage.getItem(stepKey);
      
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setData({ ...defaultData, ...parsed });
      }
      
      if (savedStep) {
        setCurrentStep(parseInt(savedStep, 10));
      }
    } catch (error) {
      console.error(`Error loading onboarding data (${storageKey}):`, error);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey, stepKey, defaultData]);

  // Save to localStorage whenever data changes
  const saveData = useCallback((newData: Partial<T>) => {
    const updatedData = { ...data, ...newData };
    setData(updatedData);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedData));
    } catch (error) {
      console.error(`Error saving onboarding data (${storageKey}):`, error);
    }
  }, [data, storageKey]);

  // Save current step
  const saveStep = useCallback((step: number) => {
    setCurrentStep(step);
    try {
      localStorage.setItem(stepKey, step.toString());
    } catch (error) {
      console.error(`Error saving onboarding step (${stepKey}):`, error);
    }
  }, [stepKey]);

  // Clear all data
  const clearData = useCallback(() => {
    setData(defaultData);
    setCurrentStep(0);
    try {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(stepKey);
    } catch (error) {
      console.error(`Error clearing onboarding data (${storageKey}):`, error);
    }
  }, [storageKey, stepKey, defaultData]);

  return {
    data,
    currentStep,
    isLoaded,
    saveData,
    saveStep,
    clearData,
    setData: saveData,
    setCurrentStep: saveStep,
  };
};
