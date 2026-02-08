# Shared Onboarding Components

This directory contains reusable components for building onboarding flows for both VC and Startup applications.

## Architecture

### Core Components

1. **OnboardingPage** - Main wrapper component that handles:
   - Step navigation
   - localStorage persistence
   - Progress tracking
   - Form submission

2. **useOnboardingStorage** - Generic hook for managing onboarding data:
   - Auto-saves to localStorage
   - Loads saved data on mount
   - Tracks current step
   - Provides clear/reset functionality

### Form Components

All form components are styled for the dark theme and follow consistent patterns:

- **FormField** - Wrapper for form fields with label and error handling
- **TextInput** - Text input field
- **TextAreaInput** - Textarea field
- **MultiSelect** - Multi-select button group
- **SelectField** - Dropdown select
- **SwitchField** - Toggle switch with label and description
- **ContactList** - Dynamic list of contacts with add/remove
- **StepNavigation** - Navigation buttons (Back/Next/Submit)

### Step Components

- **WelcomeStep** - Reusable welcome screen with customizable content

## Usage Example

### VC Onboarding

```tsx
import { 
  OnboardingPage, 
  WelcomeStep, 
  FormField, 
  TextInput, 
  MultiSelect, 
  StepNavigation,
  StepValidation 
} from "@/pages/onboarding/shared";
import { STEPS } from "./constants";
import { VCOnboardingData, defaultData } from "./types";

export const VCOnboarding = () => {
  const handleSubmit = async (data: VCOnboardingData) => {
    // API call here
    await fetch('/api/vc/onboarding', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  // Validation function for each step
  const validateStep = (step: number, data: VCOnboardingData): StepValidation => {
    const errors: string[] = [];
    
    switch (step) {
      case 0: // Welcome - no validation
        return { isValid: true, errors: [] };
      case 1: // Admin & Verification
        if (!data.firmName.trim()) errors.push("Firm name is required");
        if (!data.hqLocation.trim()) errors.push("HQ location is required");
        if (data.contacts.length === 0 || !data.contacts[0].name.trim()) {
          errors.push("At least one contact is required");
        }
        break;
      case 2: // Fund Overview
        if (!data.firmDescription.trim()) errors.push("Firm description is required");
        if (!data.fundType) errors.push("Fund type is required");
        if (data.checkSizes.length === 0) errors.push("Select at least one check size");
        if (data.stageFocus.length === 0) errors.push("Select at least one stage focus");
        break;
      // ... other steps
    }
    
    return { isValid: errors.length === 0, errors };
  };

  const renderStep = (step: number, data: VCOnboardingData, onUpdate, onNext, onBack, onSubmit) => {
    switch (step) {
      case 0:
        return <WelcomeStep onNext={onNext} />;
      case 1:
        return (
          <div>
            <FormField label="Firm Name" required>
              <TextInput
                value={data.firmName}
                onChange={(v) => onUpdate({ firmName: v })}
                placeholder="Your VC firm name"
              />
            </FormField>
            <StepNavigation onBack={onBack} onNext={onNext} isFirstStep={false} />
          </div>
        );
      // ... other steps
    }
  };

  return (
    <OnboardingPage
      title="VC Onboarding"
      description="Complete your firm profile"
      steps={STEPS}
      storageKey="vc_onboarding_data"
      stepKey="vc_onboarding_step"
      defaultData={defaultData}
      renderStep={renderStep}
      validateStep={validateStep}
      onSubmit={handleSubmit}
      requiredSteps={[1, 2, 3, 4, 5]} // Steps that must be completed (excluding welcome and optional)
    />
  );
};
```

## Features

### Non-Chronological Navigation
- Users can click on any step in the progress bar to jump to that step
- No restrictions on which steps can be accessed
- Progress is saved automatically regardless of order

### Validation & Warnings
- On submit, all required steps are validated
- Invalid steps are highlighted in red in the progress bar
- Warning alert shows all incomplete sections with specific errors
- Automatically scrolls to first invalid step
- Current step card is highlighted with red border if invalid

### Visual Indicators
- **Green/Cyan**: Completed or current step
- **Red**: Invalid/incomplete step (shown on submit attempt)
- **Gray**: Not yet visited
- Red dot indicator on invalid step icons

### Startup Onboarding

```tsx
import { OnboardingPage, WelcomeStep } from "@/pages/onboarding/shared";
import { STARTUP_STEPS } from "./constants";
import { StartupOnboardingData, defaultData } from "./types";

export const StartupOnboarding = () => {
  // Similar structure to VC onboarding
  // Use different steps, data structure, and storage keys
};
```

## Key Features

1. **Automatic Persistence** - All form data is saved to localStorage automatically
2. **Progress Tracking** - Completed steps are tracked and saved
3. **Resume Capability** - Users can close and return to the same step
4. **Type Safety** - Full TypeScript support with generic types
5. **Consistent Styling** - All components use the same dark theme styling

## Storage Keys

Each onboarding flow should use unique storage keys:
- VC: `vc_onboarding_data`, `vc_onboarding_step`
- Startup: `startup_onboarding_data`, `startup_onboarding_step`

This allows multiple onboarding flows to coexist without conflicts.
