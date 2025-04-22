import React, { useState, useEffect } from 'react';
import { FloatButton, Popover, Checkbox, Button, Typography } from 'antd';
import CookiesImg from "../../assets/Cookies.svg";
import { Link } from 'react-router-dom';
const { Paragraph } = Typography;

type Preferences = {
  necessary: boolean;
  analytics: boolean;
};

const STORAGE_KEY = 'cookiePreferences';

export const CookieManager: React.FC = () => {
  const [preferences, setPreferences] = useState<Preferences>({
    necessary: true,
    analytics: true,
  });
  const [visible, setVisible] = useState(false);

  // On mount: load saved prefs (if any), otherwise show popover
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setPreferences(JSON.parse(saved));
      } else {
        setVisible(true);
      }
    } catch (e) {
      // if parsing fails or localStorage is unavailable, just show popover
      setVisible(true);
    }
  }, []);

  const handleToggle = (key: keyof Preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSavePreferences = () => {
    // persist to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    setVisible(false);
    console.log('Saved cookie prefs:', preferences);
  };

  const content = (
    <div style={{ width: 240 }}>
      <Paragraph>Spravujte svoje cookies preference:</Paragraph>
      
      <div style={{ marginBottom: 8 }}>
        <label>
          <Checkbox checked={preferences.necessary} disabled />
          {' '}Nezbytné Cookies
        </label>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>
          <Checkbox
            checked={preferences.analytics}
            onChange={() => handleToggle('analytics')}
          />
          {' '}Analytická Cookies
        </label>
      </div>
      <div style={{ marginBottom: 12 }}>
        <Link
            to="/Zasady-cookies"
            rel="noopener noreferrer"
            style={{ color: '#1890ff' }}
        >
            Zásady cookies
        </Link>
      </div>
      <Button
        size="small"
        type="primary"
        style={{ width: "100%" }}
        onClick={() => {
          // if you want “Souhlasím se vším” to auto-check analytics:
          setPreferences({ necessary: true, analytics: true });
          handleSavePreferences();
        }}
      >
        Potvrdit
      </Button>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      placement="topRight"
      visible={visible}
      onVisibleChange={setVisible}
    >
      <FloatButton
        icon={
          <img
            src={CookiesImg}
            alt="Cookies"
            style={{ width: 20, height: 20, display: 'block' }}
          />
        }
        style={{ right: 24, bottom: 24, minWidth: 0 }}
      />
    </Popover>
  );
};

export default CookieManager;
