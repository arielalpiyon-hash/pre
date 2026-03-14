import { useState } from 'react';
import { Search, ArrowRight, ChevronLeft, MessageCircle } from 'lucide-react';
import { tracks } from '../data/tracksData';
import { searchKnowledge, getAllTopics } from '../utils/guidanceSearch';
import { KnowledgeItem } from '../types/guidance';
import AskQuestionModal from './AskQuestionModal';

interface TracksExplorerScreenProps {
  onBack: () => void;
  userType?: 'candidate' | 'parent';
}

export default function TracksExplorerScreen({ onBack, userType = 'candidate' }: TracksExplorerScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<typeof tracks[0] | null>(null);
  const [activeTab, setActiveTab] = useState<'tracks' | 'guidance'>('tracks');
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  const filteredTracks = tracks.filter(track =>
    track.name.includes(searchQuery) ||
    track.category.includes(searchQuery) ||
    track.summary.includes(searchQuery) ||
    track.keywords.some(keyword => keyword.includes(searchQuery))
  );

  const filteredGuidance = searchKnowledge({
    searchQuery: searchQuery || undefined
  });

  const guidanceTopics = getAllTopics();

  if (selectedTrack) {
    const relevantGuidance = searchKnowledge({
      searchQuery: selectedTrack.name
    }).slice(0, 6);

    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <button
              onClick={() => setSelectedTrack(null)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-2"
            >
              <ChevronLeft size={20} />
              <span>חזרה</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{selectedTrack.name}</h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-olive-100 text-olive-800 text-xs font-medium px-3 py-1 rounded-full">
                    {selectedTrack.ui.badge}
                  </span>
                  {selectedTrack.entryType === 'screening' && (
                    <span className="bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full">
                      דורש מיון
                    </span>
                  )}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">{selectedTrack.summary}</p>
              </div>
            </div>

            {selectedTrack.requirements && selectedTrack.requirements.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">דרישות:</h3>
                <ul className="space-y-1">
                  {selectedTrack.requirements.map((req, idx) => (
                    <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                      <span className="text-olive-600 mt-0.5">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mb-6">
            <button
              onClick={() => setIsQuestionModalOpen(true)}
              className="w-full bg-olive-50 border-2 border-olive-200 text-olive-800 rounded-xl py-4 px-5 font-medium hover:bg-olive-100 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              <span>יש לך שאלה על {selectedTrack.name}?</span>
            </button>
          </div>

          {relevantGuidance.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                דברים שכדאי לדעת
              </h2>
              <div className="space-y-3">
                {relevantGuidance.map((item) => (
                  <GuidanceCard key={item.id} item={item} userType={userType} />
                ))}
              </div>
            </div>
          )}
        </div>

        <AskQuestionModal
          isOpen={isQuestionModalOpen}
          onClose={() => setIsQuestionModalOpen(false)}
          userType={userType}
          context={{
            trackId: selectedTrack.id,
            trackName: selectedTrack.name
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-3"
          >
            <ChevronLeft size={20} />
            <span>חזרה</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">חקור מסלולים ומידע</h1>

          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חפש מסלול או נושא..."
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 pr-11 text-right focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('tracks')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'tracks'
                  ? 'bg-olive-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              מסלולים רשמיים
            </button>
            <button
              onClick={() => setActiveTab('guidance')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'guidance'
                  ? 'bg-olive-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              טיפים ועצות
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {activeTab === 'tracks' ? (
          <div>
            {searchQuery && (
              <p className="text-gray-600 mb-4">
                נמצאו {filteredTracks.length} מסלולים
              </p>
            )}
            <div className="space-y-3">
              {filteredTracks.map((track) => (
                <button
                  key={track.id}
                  onClick={() => setSelectedTrack(track)}
                  className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-5 text-right hover:shadow-md hover:border-olive-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <ArrowRight className="text-gray-400 flex-shrink-0 mt-1" size={20} />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{track.ui.cardTitle}</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{track.ui.cardSubtitle}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-olive-100 text-olive-800 text-xs font-medium px-2.5 py-1 rounded-full">
                          {track.ui.badge}
                        </span>
                        {track.entryType === 'screening' && (
                          <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-1 rounded-full">
                            דורש מיון
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {searchQuery ? (
              <div>
                <p className="text-gray-600 mb-4">
                  נמצאו {filteredGuidance.length} פריטי מידע
                </p>
                <div className="space-y-3">
                  {filteredGuidance.map((item) => (
                    <GuidanceCard key={item.id} item={item} userType={userType} />
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-6">
                  עיין בנושאים שונים כדי למצוא מידע שיעזור לך
                </p>
                <div className="space-y-6">
                  {guidanceTopics.slice(0, 8).map((topic) => {
                    const topicItems = searchKnowledge({ topic }).slice(0, 3);
                    return (
                      <div key={topic}>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">{topic}</h3>
                        <div className="space-y-2">
                          {topicItems.map((item) => (
                            <GuidanceCard key={item.id} item={item} compact userType={userType} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface GuidanceCardProps {
  item: KnowledgeItem;
  compact?: boolean;
  userType?: 'candidate' | 'parent';
}

function GuidanceCard({ item, compact, userType = 'candidate' }: GuidanceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayAnswer = userType === 'parent' && item.answer_parent
    ? item.answer_parent
    : item.answer;

  const displayBullets = userType === 'parent' && item.bullets_parent
    ? item.bullets_parent
    : item.bullets;

  const displayTips = userType === 'parent' && item.tips_parent
    ? item.tips_parent
    : item.tips;

  const displayActions = userType === 'parent' && item.actions_parent
    ? item.actions_parent
    : item.actions;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-right"
      >
        <div className="flex items-start justify-between gap-3">
          <ChevronLeft
            className={`text-gray-400 flex-shrink-0 mt-1 transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}
            size={18}
          />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1 text-base">
              {item.question}
            </h4>
            {!compact && !isExpanded && (
              <p className="text-gray-600 text-sm line-clamp-2">{displayAnswer}</p>
            )}
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-gray-700 leading-relaxed mb-3">{displayAnswer}</p>

          {displayBullets && displayBullets.length > 0 && (
            <ul className="space-y-1.5 mb-3">
              {displayBullets.map((bullet, idx) => (
                <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                  <span className="text-olive-600 mt-0.5">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}

          {displayTips && displayTips.length > 0 && (
            <div className="mb-3">
              <h5 className="font-semibold text-gray-900 mb-2 text-sm">טיפים חשובים</h5>
              <ul className="space-y-1.5">
                {displayTips.map((tip, idx) => (
                  <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                    <span className="text-olive-600 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {displayActions && displayActions.length > 0 && (
            <div className="mb-3">
              <h5 className="font-semibold text-gray-900 mb-2 text-sm">מה כדאי לעשות עכשיו</h5>
              <ul className="space-y-1.5">
                {displayActions.map((action, idx) => (
                  <li key={idx} className="text-gray-700 text-sm flex items-start gap-2">
                    <span className="text-olive-600 mt-0.5">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {item.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="bg-khaki-100 text-khaki-800 text-xs font-medium px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
