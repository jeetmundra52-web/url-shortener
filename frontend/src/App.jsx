import React from 'react';
import CreateForm from './pages/CreateForm';
import LinkCard from './components/LinkCard';
import axios from 'axios';

export default function App() {
  const [links, setLinks] = React.useState([]);

  React.useEffect(() => {
    axios.get('http://localhost:5000/api/links/list').then(r => setLinks(r.data)).catch(()=>{});
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">URL Shortener</h1>
      <CreateForm onCreate={(link)=> setLinks(l => [link, ...l])} />
      <div className="mt-6 space-y-3">
        {links.map(l => <LinkCard key={l.alias} link={l} />)}
      </div>
    </div>
  );
}
