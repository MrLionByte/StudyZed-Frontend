import {
  Youtube,
  FileIcon,
  Link,
  Plus,
  Send,
  Bot,
  LucideAArrowUp,
  LucideAArrowDown,
  Loader2,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
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
  const [history, setHistory] = useState([]);
  const [previousPrompts, setPreviousPrompts] = useState(new Set());

  const [expandedNote, setExpandedNote] = useState(null);
  const endOfMessagesRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const MAX_HISTORY_LENGTH = 10;

  const toggleDropdown = (noteId) => {
    setExpandedNote(expandedNote === noteId ? null : noteId);
  };

  const url = API_BASE_URLS['Session_Service'];
  const session = getSessionData();

  const limitMessagesToLatest = (messagesArray) => {
    if (messagesArray.length <= MAX_HISTORY_LENGTH * 2) return messagesArray; // Keep all if under limit (10 pairs = 20 messages)
    return messagesArray.slice(-MAX_HISTORY_LENGTH * 2); // Keep last 10 user-bot message pairs
  };

  const saveMessagesToSession = (updatedMessages) => {
    try {
      const sessionKey = session?.sessions?.session_code;
      if (sessionKey) {

        const limitedMessages = limitMessagesToLatest(updatedMessages);
        localStorage.setItem(`chat_history_${sessionKey}`, JSON.stringify(limitedMessages));
        
        const formattedHistory = limitedMessages.map(msg => ({
          role: msg.isAI ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));
        setHistory(formattedHistory);
      }
    } catch (error) {
      // console.error('Error saving messages to session:', error);
    }
  };

  const loadMessagesFromSession = () => {
    try {
      const sessionKey = session?.sessions?.session_code;
      if (sessionKey) {
        const savedMessages = localStorage.getItem(`chat_history_${sessionKey}`);
        if (savedMessages) {
          const parsedMessages = JSON.parse(savedMessages);
  
          const limitedMessages = limitMessagesToLatest(parsedMessages);
          setMessages(limitedMessages);
          
          const formattedHistory = limitedMessages.map(msg => ({
            role: msg.isAI ? 'model' : 'user',
            parts: [{ text: msg.content }]
          }));
          setHistory(formattedHistory);
          
          const userPrompts = new Set(
            limitedMessages
              .filter(msg => !msg.isAI)
              .map(msg => msg.content.trim().toLowerCase())
          );
          setPreviousPrompts(userPrompts);
        }
      }
    } catch (error) {
      // console.error('Error loading messages from session:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedPrompt = aiPrompt.trim();
    
    if (!trimmedPrompt) {
      const emptyPromptMessage = {
        id: Date.now(),
        isAI: true,
        content: 'Please enter a prompt.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, emptyPromptMessage]);
      setIsLoading(false);
      return;
    }

    if (previousPrompts.has(trimmedPrompt.toLowerCase())) {
      const duplicateMessage = {
        id: Date.now(),
        isAI: true,
        content: "I've already answered this question. Please try a different question or rephrase your query.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, duplicateMessage]);
      setAiPrompt("");
      return;
    }

    setIsLoading(true);

    const userMessage = {
      id: Date.now(),
      isAI: false,
      content: trimmedPrompt,
      timestamp: Date.now(),
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setPreviousPrompts(prev => new Set(prev).add(trimmedPrompt.toLowerCase()));
    saveMessagesToSession(updatedMessages);
    setAiPrompt("");
    
    try {
      const botResponse = await generateContent(trimmedPrompt, history);
      const botMessage = {
        id: Date.now(),
        isAI: true,
        content: botResponse,
        timestamp: Date.now(),
      };
      
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);
      saveMessagesToSession(finalMessages);
    } catch (err) {
      const errorMessage = {
        id: Date.now(),
        isAI: true,
        content: 'Failed to generate response. Please try again.',
        timestamp: Date.now(),
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveMessagesToSession(finalMessages);
    } finally {
      setIsLoading(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const getDataFromBackend = async () => {
    try {
      const response = await api.get('study-material/get-notes/', {
        baseURL: url,
        params: { session_key: session?.sessions?.session_code },
      });
      setNotes(response.data);
    } catch (err) {
      // console.error(err);
    }
  };

  useEffect(() => {
    if (fetchFromBackend) {
      getDataFromBackend();
      loadMessagesFromSession();
      setFetchFromBackend(false);
    }
  }, [fetchFromBackend]);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const convertToEmbedUrl = (url) => {
    if (!url) return url;
    
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    
    if (url.includes("watch?v=")) {
      let result = url.replace("watch?v=", "embed/");
      return result.replace("&t=", "?start=");
    }
    
    return url;
  };

  return (
    <div className="grid grid-cols-12 gap-4 max-h-full p-2">
      
      <div className="col-span-12 md:col-span-8 border-emerald-900 border-2 bg-[#051F1E] bg-opacity-40 rounded-xl p-3 md:p-6 h-[400px] md:h-[800px] overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 h-fit overflow-y-auto">
          {notes.map((note) => (
            <div key={note.id} className="student-card rounded-lg p-3 border border-emerald-900 bg-[#051F1E] bg-opacity-60">
              <h3 className="font-medium text-sm md:text-base">{note.title}</h3>
    
              <button
                onClick={() => toggleDropdown(note.id)}
                className="text-blue-400 underline mt-2 flex items-center text-xs md:text-sm"
                disabled={isLoading}
              >
                {expandedNote === note.id ? (
                  <>View Less <LucideAArrowUp className="ml-1 w-4 h-4" /></>
                ) : (
                  <>View More <LucideAArrowDown className="ml-1 w-4 h-4" /></>
                )}
              </button>
    
              {expandedNote === note.id && (
                <div className="mt-2 text-gray-300 text-xs md:text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.description}</ReactMarkdown>
                </div>
              )}
    
              <p className="break-words text-xs md:text-sm mt-2 text-gray-300">{note.link}</p>
    
              {note.type === 'youtube' && note.link && (
                <div className="mt-2 w-full aspect-video">
                  <iframe
                    src={convertToEmbedUrl(note.link.trim())}
                    className="w-full h-full rounded-md"
                    allowFullScreen
                  />
                </div>
              )}
    
              {note.drive && (
                <p className="text-blue-400 mt-2 text-xs md:text-sm">
                  <a 
                    href={note.drive} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={isLoading ? 'pointer-events-none opacity-50' : ''}
                  >
                    View Google Drive Document
                  </a>
                </p>
              )}
    
              {note.external && (
                <p className="text-blue-400 mt-2 text-xs md:text-sm">
                  <a 
                    href={note.external} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={isLoading ? 'pointer-events-none opacity-50' : ''}
                  >
                    View External Link
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    
      <div className="col-span-12 md:col-span-4 border-emerald-900 border-2 rounded-xl p-3 md:p-6 h-[400px] md:h-[800px] flex flex-col">
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-6 flex items-center space-x-2">
          <Bot size={20} className="text-[#00FF9D]" />
          <span>Zed-Bot Study Assistant</span>
        </h2>
        
        <div ref={chatContainerRef} className="flex-grow overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-emerald-900">
          <div className="space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-10">
                <p>Start a conversation with Zed-Bot</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[90%] p-2 md:p-3 rounded-lg text-xs md:text-sm ${
                    message.isAI ? 'bg-[#1E3A5F]' : 'bg-[#00FF9D] text-[#0A1929]'
                  }`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                  <span className="text-xs opacity-70 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[90%] p-3 rounded-lg bg-[#1E3A5F] flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span className="text-xs md:text-sm">Zed-Bot is thinking...</span>
                </div>
              </div>
            )}
            
            <div ref={endOfMessagesRef} />
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex space-x-2 mt-auto">
          <input
            ref={inputRef}
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder={isLoading ? "Thinking..." : "Ask Zed-Bot..."}
            disabled={isLoading}
            className="flex-1 bg-[#1E3A5F] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF9D]"
          />
          <button
            type='submit'
            disabled={isLoading || !aiPrompt.trim()}
            className={`bg-[#00FF9D] text-[#0A1929] p-2 rounded-lg ${
              isLoading || !aiPrompt.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={16} />}
          </button>
        </form>
      </div>
    </div>
  );
}