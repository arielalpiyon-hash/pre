import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { supabase } from './lib/supabase';
import WelcomeScreen from './components/WelcomeScreen';
import UserSelectionScreen from './components/UserSelectionScreen';
import OnboardingScreen from './components/OnboardingScreen';
import PersonalizedIntroScreen from './components/PersonalizedIntroScreen';
import HomeScreen from './components/HomeScreen';
import TasksScreen from './components/TasksScreen';
import FeedbackScreen from './components/FeedbackScreen';
import EncouragementScreen from './components/EncouragementScreen';
import ClosingScreen from './components/ClosingScreen';
import FinalThankYouScreen from './components/FinalThankYouScreen';
import TracksExplorerScreen from './components/TracksExplorerScreen';
import AskQuestionModal from './components/AskQuestionModal';

type Screen = 'welcome' | 'userSelection' | 'onboarding' | 'personalizedIntro' | 'home' | 'tasks' | 'encouragement' | 'closing' | 'feedback' | 'finalThankYou' | 'explorer';
type UserType = 'candidate' | 'parent';

interface OnboardingData {
  age?: number;
  recruitment_stage?: string;
  main_concern?: string;
}

interface FeedbackData {
  most_useful: string;
  less_clear: string;
  made_think: boolean | null;
  would_recommend: boolean | null;
  contact_info: string;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [userType, setUserType] = useState<UserType | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  useEffect(() => {
    // Clear localStorage to start fresh
    localStorage.clear();
  }, []);

  const handleStart = () => {
    setCurrentScreen('userSelection');
  };

