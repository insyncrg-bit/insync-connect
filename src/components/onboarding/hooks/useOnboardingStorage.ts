import { useState, useEffect, useCallback, useRef } from "react";

export interface OnboardingStep {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const useOnboardingStorage = <T extends Record<string, any>>(
  storageKey: string,
  stepKey: string,
  defaultData: T,
  initialData?: Partial<T>
) => {
  const [data, setData] = useState<T>(defaultData);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const initialDataRef = useRef(initialData);

  useEffect(() => {
    try {
      if (initialDataRef.current) {
        // Edit mode: use initialData as base, but allow localStorage draft to take priority
        // so the user doesn't lose in-progress edits if they navigate away and come back
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setData({ ...defaultData, ...initialDataRef.current, ...parsed });
        } else {
          setData({ ...defaultData, ...initialDataRef.current });
        }
      } else {
        // Onboarding mode: use localStorage only
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setData({ ...defaultData, ...parsed });
        }
      }

      const savedStep = localStorage.getItem(stepKey);
      if (savedStep) {
        setCurrentStep(parseInt(savedStep, 10));
      }
    } catch (error) {
      console.error(`Error loading onboarding data (${storageKey}):`, error);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey, stepKey, defaultData]);

  const dataRef = useRef<T>(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const saveData = useCallback((newData: Partial<T>) => {
    setData((prev) => {
      const updatedData = { ...prev, ...newData };

      // Side effect: persist to localStorage
      try {
        const toPersist = { ...updatedData };
        if ("companyLogo" in toPersist && toPersist.companyLogo instanceof File) delete (toPersist as any).companyLogo;
        if ("pitchdeck" in toPersist && toPersist.pitchdeck instanceof File) delete (toPersist as any).pitchdeck;
        localStorage.setItem(storageKey, JSON.stringify(toPersist));
      } catch (error) {
        console.error(`Error saving onboarding data (${storageKey}):`, error);
      }

      return updatedData;
    });
  }, [storageKey]);

  const saveStep = useCallback((step: number) => {
    setCurrentStep(step);
    try {
      localStorage.setItem(stepKey, step.toString());
    } catch (error) {
      console.error(`Error saving onboarding step (${stepKey}):`, error);
    }
  }, [stepKey]);

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

  return { data, currentStep, isLoaded, saveData, saveStep, clearData, setData: saveData, setCurrentStep: saveStep };
};
