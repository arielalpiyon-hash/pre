import { useState, useEffect } from 'react';
import { X, Send, MessageCircle, Lightbulb } from 'lucide-react';
import { searchWithAgent } from '../utils/agentSearch';
import { suggestedQuestions } from '../data/suggestedQuestions';
import {
  createInitialContext,
  updateUserProfile,
  extractUserContext,
  getNextFollowUpQuestion
} from '../utils/conversationContext';
import { buildGuidedResponse, formatGuidedMessage } from '../utils/guidedResponseBuilder';
import type { ConversationContext, ConversationMessage } from '../types/conversation';

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType?: 'candidate' | 'parent';
  context?: {
    trackId?: string;
    trackName?: string;
  };
}

export default function AskQuestionModal({ isOpen, onClose, userType = 'candidate', context }: AskQuestionModalProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [conversationContext, setConversationContext] = useState<ConversationContext>(createInitialContext());
  const [chatHistory, setChatHistory] = useState<ConversationMessage[]>([]);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent, directQuestion?: string) => {
    if (e) e.preventDefault();

    const questionToAsk = directQuestion || question;
    if (!questionToAsk.trim()) return;

    const userMessage: ConversationMessage = {
      role: 'user',
      content: questionToAsk,
      timestamp: new Date(),
    };
    setChatHistory(prev => [...prev, userMessage]);

    const userContextUpdates = extractUserContext(questionToAsk, conversationContext);
    const updatedContext = updateUserProfile(conversationContext, userContextUpdates);
    updatedContext.messagesHistory.push(userMessage);
    setConversationContext(updatedContext);

    setQuestion('');
    setIsSearching(true);

    setTimeout(async () => {
      try {
        const rawAnswer = await searchWithAgent(questionToAsk, userType, updatedContext.userProfile);

        const guidedResponse = buildGuidedResponse(
          rawAnswer,
          questionToAsk,
          updatedContext
        );

        let finalAnswer = formatGuidedMessage(guidedResponse);

        const followUpQuestion = getNextFollowUpQuestion(updatedContext.userProfile, questionToAsk);
        if (followUpQuestion) {
          finalAnswer += `\n\n**כדי לכוון אותך נכון:**\n${followUpQuestion}`;
        }

        const assistantMessage: ConversationMessage = {
          role: 'assistant',
          content: finalAnswer,
          timestamp: new Date(),
        };
        setChatHistory(prev => [...prev, assistantMessage]);
        setAnswer(finalAnswer);

        updatedContext.messagesHistory.push(assistantMessage);
        setConversationContext(updatedContext);
      } catch (error) {
        console.error('Error getting answer:', error);
        const errorMessage = 'מצטער, אירעה שגיאה בעיבוד השאלה. אנא נסה שוב.';
        setChatHistory(prev => [...prev, {
          role: 'assistant',
          content: errorMessage,
          timestamp: new Date(),
        }]);
        setAnswer(errorMessage);
      } finally {
        setIsSearching(false);
      }
    }, 1500);
  };

  const handleQuestionChipClick = (selectedQuestion: string) => {
    handleSubmit(undefined, selectedQuestion);
  };

  const handleClose = () => {
    setQuestion('');
    setAnswer(null);
    setChatHistory([]);
    setConversationContext(createInitialContext());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-olive-100 rounded-full flex items-center justify-center">
              <MessageCircle className="text-olive-700" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">שאל שאלה</h2>
              <p className="text-sm text-gray-600">קבל הכוונה מתוך המידע שיש באפליקציה</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {chatHistory.length === 0 && !isSearching && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="text-olive-600" size={20} />
                <h3 className="text-base font-semibold text-gray-900">
                  שאלות שאנשים שואלים לפני מיונים לצה״ל
                </h3>
              </div>

              <div className="space-y-5">
                {suggestedQuestions.map((group, groupIndex) => (
                  <div key={groupIndex}>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2.5">
                      {group.groupTitle}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {group.questions.map((q, qIndex) => (
                        <button
                          key={qIndex}
                          onClick={() => handleQuestionChipClick(q)}
                          className="bg-white border border-gray-300 hover:border-olive-600 hover:bg-olive-50 text-gray-700 hover:text-olive-900 px-4 py-2.5 rounded-xl text-sm text-right transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {chatHistory.length > 0 && (
            <div className="space-y-4 mb-6">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                      msg.role === 'user'
                        ? 'bg-olive-700 text-white'
                        : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-right">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="או כתוב שאלה משלך..."
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 pr-12 text-right focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent"
                disabled={isSearching}
              />
              <button
                type="submit"
                disabled={!question.trim() || isSearching}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-olive-700 text-white p-2 rounded-lg hover:bg-olive-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </form>

          {isSearching && (
            <div className="flex items-center justify-start">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl px-5 py-3 border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-olive-700"></div>
                  <p className="text-sm text-gray-600">מחשב תשובה...</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {chatHistory.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                setChatHistory([]);
                setAnswer(null);
                setConversationContext(createInitialContext());
              }}
              className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              התחל שיחה חדשה
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
