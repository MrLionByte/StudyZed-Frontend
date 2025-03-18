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
import { message } from 'antd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


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

  const [expandedNote, setExpandedNote] = useState(null);

  const toggleDropdown = (noteId) => {
    setExpandedNote(expandedNote === noteId ? null : noteId);
  };

  const url = API_BASE_URLS['Session_Service'];
  const session = getSessionData();

  const extractYouTubeId = (url) => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com.*(?:\/|v=|vi=|u\/\w\/|embed\/|watch\?v=))([^#&?]*).*/,
    );
    return match ? match[1] : '';
  };

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

  const convertToEmbedUrl = (url) => {
    if (!url.includes("watch?v=")) return url;
    let result = url.replace("watch?v=", "embed/");
    return result.replace("&t=", "?start=");
  };

  const addNote = async (type) => {
    if (!noteTitle.trim() || !noteDescription.trim()) {
      alert('Title and description are required.');
      return;
    }
    if (!session?.sessions?.session_code) {
      alert('Session code is missing!');
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
    console.log(newNote);

    try {
      const response = await api.post('study-material/add-notes/', newNote, {
        baseURL: url,
      });
      console.log(response);
      message.success('Notes have been added successfully');
      if (response.status === 201) {
        setNotes([response.data, ...notes]);
        setNoteTitle('');
        setNoteDescription('');
        setDriveLink('');
        setYoutubeLink('');
        setExternalLink('');
      }
    } catch (error) {
      console.error('Error saving note:', error);
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

  return (
    <div className="grid md:grid-cols-12 gap-6 max-h-full p-4">
      <div className="col-span-8 border-emerald-900
      border-2 bg-[#051F1E] bg-opacity-40 rounded-xl p-4 md:h-[820px] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Study Notes</h2>
          
          <button
            onClick={() => setCreateNote(!createNote)}
            className="p-2 rounded-lg bg-[#1E3A5F] hover:bg-[#2A4B75] transition-colors"
          >{createNote ? "Cancel " : "Create Note"}</button>
          
          <div className="flex space-x-2">
          {createNote &&
          <>
            <button
              onClick={() => handleExtraLink('youtube')}
              className="p-2 rounded-lg bg-[#1E3A5F] hover:bg-[#2A4B75] transition-colors"
              title="Add YouTube Video"
            >
              <Youtube size={20} />
            </button>
            <button
              onClick={() => handleExtraLink('drive')}
              className="p-2 rounded-lg bg-[#1E3A5F] hover:bg-[#2A4B75] transition-colors"
              title="Add YouTube Video"
            >
              <FileIcon size={20} />
            </button>
            <button
              onClick={() => handleExtraLink('link')}
              className="p-2 rounded-lg bg-[#1E3A5F] hover:bg-[#2A4B75] transition-colors"
              title="Add YouTube Video"
            >
              <Link size={20} />
            </button>
            </>
             }
             
          </div>
       
        </div>
      { createNote &&
        <div className="w-full bg-[#1E3A5F] rounded-lg px-4 py-3 space-y-3">
          <div className="flex gap-8">
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-[#3d5678] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00FF9D]"
            />
            <button
              onClick={addNote}
              className="bg-[#00FF9D] text-[#0A1929] px-2 
                        rounded-lg flex items-center font-semibold"
            >
              <Plus size={20} />
              <span>Add Note</span>
            </button>
          </div>

          <div className="flex items-center size-34 space-x-5">
            {youtubeLink && (
              <>
                <Link />
                <input
                  type="text"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  placeholder="Paste YouTube Link (Optional)"
                  className="w-full bg-[#3d5678] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00FF9D]"
                />
              </>
            )}
            {driveLink && (
              <>
                <Link />
                <input
                  type="text"
                  value={driveLink}
                  onChange={(e) => setDriveLink(e.target.value)}
                  placeholder="Google Drive Link (Optional)"
                  className="w-full text-white bg-[#3d5678] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00FF9D]"
                />
              </>
            )}
            {externalLink && (
              <>
                <Link />
                <input
                  type="text"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  placeholder="External Link (Optional)"
                  className="w-full bg-[#3d5678] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00FF9D]"
                />
              </>
            )}
          </div>

          <textarea
            value={noteDescription}
            onChange={(e) => setNoteDescription(e.target.value)}
            placeholder="Description"
            className="w-full bg-[#3d5678] rounded-lg px-4 py-2 
                        h-44 focus:outline-none focus:ring-2 focus:ring-[#00FF9D]"
          />
        </div>
            }

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4 h-fit overflow-y-auto">
  {notes.map((note) => (
    <div key={note.id} className="student-card rounded-lg p-4 max-w-sm md:max-w-full w-full">
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

      <div className="mt-2 space-y-2">
        <p className="break-words whitespace-normal">
          <a href={note.link} target="_blank" rel="noopener noreferrer" className="cursor-pointer underline">
            {note.link}
          </a>
        </p>

        {note.type === 'youtube' && (
          <iframe
            src={convertToEmbedUrl(note.link.trim())}
            className="w-full aspect-video rounded-md"
            allowFullScreen
          />
        )}

        {note.drive && (
          <p className="text-blue-400">
            <a href={note.drive} target="_blank" rel="noopener noreferrer">
              View Google Drive Document
            </a>
          </p>
        )}

        {note.external && (
          <p className="text-blue-400">
            <a href={note.external} target="_blank" rel="noopener noreferrer">
              View External Link
            </a>
          </p>
        )}
      </div>
    </div>
  ))}
</div>

      </div>

      <div className="col-span-8 md:col-span-4 bg-[#051F1E] border-emerald-900
      border-2 rounded-xl p-6 h-[650px] md:h-[820px] overflow-y-auto">
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
