import React from 'react'
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcherSimple() {
  const { t } = useTranslation()

  React.useEffect(() => {
    console.log('[LanguageSwitcherSimple] Component mounted!');
  }, []);

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px',
      backgroundColor: '#ffeb3b',
      border: '2px solid #f59e0b',
      borderRadius: '4px',
      fontWeight: 'bold',
      fontSize: '14px',
      color: '#92400e'
    }}>
      <span>🌍</span>
      <select
        style={{
          padding: '4px 8px',
          border: '1px solid #d69e2e',
          borderRadius: '4px',
          backgroundColor: '#ffffff',
          color: '#1f2937'
        }}
        onChange={(e) => {
          const newLang = e.target.value;
          window.location.href = `/${newLang}/`;
        }}
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="de">Deutsch</option>
        <option value="fr">Français</option>
        <option value="ja">日本語</option>
        <option value="ko">한국어</option>
        <option value="zh">中文</option>
      </select>
    </div>
  );
}