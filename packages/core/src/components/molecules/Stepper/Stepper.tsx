import type { CSSProperties } from 'react';
import { cn } from '../../../utils/cn';

export interface StepperItem {
  id: string;
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: StepperItem[];
  activeStep: number;
  onStepChange?: (step: number) => void;
  onChange?: (step: number) => void;
  orientation?: 'horizontal' | 'vertical';
  linear?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function Stepper({
  steps,
  activeStep,
  onStepChange,
  onChange,
  orientation = 'horizontal',
  linear = true,
  className,
  style,
}: StepperProps) {
  const emitStepChange = (nextStep: number) => {
    onStepChange?.(nextStep);
    onChange?.(nextStep);
  };
  return (
    <div
      className={cn(
        'stepper',
        orientation === 'vertical' && 'stepper--vertical',
        className
      )}
      style={style}
    >
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const isCompleted = index < activeStep;
        const disabled = linear && index > activeStep;

        return (
          <button
            key={step.id}
            type="button"
            disabled={disabled}
            onClick={() => emitStepChange(index)}
            className="stepper__step"
          >
            <span
              className={cn(
                'stepper__indicator',
                isCompleted && 'stepper__indicator--done',
                isActive && 'stepper__indicator--active'
              )}
            >
              {index + 1}
            </span>
            <span className="control-stack">
              <span className="field-label">{step.label}</span>
              {step.description ? (
                <span className="field-hint">{step.description}</span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
