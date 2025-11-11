import React from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function CreateForm({ onCreate }) {
  const { t, i18n } = useTranslation();
  const [target, setTarget] = React.useState('');
  const [alias, setAlias] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [expire, setExpire] = React.useState('');
  const [result, setResult] = React.useState(null);

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/links/create', {
        target, alias: alias || undefined, password: password || undefined,
        expireInSeconds: expire ? Number(expire) : undefined
      });
      setResult(res.data);
      onCreate && onCreate({ alias: res.data.alias, target: res.data.target, customTitle: '', clicks:0, expireAt: res.data.expireAt });
    } catch (err) {
      alert(err.response?.data?.error || 'error');
    }
  }

  async function doShare() {
    if (!result) return;
    const shareUrl = result.shortUrl;
    if (navigator.share) {
      try { await navigator.share({ title: 'Short link', url: shareUrl }); }
      catch(e) { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert('Copied to clipboard');
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-end space-x-2 mb-3">
        <button onClick={() => i18n.changeLanguage('en')} className="px-2 py-1 border rounded">EN</button>
        <button onClick={() => i18n.changeLanguage('hi')} className="px-2 py-1 border rounded">HI</button>
      </div>
      <h2 className="text-lg font-semibold mb-2">{t('create_title')}</h2>
      <form onSubmit={submit} className="space-y-2">
        <input required value={target} onChange={e=>setTarget(e.target.value)} placeholder={t('target_placeholder')} className="w-full p-2 border rounded" />
        <div className="grid grid-cols-2 gap-2">
          <input value={alias} onChange={e=>setAlias(e.target.value)} placeholder={t('alias_placeholder')} className="p-2 border rounded" />
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder={t('password_placeholder')} className="p-2 border rounded" />
        </div>
        <input value={expire} onChange={e=>setExpire(e.target.value)} placeholder={t('expire_placeholder')} className="w-full p-2 border rounded" />
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-sky-600 text-white rounded">{t('create_btn')}</button>
          {result && <button type="button" onClick={doShare} className="px-3 py-2 border rounded">{t('share_btn')}</button>}
          {result && <input readOnly value={result.shortUrl} className="p-2 border rounded flex-1" />}
        </div>
      </form>
    </div>
  );
}
