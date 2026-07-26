import { useState, useRef } from 'react';

const Icon = ({ name, size = 20 }) => {
  const icons = {
    home: '⌂', journal: '▤', calendar: '▦', insights: '◔', settings: '⚙',
    plus: '+', play: '▶', more: '•••', fire: '♨', clock: '◷', spark: '✦',
    wave: '⌁', search: '⌕', arrow: '→', close: '×', pause: 'Ⅱ', mic: '●',
  };

  return <span aria-hidden="true" style={{ fontSize: size }}>{icons[name]}</span>;
};

const navItems = [
  ['home', 'Home'], ['journal', 'My journal'], ['calendar', 'Calendar'], ['insights', 'Insights'],
];

function App() {
  const [activeNav, setActiveNav] = useState('Home');
  const [recording, setRecording] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [savedRecordings, setSavedRecordings] = useState([]);
  const audioRef = useRef(null);
  const [entries, setEntries] = useState([
    { day: '24', month: 'JUL', title: 'A quieter morning', duration: '4:18', text: 'I started the day without reaching for my phone…', tag: 'Reflection', color: 'lavender' },
    { day: '23', month: 'JUL', title: 'Explaining the hard thing', duration: '6:42', text: 'I practised breaking down the API problem clearly…', tag: 'Work', color: 'sun' },
    { day: '22', month: 'JUL', title: 'Small wins, actually', duration: '3:07', text: 'Today felt ordinary until I listed what went right…', tag: 'Gratitude', color: 'mint' },
  ]);

  const saveRecording = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const timestamp = new Date().getTime();
    
    const recordingData = {
      id: timestamp,
      url: audioUrl,
      blob: audioBlob,
      name: `recording_${timestamp}.wav`,
      size: audioBlob.size,
      date: new Date().toLocaleString(),
      duration: audioChunks.length > 0 ? `${Math.ceil(audioChunks.length / 4)}s` : '0s',
    };
    
    setSavedRecordings(prev => [recordingData, ...prev]);
    setRecordedAudio(audioUrl);
    setAudioChunks([]);
    setModalOpen(false);
    setRecording(false);
    
    if (window.stream) {
      window.stream.getTracks().forEach(track => track.stop());
      window.stream = null;
    }
    setMediaRecorder(null);
    
    console.log('Recording saved:', recordingData.name, recordingData.size, 'bytes');
  };

  const startRecording = () => {
    if (recording) {
      mediaRecorder?.stop();
      saveRecording();
    } else {
      setModalOpen(true);
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        window.stream = stream;
        const recorder = new MediaRecorder(window.stream);
        
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            setAudioChunks(chunks => {
              const updatedChunks = [...chunks, e.data];
              console.log('Audio chunk received:', e.data.size, 'bytes', 'Total chunks:', updatedChunks.length);
              return updatedChunks;
            });
          }
        };
        
        recorder.onstop = () => {
          saveRecording();
        };
        
        recorder.start();
        setMediaRecorder(recorder);
        setRecording(true);
        console.log('Recording started');
      }).catch(err => {
        console.error('Failed to start recording:', err);
      });
    }
  };

  const playRecording = (url) => {
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play();
    }
  };

  const allEntries = [...savedRecordings.map(r => ({
    ...r,
    title: r.name,
    text: `Audio recording • ${r.size.toLocaleString()} bytes • ${r.date}`,
    tag: 'Recording',
    color: 'lavender',
    isRecording: true,
  })), ...entries];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#top" aria-label="Dictaphone Journal home">
          <span className="brand-mark"><Icon name="wave" size={27} /></span>
          <span>dictaphone<span>journal</span></span>
        </a>

        <nav className="navigation" aria-label="Primary navigation">
          {navItems.map(([icon, label]) => (
            <button
              className={`nav-item ${activeNav === label ? 'active' : ''}`}
              key={label}
              onClick={() => setActiveNav(label)}
            >
              <Icon name={icon} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item" onClick={() => setActiveNav('Settings')}>
            <Icon name="settings" /> <span>Settings</span>
          </button>
          <div className="profile">
            <div className="avatar">A</div>
            <div><strong>Alex Morgan</strong><small>Finding the words</small></div>
            <button className="more-button" aria-label="Profile menu"><Icon name="more" /></button>
          </div>
        </div>
      </aside>

      <main id="top" className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Thursday, July 24</p>
            <h1>Good morning, Alex <span>✺</span></h1>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Search journals"><Icon name="search" size={25} /></button>
            <button className="new-entry" onClick={startRecording}><Icon name="plus" size={24} /> New entry</button>
          </div>
        </header>

        <section className="hero-grid" aria-label="Daily journal prompt and activity">
          <article className="prompt-card">
            <div className="card-kicker"><span className="tiny-spark">✦</span> TODAY'S PROMPT</div>
            <h2>What did you notice<br />that surprised you?</h2>
            <p>One minute is enough. Your thoughts don't need to be polished to be worth keeping.</p>
            <button className="record-button" onClick={startRecording}>
              <span className={`record-dot ${recording ? 'recording' : ''}`}><Icon name="mic" size={14} /></span>
              {recording ? 'Pause recording' : 'Start recording'}
            </button>
            <span className="prompt-decoration one">✣</span><span className="prompt-decoration two">✦</span>
          </article>

          <article className="streak-card">
            <div className="streak-title"><span className="fire"><Icon name="fire" /></span><span>YOUR STREAK</span></div>
            <div className="streak-number">12 <span>days</span></div>
            <p>Show off. You've journaled every day this week.</p>
            <div className="week" aria-label="Seven day recording streak">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <span className={index < 4 ? 'done' : ''} key={`${day}-${index}`}>{index < 4 ? '✓' : day}</span>)}
            </div>
          </article>
        </section>

        <section className="stats-row" aria-label="Journal statistics">
          <div className="stat-card"><span className="stat-icon violet"><Icon name="journal" /></span><div><strong>28</strong><span>Total entries</span></div><small>+4 this week</small></div>
          <div className="stat-card"><span className="stat-icon peach"><Icon name="clock" /></span><div><strong>2h 41m</strong><span>Time speaking</span></div><small>+23 min this week</small></div>
          <div className="stat-card"><span className="stat-icon blue"><Icon name="spark" /></span><div><strong>7</strong><span>Reflections saved</span></div><small>Keep the good bits</small></div>
        </section>

        <section className="entries-section">
          <div className="section-heading"><div><p className="eyebrow">YOUR VOICE, LATELY</p><h2>Recent entries</h2></div><button className="text-button" onClick={() => setActiveNav('My journal')}>See all <Icon name="arrow" /></button></div>
          <div className="entries-list">
            {allEntries.map((entry, index) => (
              <article className="entry" key={entry.isRecording ? entry.id : entry.title + index}>
                <time className={`date-block ${entry.color}`}><strong>{entry.day || new Date(entry.id || Date.now()).getDate()}</strong><span>{entry.month || new Date(entry.id || Date.now()).toLocaleString('default', { month: 'short' }).toUpperCase()}</span></time>
                {entry.isRecording ? (
                  <>
                    <button className="play-button" aria-label={`Play ${entry.name}`} onClick={() => playRecording(entry.url)}>
                      <Icon name="play" size={16} />
                    </button>
                    <div className="entry-copy">
                      <div><h3>{entry.name}</h3><span className="entry-duration"><Icon name="clock" size={15} /> {entry.duration}</span></div>
                      <p>{entry.text}</p>
                    </div>
                    <span className={`tag ${entry.color}`}>{entry.tag}</span>
                    <audio ref={audioRef} src={entry.url} preload="metadata" />
                  </>
                ) : (
                  <>
                    <button className="play-button" aria-label={`Play ${entry.title}`}><Icon name="play" size={16} /></button>
                    <div className="entry-copy"><div><h3>{entry.title}</h3><span className="entry-duration"><Icon name="clock" size={15} /> {entry.duration}</span></div><p>{entry.text}</p></div>
                    <span className={`tag ${entry.color}`}>{entry.tag}</span>
                  </>
                )}
                <button className="entry-more" aria-label={`More options for ${entry.title}`}><Icon name="more" /></button>
              </article>
            ))}
          </div>
        </section>
      </main>

      {modalOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              if (recording) {
                mediaRecorder?.stop();
              }
              setModalOpen(false);
              setRecording(false);
            }
          }}>
          <section className="record-modal" role="dialog" aria-modal="true" aria-labelledby="record-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" aria-label="Close recording" onClick={() => { if (recording) { mediaRecorder?.stop(); window.stream?.getTracks().forEach(track => track.stop()); window.stream = null; } setModalOpen(false); setRecording(false); }}><Icon name="close" size={28} /></button>
            <span className="modal-mic"><Icon name="mic" size={32} /></span>
            <p className="eyebrow">NEW VOICE JOURNAL</p>
            <h2 id="record-title">{recording ? 'Recording your moment…' : 'Ready when you are.'}</h2>
            <div className="sound-bars">{Array.from({ length: 26 }, (_, index) => <i key={index} style={{ height: `${16 + ((index * 13) % 42)}px` }} />)}</div>
            <button className="record-button large" onClick={startRecording}>{recording ? <><Icon name="pause" /> Pause</> : <><Icon name="mic" /> Start recording</>}</button>
          </section>
        </div>
      )}

      {recordedAudio && (
        <div className="recorded-audio-preview">
          <audio ref={audioRef} src={recordedAudio} controls className="w-full mt-4" />
          <div className="debug-info">
            <p>Chunks captured: {audioChunks.length}</p>
            <p>Total blob size: {(new Blob(audioChunks, { type: 'audio/wav' })).size} bytes</p>
            <p>Recording status: {recording ? 'Recording' : 'Stopped'}</p>
          </div>
        </div>
      )}

      <div className="temp-output-info">
        <p>Saved recordings: {savedRecordings.length}</p>
      </div>
    </div>
  );
}

export default App;