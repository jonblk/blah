import './App.css';
import Header from './components/Header';
import SheetMusic from './components/SheetMusic';
import SystemChanges from './components/SystemChanges';
import FileSelectors from './components/FileSelectors';
import { VideoPlayer } from './components/VideoPlayer';

function App() {
  return (
    <div className="App">
      {<Header />}
      <main className="">
        <FileSelectors />
        <VideoPlayer /> 
        <div className="main-container">
          <SheetMusic />
          <div className="system-changes-container">
            <SystemChanges />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;