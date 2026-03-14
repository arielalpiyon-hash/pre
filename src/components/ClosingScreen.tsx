interface ClosingScreenProps {
  onContinueToFeedback: () => void;
}

export default function ClosingScreen({ onContinueToFeedback }: ClosingScreenProps) {
  return (
    <div className="min-h-screen bg-neutral-50 p-6 flex flex-col items-center justify-center">
      <div className="max-w-lg mx-auto text-center px-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          זהו להיום
        </h2>
        <p className="text-xl text-gray-700 leading-relaxed mb-3">
          לפעמים כמה דקות של מחשבה על עצמך יכולים לעזור לעשות סדר.
        </p>
        <p className="text-xl text-gray-700 leading-relaxed mb-10">
          אם תרצה, תמיד אפשר לחזור לעוד שאלות.
        </p>

        <button
          onClick={onContinueToFeedback}
          className="w-full bg-olive-700 hover:bg-olive-800 active:bg-olive-900 text-white text-lg font-semibold py-5 px-6 rounded-2xl transition-all shadow-lg"
        >
          המשך למשוב
        </button>
      </div>
    </div>
  );
}
