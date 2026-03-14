import { useState } from 'react';
import { getCopy, type Persona } from '../utils/personaCopy';

interface OnboardingData {
  age?: number;
  recruitment_stage?: string;
  main_concern?: string;
}

interface OnboardingScreenProps {
  persona: Persona;
  onComplete: (data: OnboardingData) => void;
}

export default function OnboardingScreen({ persona, onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({});

  const handleAgeSelect = (age: number) => {
    setData({ ...data, age });
    setStep(2);
  };

  const handleStageSelect = (stage: string) => {
    setData({ ...data, recruitment_stage: stage });
    setStep(3);
  };

  const handleConcernSelect = (concern: string) => {
    const finalData = { ...data, main_concern: concern };
    onComplete(finalData);
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6 flex flex-col">
      <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                {getCopy('onboarding.ageQuestion', persona)}
              </h2>
              <p className="text-gray-600">שלב 1 מתוך 3</p>
            </div>
            <div className="space-y-3">
              {[16, 17, 18].map((age) => (
                <button
                  key={age}
                  onClick={() => handleAgeSelect(age)}
                  className="w-full bg-white hover:bg-olive-50 active:bg-olive-100 text-gray-900 text-2xl font-medium py-6 px-6 rounded-2xl shadow-md border-2 border-gray-200 hover:border-olive-500 active:border-olive-600 transition-all"
                >
                  {age}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {getCopy('onboarding.stageQuestion', persona)}
              </h2>
              <p className="text-gray-600">שלב 2 מתוך 3</p>
            </div>
            <div className="space-y-3">
              {[
                'לפני צו ראשון',
                'אחרי צו ראשון',
                'לפני יום המאה',
                'אחרי יום המאה',
                'קיבלתי מיונים',
                'קיבלתי גיבושים',
                'אני לא בטוח'
              ].map((stage) => (
                <button
                  key={stage}
                  onClick={() => handleStageSelect(stage)}
                  className="w-full bg-white hover:bg-olive-50 active:bg-olive-100 text-gray-900 text-lg font-medium py-5 px-6 rounded-2xl shadow-md border-2 border-gray-200 hover:border-olive-500 active:border-olive-600 transition-all"
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {getCopy('onboarding.concernQuestion', persona)}
              </h2>
              <p className="text-gray-600">שלב 3 מתוך 3</p>
            </div>
            <div className="space-y-3">
              {[
                { key: 'interviews', label: 'מיונים' },
                { key: 'interviews2', label: 'ראיונות' },
                { key: 'pathSelection', label: 'בחירת מסלול' },
                { key: 'selfDoubt', label: getCopy('onboarding.concernOptions.selfDoubt', persona) },
                { key: 'notSure', label: getCopy('onboarding.concernOptions.notSure', persona) }
              ].map((concern) => (
                <button
                  key={concern.key}
                  onClick={() => handleConcernSelect(concern.label)}
                  className="w-full bg-white hover:bg-olive-50 active:bg-olive-100 text-gray-900 text-lg font-medium py-5 px-6 rounded-2xl shadow-md border-2 border-gray-200 hover:border-olive-500 active:border-olive-600 transition-all"
                >
                  {concern.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-2 mt-10 pb-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === step ? 'w-10 bg-olive-600' : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
