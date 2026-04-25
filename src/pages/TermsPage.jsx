import { motion } from 'motion/react';

export default function TermsPage({ onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.22 }}
      style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px',
        paddingTop: 'calc(12px + env(safe-area-inset-top))',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}>
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span style={{ fontSize: 17, fontWeight: 600 }}>Пользовательское соглашение</span>
      </div>

      {/* Content */}
      <div className="feed-scroll" style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 40px' }}>

        <p style={meta}>Последнее обновление: апрель 2025</p>

        <p style={body}>
          Используя данный сайт и оставляя комментарии, вы соглашаетесь с условиями, изложенными ниже.
          Пожалуйста, прочитайте их внимательно перед тем, как публиковать что-либо.
        </p>

        <h2 style={heading}>1. Ответственность за контент</h2>
        <p style={body}>
          Все комментарии, сообщения и иные материалы, размещённые пользователями на сайте,
          являются исключительно их личным мнением. Администрация сайта не несёт никакой
          ответственности за содержание публикаций пользователей.
        </p>
        <p style={body}>
          Пользователь самостоятельно и в полной мере несёт ответственность за любой контент,
          который он размещает, включая его законность, достоверность и соответствие
          общепринятым нормам.
        </p>

        <h2 style={heading}>2. Запрещённый контент</h2>
        <p style={body}>Запрещается публиковать:</p>
        <ul style={{ ...body, paddingLeft: 20, lineHeight: 2 }}>
          <li>заведомо ложную информацию о конкретных людях</li>
          <li>персональные данные третьих лиц без их согласия</li>
          <li>материалы, нарушающие авторские права</li>
          <li>спам, рекламу и ссылки на сторонние ресурсы без разрешения</li>
          <li>любой контент, нарушающий законодательство РФ</li>
        </ul>

        <h2 style={heading}>3. Модерация</h2>
        <p style={body}>
          Администрация оставляет за собой право удалять любые комментарии без предупреждения,
          если они нарушают настоящее соглашение или наносят вред репутации сайта, пользователей
          или третьих лиц.
        </p>

        <h2 style={heading}>4. Ограничение ответственности</h2>
        <p style={body}>
          Сайт предоставляется «как есть». Администрация не гарантирует бесперебойную работу
          сервиса и не несёт ответственности за любые убытки, возникшие в результате его
          использования или недоступности.
        </p>
        <p style={body}>
          Администрация не является автором, редактором или соавтором пользовательских
          комментариев и не может быть привлечена к ответственности за их содержание.
        </p>

        <h2 style={heading}>5. Принятие условий</h2>
        <p style={body}>
          Оставляя комментарий на сайте, вы подтверждаете, что ознакомились с настоящим
          соглашением, понимаете его и принимаете в полном объёме.
        </p>

      </div>
    </motion.div>
  );
}

const heading = {
  fontSize: 16,
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginTop: 24,
  marginBottom: 8,
  letterSpacing: '-0.2px',
};

const body = {
  fontSize: 14,
  color: 'var(--text-secondary)',
  lineHeight: 1.65,
  marginBottom: 10,
};

const meta = {
  fontSize: 12,
  color: 'var(--text-muted)',
  marginBottom: 16,
};
