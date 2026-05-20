import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobe } from 'react-icons/fa';
import { Dropdown } from 'react-bootstrap';
import { applyDocumentDirection } from '../../Utils/applyDirection';
import './style.css';

const LANG_KEY = 'i18nextLng';

const normalizeLang = (lng) => (lng || 'en').split('-')[0];

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const currentLang = normalizeLang(i18n.language);
  const isArabic = currentLang === 'ar';

  useEffect(() => {
    applyDocumentDirection(i18n.language);
  }, [i18n.language]);

  const changeLanguage = (lng) => {
    localStorage.setItem(LANG_KEY, lng);
    i18n.changeLanguage(lng);
    applyDocumentDirection(lng);
  };

  return (
    <div className="language-switcher">
      <Dropdown align={isArabic ? 'start' : 'end'}>
        <Dropdown.Toggle
          variant="link"
          className="language-toggle"
          id="languageDropdown"
        >
          <FaGlobe className="globe-icon" />
          <span>{isArabic ? t('common.arabic') : t('common.english')}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="language-menu">
          <Dropdown.Item
            active={currentLang === 'en'}
            onClick={() => changeLanguage('en')}
          >
            <span className="lang-flag" aria-hidden>
              EN
            </span>
            {t('common.english')}
          </Dropdown.Item>
          <Dropdown.Item
            active={currentLang === 'ar'}
            onClick={() => changeLanguage('ar')}
          >
            <span className="lang-flag" aria-hidden>
              ع
            </span>
            {t('common.arabic')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default LanguageSwitcher;
