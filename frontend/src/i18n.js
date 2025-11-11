import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "create_title": "Shorten a URL",
      "target_placeholder": "Paste the long URL here",
      "alias_placeholder": "Custom alias (optional)",
      "password_placeholder": "Password (optional)",
      "expire_placeholder": "Expire in seconds (optional)",
      "create_btn": "Create Short Link",
      "copy_btn": "Copy",
      "share_btn": "Share",
      "go_btn": "Go",
      "protected_msg": "This link is password protected",
      "enter_password": "Enter password",
      "wrong_password": "Wrong password"
    }
  },
  hi: {
    translation: {
      "create_title": "URL छोटा करें",
      "target_placeholder": "लंबा URL यहाँ पेस्ट करें",
      "alias_placeholder": "कस्टम alias (वैकल्पिक)",
      "password_placeholder": "पासवर्ड (वैकल्पिक)",
      "expire_placeholder": "अवधि (सेकंड में, वैकल्पिक)",
      "create_btn": "शॉर्ट लिंक बनाएं",
      "copy_btn": "कॉपी",
      "share_btn": "शेयर करें",
      "go_btn": "जाओ",
      "protected_msg": "यह लिंक पासवर्ड से सुरक्षित है",
      "enter_password": "पासवर्ड दर्ज करें",
      "wrong_password": "गलत पासवर्ड"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
