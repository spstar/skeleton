import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useToggle, useClickAway } from 'react-use';
import webFontLoader from 'webfontloader';

type LngEnum = {
  zh: string;
  en: string;
};

const LANGUAGE_MAP: LngEnum = {
  en: 'EN',
  zh: 'CN'
};

interface Props {
  className: string;
}

function TranslationButton({ className }: Props) {
  const { t, i18n } = useTranslation();
  const [lng, setLng] = useState(i18n?.languages[0]);
  const [visible, setVisible] = useToggle(false);
  const ref = useRef(null);

  useMemo(() => {
    document.documentElement.lang = localStorage.getItem('_lng') || 'en';
  }, []);
  useEffect(() => {
    if (lng === 'en') {
      webFontLoader.load({
        google: {
          families: ['Chakra Petch:i500,i700']
        }
      });
    } else {
      webFontLoader.load({
        google: {
          families: ['Cousine:i400,i700']
        }
      });
    }
  }, [lng]);

  function onChangeLng(type: string) {
    setLng(type);
    i18n.changeLanguage(type);
    setVisible(false);
    document.documentElement.lang = type;
    localStorage.setItem('_lng', type);
  }

  useClickAway(ref, () => {
    setVisible(false);
  });

  return (
    <div ref={ref} className={`${className} cursor-pointer relative z-10`}>
      <span
        title={t('language')}
        onClick={() => setVisible(!visible)}
        className="text-white select-none md:px-4 px-2 py-0.5 font-bold text-[10px]"
      >
        {LANGUAGE_MAP[lng as keyof LngEnum]}
      </span>
      {visible && (
        <ul
          className="
        w-[108px]
        animate-shutter-in absolute md:top-14 top-12 right-0
        bg-[#040310] mt-0.5 rounded-lg py-4 space-y-4
        "
        >
          {Object.keys(LANGUAGE_MAP).map((k) => {
            return (
              <li
                key={k}
                onClick={onChangeLng.bind(null, k)}
                className="hover:text-[#D04DF1] px-6 text-sm font-bold"
              >
                {LANGUAGE_MAP[k as keyof LngEnum]}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default TranslationButton;
