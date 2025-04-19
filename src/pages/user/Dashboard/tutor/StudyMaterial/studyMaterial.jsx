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
import { message } from 'antd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import LogoSvg from '../../../../../assets/test.svg';
import { toast,ToastContainer } from 'react-toastify';

export default function StudyMaterial() {
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteDescription, setNoteDescription] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [messages, setMessages] = useState([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [fetchFromBackend, setFetchFromBackend] = useState(true);
  const [createNote, setCreateNote] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [previousPrompts, setPreviousPrompts] = useState(new Set());
  const [loading, setLoading] = useState(false);

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
    if (messagesArray.length <= MAX_HISTORY_LENGTH * 2) return messagesArray;
    return messagesArray.slice(-MAX_HISTORY_LENGTH * 2);
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
    setLoading(true)
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
      toast.error('Error getting old prompts, start as new');
    } finally{
      setLoading(false)
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

  const addNote = async () => {
    if (!noteTitle.trim() || !noteDescription.trim()) {
      message.error('Title and description are required.');
      return;
    }
    if (!session?.sessions?.session_code) {
      message.error('Session code is missing!');
      return;
    }

    let type_choose = 'link';
    if (driveLink.length > 1) {
      type_choose = 'drive';
    } else if (youtubeLink.length > 1) {
      type_choose = 'youtube';
    }

    let newNote = {
      session_key: session?.sessions?.session_code,
      type: type_choose,
      link: driveLink || youtubeLink || externalLink || '',
      title: noteTitle,
      description: noteDescription,
    };

    try {
      const response = await api.post('study-material/add-notes/', newNote, {
        baseURL: url,
      });
      message.success('Notes have been added successfully');
      if (response.status === 201) {
        setNotes([response.data, ...notes]);
        setNoteTitle('');
        setNoteDescription('');
        setDriveLink('');
        setYoutubeLink('');
        setExternalLink('');
        setCreateNote(false);
      }
    } catch (error) {
      message.error('Failed to save note. Please try again.');
    }
  };

  const handleExtraLink = (type) => {
    if (type === 'link') {
      setExternalLink((prev) => (prev === '' ? ' ' : ''));
    } else if (type === 'youtube') {
      setYoutubeLink((prev) => (prev === '' ? ' ' : ''));
    } else if (type === 'drive') {
      setDriveLink((prev) => (prev === '' ? ' ' : ''));
    }
  };

  const getDataFromBackend = async () => {
    setLoading(true)
    try {
      const response = await api.get('study-material/get-notes/', {
        baseURL: url,
        params: { session_key: session?.sessions?.session_code },
      });

      setNotes(response.data);
    } catch (err) {
      // console.error(err);
    } finally{
      setLoading(false)
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
    <div className="grid grid-cols-12 gap-4 max-h-full p-2 md:p-4">

      <div className="col-span-12 md:col-span-8 border-emerald-900 border-2 bg-[#051F1E] bg-opacity-40 rounded-xl p-3 md:p-4 h-[400px] md:h-[820px] overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 md:mb-6 space-y-2 md:space-y-0">
          <h2 className="text-lg md:text-xl font-semibold">Study Notes</h2>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => setCreateNote(!createNote)}
              className="py-1 px-2 md:py-2 md:px-3 rounded-lg bg-[#1E3A5F] hover:bg-[#2A4B75] transition-colors text-sm md:text-base flex-shrink-0"
            >
              {createNote ? "Cancel" : "Create Note"}
            </button>
            
            {createNote && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleExtraLink('youtube')}
                  className="p-1 md:p-2 rounded-lg bg-[#1E3A5F] hover:bg-[#2A4B75] transition-colors"
                  title="Add YouTube Video"
                >
                  <Youtube size={16} className="md:w-5 md:h-5" />
                </button>
                <button
                  onClick={() => handleExtraLink('drive')}
                  className="p-1 md:p-2 rounded-lg bg-[#1E3A5F] hover:bg-[#2A4B75] transition-colors"
                  title="Add Google Drive Document"
                >
                  <FileIcon size={16} className="md:w-5 md:h-5" />
                </button>
                <button
                  onClick={() => handleExtraLink('link')}
                  className="p-1 md:p-2 rounded-lg bg-[#1E3A5F] hover:bg-[#2A4B75] transition-colors"
                  title="Add External Link"
                >
                  <Link size={16} className="md:w-5 md:h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {createNote && (
          <div className="w-full bg-[#1E3A5F] rounded-lg px-3 py-3 space-y-3 mb-4">
            <div className="flex flex-col md:flex-row gap-2 md:gap-4">
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Title"
                className="w-full bg-[#3d5678] rounded-lg px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#00FF9D]"
              />
              <button
                onClick={addNote}
                className="bg-[#00FF9D] text-[#0A1929] px-2 py-1 rounded-lg flex items-center justify-center font-semibold text-sm md:text-base"
              >
                <Plus size={16} className="md:w-5 md:h-5 mr-1" />
                <span>Add Note</span>
              </button>
            </div>

            <div className="space-y-2">
              {youtubeLink && (
                <div className="flex items-center space-x-2">
                  <Youtube size={16} className="md:w-5 md:h-5 flex-shrink-0" />
                  <input
                    type="text"
                    value={youtubeLink}
                    onChange={(e) => setYoutubeLink(e.target.value)}
                    placeholder="Paste YouTube Link (Optional)"
                    className="w-full bg-[#3d5678] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF9D]"
                  />
                </div>
              )}
              
              {driveLink && (
                <div className="flex items-center space-x-2">
                  <FileIcon size={16} className="md:w-5 md:h-5 flex-shrink-0" />
                  <input
                    type="text"
                    value={driveLink}
                    onChange={(e) => setDriveLink(e.target.value)}
                    placeholder="Google Drive Link (Optional)"
                    className="w-full text-white bg-[#3d5678] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF9D]"
                  />
                </div>
              )}
              
              {externalLink && (
                <div className="flex items-center space-x-2">
                  <Link size={16} className="md:w-5 md:h-5 flex-shrink-0" />
                  <input
                    type="text"
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                    placeholder="External Link (Optional)"
                    className="w-full bg-[#3d5678] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF9D]"
                  />
                </div>
              )}
            </div>

            <textarea
              value={noteDescription}
              onChange={(e) => setNoteDescription(e.target.value)}
              placeholder="Description"
              className="w-full bg-[#3d5678] rounded-lg px-3 py-2 text-sm 
                        h-20 md:h-32 focus:outline-none focus:ring-2 focus:ring-[#00FF9D]"
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-2 h-fit overflow-y-auto">
          {notes.length === 0 ? (
            <div className="col-span-full text-center py-6 text-gray-400">
              <p>No study notes available. Create your first note!</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="student-card rounded-lg p-3 border border-emerald-900 bg-[#051F1E] bg-opacity-60">
                <h3 className="font-medium text-sm md:text-base">{note.title}</h3>
        
                <button
                  onClick={() => toggleDropdown(note.id)}
                  className="text-blue-400 underline mt-2 flex items-center text-xs md:text-sm"
                  disabled={isLoading}
                >
                  {expandedNote === note.id ? (
                    <>View Less <LucideAArrowUp className="ml-1 w-3 h-3 md:w-4 md:h-4" /></>
                  ) : (
                    <>View More <LucideAArrowDown className="ml-1 w-3 h-3 md:w-4 md:h-4" /></>
                  )}
                </button>
        
                {expandedNote === note.id && (
                  <div className="mt-2 text-gray-300 text-xs md:text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.description}</ReactMarkdown>
                  </div>
                )}
        
                {note.link && (
                  <p className="break-words whitespace-normal text-xs md:text-sm mt-2 text-gray-300">
                    <a 
                      href={note.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="cursor-pointer underline text-blue-400"
                    >
                      {note.link.length > 40 ? `${note.link.substring(0, 40)}...` : note.link}
                    </a>
                  </p>
                )}
        
                {note.type === 'youtube' && note.link && (
                  <div className="mt-2 w-full aspect-video">
                    <iframe
                      src={convertToEmbedUrl(note.link.trim())}
                      className="w-full h-full rounded-md"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="col-span-12 md:col-span-4 border-emerald-900 border-2 bg-[#051F1E] bg-opacity-40 rounded-xl p-3 md:p-4 h-[400px] md:h-[820px] flex flex-col">
        <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center space-x-2">
          <Bot size={20} className="text-[#00FF9D]" />
          <span>Zed-Bot Study Assistant</span>
        </h2>
        
        <div 
          ref={chatContainerRef} 
          className="flex-grow overflow-y-auto mb-3 md:mb-4 scrollbar-thin scrollbar-thumb-emerald-900"
        >
          <div className="space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-6 md:mt-10">
                <p className="text-sm md:text-base">Start a conversation with Zed-Bot</p>
                <p className="text-xs md:text-sm mt-2">Ask questions about study materials or get assistance with learning topics.</p>
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
                  <span className="text-[10px] md:text-xs opacity-70 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[90%] p-2 md:p-3 rounded-lg bg-[#1E3A5F] flex items-center">
                  <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin mr-2" />
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
            className="flex-1 bg-[#1E3A5F] rounded-lg px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#00FF9D]"
          />
          <button
            type="submit"
            disabled={isLoading || !aiPrompt.trim()}
            className={`bg-[#00FF9D] text-[#0A1929] p-2 rounded-lg flex-shrink-0 ${
              isLoading || !aiPrompt.trim() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" /> : <Send size={16} />}
          </button>
        </form>
      </div>

      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="toast-center"
      />
      
    </div>
  );
}