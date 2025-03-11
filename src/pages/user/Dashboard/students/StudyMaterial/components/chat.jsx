import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const PythonJourney = ({ content }) => {
  const formatContent = (text) => {
    // Basic formatting (you can enhance this with a markdown library)
    let formatted = text
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('**')) {
          if(line.includes("#")){
            let headerLevel = (line.match(/#/g) || []).length;
            let headerText = line.replace(/#/g,'').replace(/\*\*/g,'').trim();
            if(headerLevel == 1) return <h1 key={index} className="text-2xl font-bold mb-2">{headerText}</h1>;
            if(headerLevel == 2) return <h2 key={index} className="text-xl font-semibold mb-2">{headerText}</h2>;
            if(headerLevel == 3) return <h3 key={index} className="text-lg font-medium mb-2">{headerText}</h3>;
            return <p key={index}> {line.replace(/\*\*/g, '')}</p>
          }
          return <p key={index} className="font-semibold">{line.replace(/\*\*/g, '')}</p>;
        }
        if (line.startsWith('```python')) {
          const code = line.replace('```python', '').replace('```', '');
          return (
            <SyntaxHighlighter key={index} language="python" style={dracula}>
              {code}
            </SyntaxHighlighter>
          );
        }
        if(line.startsWith("* ")){
          return <li key={index} className="list-disc ml-6">{line.substring(2)}</li>
        }

        return <p key={index}>{line}</p>;
      });

    return <div>{formatted}</div>;
  };

  return (
    <div className="max-w-[80%] p-3 rounded-lg bg-[#1E3A5F] text-white">
      {formatContent(content)}
    </div>
  );
};

const ChatMessage = ({ message }) => (
  <div className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}>
    {message.isAI ? (
      <PythonJourney content={message.content} />
    ) : (
      <div className={`max-w-[80%] p-3 rounded-lg bg-[#00FF9D] text-[#0A1929]`}>
        <p>{message.content}</p>
      </div>
    )}
    <span className="text-xs opacity-70 mt-1 block">
      {new Date(message.timestamp).toLocaleTimeString()}
    </span>
  </div>
);

const ChatUI = ({ messages }) => (
  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
    {messages.map((message) => (
      <ChatMessage key={message.id} message={message} />
    ))}
  </div>
);

export default ChatUI;