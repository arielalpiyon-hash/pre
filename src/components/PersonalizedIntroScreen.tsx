import { getCopy, type Persona } from '../utils/personaCopy';

interface PersonalizedIntroScreenProps {
  persona: Persona;
  recruitmentStage?: string;
  mainConcern?: string;
  onContinue: () => void;
}

export default function PersonalizedIntroScreen({ persona, recruitmentStage, mainConcern, onContinue }: PersonalizedIntroScreenProps) {
  const getMessage = () => {
    if (recruitmentStage === 'אחרי צו ראשון' && mainConcern === 'מיונים') {
      return getCopy('personalizedIntro.afterFirstOrder_interviews', persona);
    }

    if (recruitmentStage === 'לפני צו ראשון' && (mainConcern?.includes('יודע') || mainConcern?.includes('לא יודע'))) {
      return getCopy('personalizedIntro.beforeFirstOrder_notSure', persona);
    }

    if (recruitmentStage === 'קיבלתי מיונים' || recruitmentStage === 'קיבלתי גיבושים') {
      return getCopy('personalizedIntro.gotInterviews_gotGibushim', persona);
    }

    if (mainConcern?.includes('ביטחון')) {
      return getCopy('personalizedIntro.concern_selfDoubt', persona);
    }

    if (mainConcern === 'בחירת מסלול') {
      return getCopy('personalizedIntro.concern_pathSelection', persona);
    }

    if (mainConcern === 'ראיונות') {
      return getCopy('personalizedIntro.concern_interviews', persona);
    }

    if (recruitmentStage === 'לפני יום המאה' || recruitmentStage === 'אחרי יום המאה') {
      return getCopy('personalizedIntro.day100', persona);
    }

    return getCopy('personalizedIntro.default', persona);
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6 flex flex-col items-center justify-center">
      <div className="max-w-lg mx-auto text-center px-4">
        <p className="text-xl text-gray-700 leading-relaxed mb-10">
          {getMessage()}
        </p>

        <button
          onClick={onContinue}
          className="w-full bg-olive-700 hover:bg-olive-800 active:bg-olive-900 text-white text-lg font-semibold py-5 px-6 rounded-2xl transition-all shadow-lg"
        >
          המשך
        </button>
      </div>
    </div>
  );
}
