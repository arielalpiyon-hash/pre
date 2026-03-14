import { CircleUser as UserCircle, Users } from 'lucide-react';

interface UserSelectionScreenProps {
  onSelectUserType: (userType: 'candidate' | 'parent') => void;
}

export default function UserSelectionScreen({ onSelectUserType }: UserSelectionScreenProps) {
  return (
    <div className="min-h-screen bg-neutral-50 p-6 flex flex-col">
      <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full px-2">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 text-center leading-tight">
            ברוכים הבאים לאפליקציית ההכנה לצה״ל
          </h1>
          <div className="w-16 h-1 bg-olive-600 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-700 text-center">
            בחר מי משתמש באפליקציה
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onSelectUserType('candidate')}
            className="w-full bg-white hover:bg-olive-50 border-2 border-olive-300 hover:border-olive-500 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between gap-6">
              <div className="bg-olive-100 group-hover:bg-olive-200 rounded-full p-4 transition-colors">
                <UserCircle className="text-olive-700" size={48} />
              </div>
              <div className="flex-1 text-right">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  🪖 אני מלש״ב
                </h2>
                <p className="text-gray-600 text-base">
                  אני מתכונן לגיוס ורוצה ללמוד על התהליך
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onSelectUserType('parent')}
            className="w-full bg-white hover:bg-olive-50 border-2 border-olive-300 hover:border-olive-500 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between gap-6">
              <div className="bg-khaki-100 group-hover:bg-khaki-200 rounded-full p-4 transition-colors">
                <Users className="text-khaki-700" size={48} />
              </div>
              <div className="flex-1 text-right">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  👨‍👩‍👦 אני הורה
                </h2>
                <p className="text-gray-600 text-base">
                  אני רוצה לעזור לילד/ה שלי להתכונן לצבא
                </p>
              </div>
            </div>
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            המידע באפליקציה מותאם לפי סוג המשתמש
          </p>
        </div>
      </div>
    </div>
  );
}
