import './App.css';
import { PdfConversation } from './features/conversation/components/PdfConversation';

function App() {
  return (
    <>
      <header>
        <strong>PDF Conversations</strong>
      </header>
      <main>
        <PdfConversation />
      </main>
    </>
  );
}

export default App;
