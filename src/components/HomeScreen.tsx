import { ArrowLeft, Lock, Search, Compass } from 'lucide-react';
import { useState } from 'react';
import { getCopy, type Persona } from '../utils/personaCopy';

interface HomeScreenProps {
  persona: Persona;
  userName?: string;
  onStartTask: () => void;
  onExplore?: () => void;
}

export default function HomeScreen({ persona, userName, onStartTask, onExplore }: HomeScreenProps) {
  const [showComingSoon, setShowComingSoon] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 p-6 pb-12">
      <div className="max-w-lg mx-auto">
        <div className="mb-8 pt-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {getCopy('home.greeting', persona).replace('{name}', userName || 'חבר')}
          </h1>
          <p className="text-gray-600 text-base">
            {getCopy('home.betaMessage', persona)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-olive-100 to-olive-50 rounded-3xl shadow-lg p-8 mb-6 border border-olive-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-olive-900 mb-3">
              {getCopy('home.taskTitle', persona)}
            </h2>
            <p className="text-olive-800 text-lg leading-relaxed">
              {getCopy('home.taskDescription', persona)}
            </p>
          </div>
          <button
            onClick={onStartTask}
            className="w-full bg-olive-700 hover:bg-olive-800 active:bg-olive-900 text-white text-lg font-bold py-5 px-6 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            {getCopy('home.startTask', persona)}
            <ArrowLeft size={22} className="rotate-180" />
          </button>
        </div>

        <div className="text-center mb-6 px-4">
          <p className="text-gray-600 text-base leading-relaxed italic">
            {getCopy('home.reflectionQuote', persona)}
          </p>
        </div>

        {onExplore && (
          <button
            onClick={onExplore}
            className="w-full bg-white rounded-2xl shadow-md border-2 border-olive-300 p-6 mb-6 text-right hover:shadow-lg hover:border-olive-400 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Compass className="text-olive-600" size={28} />
              <h3 className="text-xl font-bold text-gray-900">
                {getCopy('home.exploreTracks', persona)}
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-3">
              {getCopy('home.exploreDescription', persona)}
            </p>
            <div className="flex items-center gap-2 text-olive-700 text-sm font-medium">
              <span>התחל לחקור</span>
              <ArrowLeft size={16} className="rotate-180" />
            </div>
          </button>
        )}

        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-500 mb-4">
            דברים שנוסיף בקרוב
          </h3>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setShowComingSoon(true)}
            className="w-full bg-khaki-100 rounded-2xl shadow-sm p-5 text-right border border-khaki-200 hover:border-khaki-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="bg-khaki-300 text-khaki-800 text-xs font-medium px-3 py-1 rounded-full">
                בקרוב
              </span>
              <h4 className="text-lg font-bold text-gray-800">
                סימולציות ראיון
              </h4>
            </div>
            <p className="text-gray-600 text-sm">
              תוכל לתרגל שאלות ראיון ולקבל משוב.
            </p>
          </button>

          <button
            onClick={() => setShowComingSoon(true)}
            className="w-full bg-khaki-100 rounded-2xl shadow-sm p-5 text-right border border-khaki-200 hover:border-khaki-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="bg-khaki-300 text-khaki-800 text-xs font-medium px-3 py-1 rounded-full">
                בקרוב
              </span>
              <h4 className="text-lg font-bold text-gray-800">
                מאמן אישי
              </h4>
            </div>
            <p className="text-gray-600 text-sm">
              אפשר יהיה לשאול שאלות ולקבל הכוונה.
            </p>
          </button>

          <button
            onClick={() => setShowComingSoon(true)}
            className="w-full bg-khaki-100 rounded-2xl shadow-sm p-5 text-right border border-khaki-200 hover:border-khaki-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="bg-khaki-300 text-khaki-800 text-xs font-medium px-3 py-1 rounded-full">
                בקרוב
              </span>
              <h4 className="text-lg font-bold text-gray-800">
                מפת הדרך לגיוס
              </h4>
            </div>
            <p className="text-gray-600 text-sm">
              נראה לך את השלבים בתהליך הגיוס.
            </p>
          </button>
        </div>
      </div>

      {showComingSoon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50" onClick={() => setShowComingSoon(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center mb-4">
              <div className="bg-khaki-200 rounded-full p-4">
                <Lock className="text-khaki-700" size={32} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
              בקרוב
            </h3>
            <p className="text-gray-600 text-center mb-6">
              התכונה הזו תתווסף בגרסה הבאה של האפליקציה.
              נשמח לשמוע ממך אם זה משהו שמעניין אותך.
            </p>
            <button
              onClick={() => setShowComingSoon(false)}
              className="w-full bg-olive-700 hover:bg-olive-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              הבנתי
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
