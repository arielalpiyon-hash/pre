interface EncouragementScreenProps {
  onContinue: () => void;
  onFinish: () => void;
}

export default function EncouragementScreen({ onContinue, onFinish }: EncouragementScreenProps) {
  return (
    <div className="min-h-screen bg-neutral-50 p-6 flex flex-col items-center justify-center">
      <div className="max-w-lg mx-auto text-center px-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          כל הכבוד
        </h2>
        <p className="text-xl text-gray-700 leading-relaxed mb-3">
          עצם זה שעצרת רגע לחשוב על הדברים האלה כבר חשוב.
        </p>
        <p className="text-xl text-gray-700 leading-relaxed mb-10">
          הרבה בני נוער לא לוקחים את הזמן לעשות את זה.
        </p>

        <div className="space-y-4 mt-12">
          <button
            onClick={onContinue}
            className="w-full bg-olive-700 hover:bg-olive-800 active:bg-olive-900 text-white text-lg font-semibold py-5 px-6 rounded-2xl transition-all shadow-lg"
          >
            לעוד שאלה
          </button>
          <button
            onClick={onFinish}
            className="w-full bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-900 text-lg font-semibold py-5 px-6 rounded-2xl transition-all border-2 border-gray-200"
          >
            סיימתי להיום
          </button>
        </div>
      </div>
    </div>
  );
}
