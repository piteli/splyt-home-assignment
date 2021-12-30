import { useEffect } from 'react';
import './App.css';
import HomeView from './views/home/Home';
import 'antd/dist/antd.css';

function App() {

  useEffect(() => getGoogleAPIKey(), []);

  function getGoogleAPIKey() {
    console.log('fetching the api');
  }

  return (
    <div className="App">
      <HomeView />
    </div>
  );
}

export default App;
