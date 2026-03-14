import { useState } from 'react';
import { getCopy, type Persona } from '../utils/personaCopy';

interface FeedbackData {
  most_useful: string;
  less_clear: string;
  made_think: boolean | null;
  would_recommend: boolean | null;
  contact_info: string;
}

interface FeedbackScreenProps {
  persona: Persona;
  onSubmit: (data: FeedbackData) => void;
  onSkip: () => void;
}

export default function FeedbackScreen({ persona, onSubmit, onSkip }: FeedbackScreenProps) {
  const [data, setData] = useState<FeedbackData>({
    most_useful: '',
    less_clear: '',
    made_think: null,
    would_recommend: null,
    contact_info: ''
  });

  const handleSubmit = () => {
    onSubmit(data);
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6 pb-12">
      <div className="max-w-lg mx-auto">
        <div className="mb-10 pt-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-5">
            {getCopy('feedback.title', persona)}
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-2">
            {getCopy('feedback.subtitle1', persona)}
          </p>
          <p className="text-gray-600 text-lg leading-relaxed">
            {getCopy('feedback.subtitle2', persona)}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              {getCopy('feedback.mostUseful', persona)}
            </label>
            <textarea
              value={data.most_useful}
              onChange={(e) => setData({ ...data, most_useful: e.target.value })}
              className="w-full h-28 p-4 border-2 border-gray-200 rounded-2xl focus:border-olive-500 focus:outline-none focus:ring-2 focus:ring-olive-100 resize-none bg-white text-base"
              dir="rtl"
              placeholder="כתוב כאן..."
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              {getCopy('feedback.lessClear', persona)}
            </label>
            <textarea
              value={data.less_clear}
              onChange={(e) => setData({ ...data, less_clear: e.target.value })}
              className="w-full h-28 p-4 border-2 border-gray-200 rounded-2xl focus:border-olive-500 focus:outline-none focus:ring-2 focus:ring-olive-100 resize-none bg-white text-base"
              dir="rtl"
              placeholder="כתוב כאן..."
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">
              {getCopy('feedback.madeThink', persona)}
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setData({ ...data, made_think: false })}
                className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all ${
                  data.made_think === false
                    ? 'bg-olive-700 text-white shadow-md'
                    : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-olive-400'
                }`}
              >
                לא
              </button>
              <button
                onClick={() => setData({ ...data, made_think: true })}
                className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all ${
                  data.made_think === true
                    ? 'bg-olive-700 text-white shadow-md'
                    : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-olive-400'
                }`}
              >
                כן
              </button>
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">
              {getCopy('feedback.wouldRecommend', persona)}
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setData({ ...data, would_recommend: false })}
                className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all ${
                  data.would_recommend === false
                    ? 'bg-olive-700 text-white shadow-md'
                    : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-olive-400'
                }`}
              >
                לא
              </button>
              <button
                onClick={() => setData({ ...data, would_recommend: true })}
                className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all ${
                  data.would_recommend === true
                    ? 'bg-olive-700 text-white shadow-md'
                    : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-olive-400'
                }`}
              >
                כן
              </button>
            </div>
          </div>

          <div className="bg-khaki-100 rounded-2xl p-5 border border-khaki-200">
            <label className="block text-sm text-gray-600 mb-3 leading-relaxed">
              {getCopy('feedback.contactInfo', persona)}
            </label>
            <input
              type="tel"
              value={data.contact_info}
              onChange={(e) => setData({ ...data, contact_info: e.target.value })}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-olive-500 focus:outline-none focus:ring-2 focus:ring-olive-100 bg-white text-base"
              dir="rtl"
              placeholder="מספר טלפון / וואטסאפ (אופציונלי)"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-olive-700 hover:bg-olive-800 active:bg-olive-900 text-white text-lg font-semibold py-5 px-6 rounded-2xl transition-all shadow-lg"
            >
              שלח משוב
            </button>
            <button
              onClick={onSkip}
              className="px-6 py-5 text-gray-500 hover:text-gray-700 font-medium transition-colors text-base"
            >
              דלג
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