  const handleUserTypeSelection = (type: UserType) => {
    setUserType(type);
    localStorage.setItem('userType', type);
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = async (data: OnboardingData) => {
    setOnboardingData(data);

    try {
      const { data: userData, error } = await supabase
        .from('users')
        .insert([
          {
            age: data.age,
            recruitment_stage: data.recruitment_stage,
            main_concern: data.main_concern
          }
        ])
        .select()
        .single();

      if (error) throw error;

      if (userData) {
        setUserId(userData.id);
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('currentScreen', 'personalizedIntro');
        setCurrentScreen('personalizedIntro');
      }
    } catch (error) {
      console.error('Error saving user data:', error);
      const tempId = `temp_${Date.now()}`;
      setUserId(tempId);
      localStorage.setItem('userId', tempId);
      localStorage.setItem('currentScreen', 'personalizedIntro');
      setCurrentScreen('personalizedIntro');
    }
  };

  const handlePersonalizedIntroContinue = () => {
    setCurrentScreen('home');
    localStorage.setItem('currentScreen', 'home');
  };

  const handleStartTask = () => {
    setCurrentScreen('tasks');
    localStorage.setItem('currentScreen', 'tasks');
  };

  const handleTaskComplete = async (taskKey: string, response: string) => {
    try {
      if (userId && !userId.startsWith('temp_')) {
        await supabase
          .from('task_responses')
          .insert([
            {
              user_id: userId,
              task_key: taskKey,
              response_text: response
            }
          ]);
      }

      const newCompletedTasks = [...completedTasks, taskKey];
      setCompletedTasks(newCompletedTasks);
      localStorage.setItem('completedTasks', JSON.stringify(newCompletedTasks));

      setCurrentScreen('encouragement');
      localStorage.setItem('currentScreen', 'encouragement');
    } catch (error) {
      console.error('Error saving task response:', error);
      const newCompletedTasks = [...completedTasks, taskKey];
      setCompletedTasks(newCompletedTasks);
      localStorage.setItem('completedTasks', JSON.stringify(newCompletedTasks));
      setCurrentScreen('encouragement');
      localStorage.setItem('currentScreen', 'encouragement');
    }
  };

  const handleContinueToNextTask = () => {
    setCurrentScreen('tasks');
    localStorage.setItem('currentScreen', 'tasks');
  };

  const handleFinishForToday = () => {
    setCurrentScreen('closing');
    localStorage.setItem('currentScreen', 'closing');
  };

  const handleContinueToFeedback = () => {
    setCurrentScreen('feedback');
    localStorage.setItem('currentScreen', 'feedback');
  };

  const handleFeedbackSubmit = async (data: FeedbackData) => {
    try {
      if (userId && !userId.startsWith('temp_')) {
        await supabase
          .from('feedback')
          .insert([
            {
              user_id: userId,
              most_useful: data.most_useful,
              less_clear: data.less_clear,
              made_think: data.made_think,
              would_recommend: data.would_recommend,
              contact_info: data.contact_info
            }
          ]);
      }

      setHasSubmittedFeedback(true);
      localStorage.setItem('hasSubmittedFeedback', 'true');
      setCurrentScreen('finalThankYou');
      localStorage.setItem('currentScreen', 'finalThankYou');
    } catch (error) {
      console.error('Error saving feedback:', error);
      setHasSubmittedFeedback(true);
      localStorage.setItem('hasSubmittedFeedback', 'true');
      setCurrentScreen('finalThankYou');
      localStorage.setItem('currentScreen', 'finalThankYou');
    }
  };

  const handleFeedbackSkip = () => {
    setHasSubmittedFeedback(true);
    localStorage.setItem('hasSubmittedFeedback', 'true');
    setCurrentScreen('home');
    localStorage.setItem('currentScreen', 'home');
  };

  const handleFinalFinish = () => {
    setCurrentScreen('home');
    localStorage.setItem('currentScreen', 'home');
  };

  const handleExplore = () => {
    setCurrentScreen('explorer');
    localStorage.setItem('currentScreen', 'explorer');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    localStorage.setItem('currentScreen', 'home');
  };

  const showFloatingButton = currentScreen !== 'welcome' && currentScreen !== 'userSelection' && userType;

  return (
    <div className="min-h-screen">
      {currentScreen === 'welcome' && (
        <WelcomeScreen onStart={handleStart} />
      )}
      {currentScreen === 'userSelection' && (
        <UserSelectionScreen onSelectUserType={handleUserTypeSelection} />
      )}
      {currentScreen === 'onboarding' && userType && (
        <OnboardingScreen persona={userType} onComplete={handleOnboardingComplete} />
      )}
      {currentScreen === 'personalizedIntro' && userType && (
        <PersonalizedIntroScreen
          persona={userType}
          recruitmentStage={onboardingData.recruitment_stage}
          mainConcern={onboardingData.main_concern}
          onContinue={handlePersonalizedIntroContinue}
        />
      )}
      {currentScreen === 'home' && userType && (
        <HomeScreen persona={userType} userName={userName} onStartTask={handleStartTask} onExplore={handleExplore} />
      )}
      {currentScreen === 'explorer' && (
        <TracksExplorerScreen onBack={handleBackToHome} userType={userType || 'candidate'} />
      )}
      {currentScreen === 'tasks' && userType && (
        <TasksScreen
          persona={userType}
          completedTasks={completedTasks}
          onTaskComplete={handleTaskComplete}
        />
      )}
      {currentScreen === 'encouragement' && (
        <EncouragementScreen
          onContinue={handleContinueToNextTask}
          onFinish={handleFinishForToday}
        />
      )}
      {currentScreen === 'closing' && (
        <ClosingScreen onContinueToFeedback={handleContinueToFeedback} />
      )}
      {currentScreen === 'feedback' && userType && (
        <FeedbackScreen
          persona={userType}
          onSubmit={handleFeedbackSubmit}
          onSkip={handleFeedbackSkip}
        />
      )}
      {currentScreen === 'finalThankYou' && (
        <FinalThankYouScreen onFinish={handleFinalFinish} />
      )}

      {showFloatingButton && (
        <button
          onClick={() => setIsQuestionModalOpen(true)}
          className="fixed bottom-6 left-6 bg-olive-700 text-white rounded-full p-4 shadow-lg hover:bg-olive-800 transition-all hover:scale-105 z-40 flex items-center gap-2"
        >
          <MessageCircle size={24} />
          <span className="hidden sm:inline font-medium">יש לך שאלה?</span>
        </button>
      )}

      <AskQuestionModal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        userType={userType || 'candidate'}
      />
    </div>
  );
}

export default App;
