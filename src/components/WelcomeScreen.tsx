interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-neutral-50 p-6 flex flex-col">
      <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full px-2">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 text-center">
            רגע לפני הצבא
          </h1>
          <div className="w-16 h-1 bg-olive-600 mx-auto rounded-full"></div>
        </div>

        <div className="space-y-7 text-lg md:text-xl text-gray-700">
          <p>
            עוד מעט מתחיל שלב חדש בחיים שלך.
          </p>

          <p>
            צו ראשון, מיונים, ראיונות והחלטות על הדרך שלך בצבא.
          </p>

          <p>
            יש בני נוער שכבר יודעים מה הם רוצים, אבל הרבה אחרים עדיין מנסים להבין.
          </p>

          <p className="font-semibold text-gray-900 text-xl">
            וזה לגמרי בסדר.
          </p>

          <p className="pt-2">
            האפליקציה הזו נותנת לך רגע לעצור ולחשוב קצת על עצמך ועל הדרך שלך.
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto w-full">
        <button
          onClick={onStart}
          className="w-full bg-olive-700 hover:bg-olive-800 active:bg-olive-900 text-white text-xl font-semibold py-5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all mt-8"
        >
          מתחילים
        </button>
      </div>
    </div>
  );
}
