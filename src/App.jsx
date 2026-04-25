import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import FeedPage from './pages/FeedPage';
import TeacherPage from './pages/TeacherPage';
import AuthPage from './pages/AuthPage';
import ChangeUsernamePage from './pages/ChangeUsernamePage';
import ChangeAvatarPage from './pages/ChangeAvatarPage';
import CreateTeacherPage from './pages/CreateTeacherPage';
import TermsPage from './pages/TermsPage';
import { useProfile } from './lib/useProfile';
import { isModerator } from './lib/roles';
import WelcomePage from './pages/WelcomePage';
import BetaCodePage from './pages/BetaCodePage';

export default function App() {
  const { profile, session, refresh } = useProfile();
  const [selected, setSelected] = useState(null);
  const [screen, setScreen] = useState(null);

  // ждём пока определится сессия
  if (session === undefined) return null;

  // ждём загрузки профиля
  if (session && !profile) return null;

  // период тестирования — все видят welcome
  if (session && profile) {
    if (screen === 'beta-code') {
      return (
        <AnimatePresence mode="wait">
          <BetaCodePage
            key="beta-code"
            onBack={() => setScreen(null)}
            onSuccess={() => setScreen('app')}
          />
        </AnimatePresence>
      );
    }
    if (screen !== 'app') {
      return <WelcomePage profile={profile} onOpenBetaCode={() => {
        // если уже вводил код раньше — сразу пускаем
        if (localStorage.getItem('beta_unlocked')) {
          setScreen('app');
        } else {
          setScreen('beta-code');
        }
      }} />;
    }
  }

  function handleSaved() {
    refresh();
    setScreen(null);
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        {!session ? (
          <AuthPage key="auth" onAuth={() => {}} />
        ) : screen === 'change-username' ? (
          <ChangeUsernamePage key="change-username" profile={profile} onBack={() => setScreen(null)} onSaved={handleSaved} />
        ) : screen === 'change-avatar' ? (
          <ChangeAvatarPage key="change-avatar" profile={profile} onBack={() => setScreen(null)} onSaved={handleSaved} />
        ) : screen === 'create-teacher' ? (
          <CreateTeacherPage key="create-teacher" onBack={() => setScreen(null)} onSaved={() => setScreen(null)} />
        ) : screen === 'terms' ? (
          <TermsPage key="terms" onBack={() => setScreen(null)} />
        ) : selected ? (
          <TeacherPage
            key={`teacher-${selected.teacher.id}`}
            teacher={selected.teacher}
            teacherIndex={selected.index}
            onBack={() => setSelected(null)}
            onOpenTerms={() => setScreen('terms')}
            onDeleted={() => setSelected(null)}
          />
        ) : (
          <FeedPage
            key="feed"
            profile={profile}
            onSelectTeacher={(teacher, index) => setSelected({ teacher, index })}
            onChangeUsername={() => setScreen('change-username')}
            onChangeAvatar={() => setScreen('change-avatar')}
            onCreateTeacher={() => setScreen('create-teacher')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
