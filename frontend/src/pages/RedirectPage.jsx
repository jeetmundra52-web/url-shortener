import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export default function RedirectPage() {
  const { alias } = useParams();
  const [meta, setMeta] = React.useState(null);
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const { t } = useTranslation();

  React.useEffect(() => {
    axios.get(`http://localhost:5000/api/links/meta/${alias}`)
      .then(r => setMeta(r.data))
      .catch(() => setMeta(null));
  }, [alias]);

  async function doAccess(e) {
    e?.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/links/access/${alias}`, { password });
      const url = res.data.redirectTo;
      // client-side navigate
      window.location.href = url;
    } catch (err) {
      const code = err.response?.status;
      if (code === 403) setError(t('wrong_password'));
      else if (code === 410) setError('Link expired');
      else setError('Error');
    }
  }

  if (meta === null) return <div className="p-6">Loading / not found</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Redirect: {alias}</h2>
        {meta.isProtected ? (
          <form onSubmit={doAccess} className="space-y-2">
            <div>{t('protected_msg')}</div>
            <input value={password} onChange={e=>setPassword(e.target.value)} placeholder={t('enter_password')} className="w-full p-2 border rounded" />
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-sky-600 text-white rounded">{t('go_btn')}</button>
            </div>
            {error && <div className="text-red-500">{error}</div>}
          </form>
        ) : (
          <div>
            <p>Link is not password protected — redirecting...</p>
            <button onClick={doAccess} className="px-3 py-1 border rounded mt-3">Go</button>
          </div>
        )}
      </div>
    </div>
  );
}
