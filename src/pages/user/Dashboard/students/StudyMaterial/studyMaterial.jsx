import {
  Youtube,
  FileIcon,
  Link,
  Plus,
  Send,
  Bot,
  LucideAArrowUp,
  LucideAArrowDown,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { generateContent } from './components/genAi';
import api, { API_BASE_URLS } from '../../../../../api/axios_api_call';
import { getSessionData } from '../../components/currentSession';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function StudyMaterial() {
  const [notes, setNotes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [expandedNote, setExpandedNote] = useState(null);

  const toggleDropdown = (noteId) => {
    setExpandedNote(expandedNote === noteId ? null : noteId);
  };

  const url = API_BASE_URLS['Session_Service'];
  const session = getSessionData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          isAI: true,
          content: 'Please enter a prompt.',
          timestamp: Date.now(),
        },
      ]);
      return;
    }

    setIsLoading(true);
    const userMessage = {
      id: Date.now(),
      isAI: false,
      content: aiPrompt,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const botResponse = await generateContent(aiPrompt);
      const botMessage = {
        id: Date.now(),
        isAI: true,
        content: botResponse,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setAiPrompt('');
    } catch (err) {
      console.error('Error generating response:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          isAI: true,
          content: 'Failed to generate response',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getDataFromBackend = async () => {
    try {
      const response = await api.get('study-material/get-notes/', {
        baseURL: url,
        params: { session_key: session?.sessions?.session_code },
      });
      console.log('NOTES :', response.data);

      setNotes(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (fetchFromBackend) {
      getDataFromBackend();
      setFetchFromBackend(false);
    }
  }, [fetchFromBackend]);

  const convertToEmbedUrl = (url) => {
    if (!url.includes("watch?v=")) return url;
    let result = url.replace("watch?v=", "embed/");
    return result.replace("&t=", "?start=");
  };

  return (
    <div className="grid grid-cols-12 gap-6 max-h-full p-2">
 
    <div className="col-span-8 border-emerald-900 border-2 bg-[#051F1E] bg-opacity-40 rounded-xl p-6 h-[850px] overflow-y-auto">
      <div className="grid grid-cols-2 gap-4 mt-4 h-fit overflow-y-auto">
        {notes.map((note) => (
          <div key={note.id} className="student-card rounded-lg">
            <h3 className="font-medium">{note.title}</h3>
  
            <button
              onClick={() => toggleDropdown(note.id)}
              className="text-blue-400 underline mt-2"
            >
              {expandedNote === note.id ? <LucideAArrowUp /> : <LucideAArrowDown />}
            </button>
  
            {expandedNote === note.id && (
              <div className="mt-2 text-gray-300">
                <ReactMarkdown>{note.description}</ReactMarkdown>
              </div>
            )}
  
            <p className="break-words">{note.link}</p>
  
            {note.type === 'youtube' && (
              <iframe
                src={convertToEmbedUrl(note.link.trim())}
                className="w-full aspect-video mt-2 rounded-md"
                allowFullScreen
              />
            )}
  
            {note.drive && (
              <p className="text-blue-400 mt-2">
                <a href={note.drive} target="_blank" rel="noopener noreferrer">
                  View Google Drive Document
                </a>
              </p>
            )}
  
            {note.external && (
              <p className="text-blue-400 mt-2">
                <a href={note.external} target="_blank" rel="noopener noreferrer">
                  View External Link
                </a>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  
    <div className="col-span-4 border-emerald-900 border-2 rounded-xl p-6 h-[850px] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
        <Bot size={24} className="text-[#00FF9D]" />
        <span>Zed-Bot Study Assistant</span>
      </h2>
      <div className="h-[90%] flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.isAI ? 'bg-[#1E3A5F]' : 'bg-[#00FF9D] text-[#0A1929]'
                        }`}
                      >
                        <ReactMarkdown children={message.content} remarkPlugins={[remarkGfm]} />
                        <span className="text-xs opacity-70 mt-1 block">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                </div>
                  <form action={handleSubmit} className="flex space-x-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ask Zed-Bot..."
                    className="flex-1 bg-[#1E3A5F] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00FF9D]"
                  />
                  <button
                  type='submit'
                    onClick={handleSubmit}
                    className="bg-[#00FF9D] text-[#0A1929] p-2 rounded-lg"
                  >
                    <Send size={20} />
                  </button>
                  </form>
              </div>

    </div>
  </div>
  
  );
}
