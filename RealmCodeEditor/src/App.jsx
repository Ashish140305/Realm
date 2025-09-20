import './App.css'
import CodeEditor from './components/Editor';

function App() {

  return (
    <>
      <div>
        <h2 style={{ backgroundColor: '#333', color: 'white', padding: '10px' }}>
          🧠 Realtime Code Editor (Monaco)
        </h2>
        <CodeEditor />
      </div>
    </>
  )
}

export default App
