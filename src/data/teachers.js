export const avatarGradients = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  'linear-gradient(135deg, #fccb90, #d57eeb)',
  'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
];

export function hashCode(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export const teachers = [
  {
    id: 1,
    name: 'Анна Сергеевна',
    tag: 'anna_math',
    subject: 'Математика',
    bio: 'Преподаю высшую математику и алгебру. 12 лет опыта. Готовлю к ЕГЭ и олимпиадам.',
    verified: true,
    online: true,
    rating: 4.9,
    reviews: 134,
    avatar: null,
    previewComments: [
      { id: 1, author: 'Алексей', tag: 'alex99', avatar: 'https://i.pravatar.cc/40?img=11', text: 'Лучший препод по математике, объясняет так что даже я понял интегралы 🔥' },
      { id: 2, author: 'Катя', tag: 'katya_s', avatar: 'https://i.pravatar.cc/40?img=5', text: 'Занимаюсь уже полгода, прогресс огромный. Всем советую!' },
    ],
  },
  {
    id: 2,
    name: 'Дмитрий Олегович',
    tag: 'dmitry_phys',
    subject: 'Физика',
    bio: 'Кандидат физических наук. Объясняю сложное простыми словами. Люблю эксперименты.',
    verified: true,
    online: false,
    rating: 4.7,
    reviews: 89,
    avatar: null,
    previewComments: [
      { id: 1, author: 'Максим', tag: 'max_phys', avatar: 'https://i.pravatar.cc/40?img=15', text: 'Сдал ЕГЭ на 94 балла благодаря ему. Топ преподаватель без вопросов.' },
      { id: 2, author: 'Вика', tag: 'vika_v', avatar: 'https://i.pravatar.cc/40?img=9', text: 'Очень доступно объясняет, никогда не думала что полюблю физику 😅' },
    ],
  },
  {
    id: 3,
    name: 'Мария Ивановна',
    tag: 'maria_eng',
    subject: 'Английский язык',
    bio: 'IELTS 8.5. Жила в Лондоне 3 года. Разговорный, деловой, подготовка к экзаменам.',
    verified: false,
    online: true,
    rating: 4.8,
    reviews: 211,
    avatar: null,
    previewComments: [
      { id: 1, author: 'Никита', tag: 'nikita_k', avatar: 'https://i.pravatar.cc/40?img=18', text: 'За 3 месяца с нуля до B2. Это реально работает.' },
      { id: 2, author: 'Соня', tag: 'sonya_m', avatar: 'https://i.pravatar.cc/40?img=6', text: 'Лучший английский в моей жизни, спасибо огромное ❤️' },
    ],
  },
  {
    id: 4,
    name: 'Игорь Петрович',
    tag: 'igor_hist',
    subject: 'История',
    bio: 'Историк, автор трёх книг. Веду уроки как детективные расследования прошлого.',
    verified: true,
    online: false,
    rating: 4.6,
    reviews: 57,
    avatar: null,
    previewComments: [
      { id: 1, author: 'Даша', tag: 'dasha_d', avatar: 'https://i.pravatar.cc/40?img=47', text: 'История никогда не была такой интересной. Каждый урок как сериал.' },
    ],
  },
  {
    id: 5,
    name: 'Светлана Николаевна',
    tag: 'sveta_chem',
    subject: 'Химия',
    bio: 'Органическая и неорганическая химия. Подготовка к ЕГЭ. Онлайн и офлайн.',
    verified: false,
    online: true,
    rating: 4.5,
    reviews: 43,
    avatar: null,
    previewComments: [
      { id: 1, author: 'Полина', tag: 'polina_p', avatar: 'https://i.pravatar.cc/40?img=44', text: 'Очень доступно объясняет реакции. Рекомендую всем кто боится химии.' },
      { id: 2, author: 'Рома', tag: 'roma_r', avatar: 'https://i.pravatar.cc/40?img=12', text: 'Сдал на 88, год назад знал химию на троечку. Результат говорит сам за себя.' },
    ],
  },
];

export const initialComments = {
  1: [
    { id: 1, author: 'Алексей', tag: 'alex99', text: 'Лучший преподаватель по математике! Объясняет так, что даже я понял интегралы.', date: '2 ч назад', likes: 12, replyTo: null },
    { id: 2, author: 'Катя', tag: 'katya_s', text: 'Согласна, очень терпеливая. Занимаюсь уже полгода, прогресс огромный.', date: '1 ч назад', likes: 7, replyTo: 1 },
    { id: 3, author: 'Анон', tag: 'anon_007', text: 'Дорого берёт, но оно того стоит.', date: '45 мин назад', likes: 3, replyTo: null },
  ],
  2: [
    { id: 1, author: 'Максим', tag: 'max_phys', text: 'Дмитрий Олегович — топ. Сдал ЕГЭ на 94 балла благодаря ему.', date: '3 ч назад', likes: 18, replyTo: null },
    { id: 2, author: 'Вика', tag: 'vika_v', text: 'Как записаться? Нигде не нашла контакты.', date: '2 ч назад', likes: 1, replyTo: null },
    { id: 3, author: 'Максим', tag: 'max_phys', text: '>>2 В шапке профиля есть кнопка написать.', date: '1 ч назад', likes: 4, replyTo: 2 },
  ],
  3: [
    { id: 1, author: 'Никита', tag: 'nikita_k', text: 'Мария Ивановна просто огонь. За 3 месяца с нуля до B2.', date: '5 ч назад', likes: 24, replyTo: null },
  ],
  4: [],
  5: [
    { id: 1, author: 'Полина', tag: 'polina_p', text: 'Очень доступно объясняет реакции. Рекомендую всем кто боится химии.', date: '1 д назад', likes: 9, replyTo: null },
  ],
};
