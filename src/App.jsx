import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import FeedPage from './pages/FeedPage';
import TeacherPage from './pages/TeacherPage';

export default function App() {
  const [selected, setSelected] = useState(null); // { teacher, index }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        {selected ? (
          <TeacherPage
            key={`teacher-${selected.teacher.id}`}
            teacher={selected.teacher}
            teacherIndex={selected.index}
            onBack={() => setSelected(null)}
          />
        ) : (
          <FeedPage
            key="feed"
            onSelectTeacher={(teacher, index) => setSelected({ teacher, index })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
