import { Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatSkeleton from '../../components/chatSkelton';
import { useStudentMessaging } from './_lib';

export default function StudentMessaging() {
  const {
    connected,
    error,
    messages,
    input,
    student,
    loading,
    lastMessageRef,
    setInput,
    sendMessage,
    handleKeyPress,
  } = useStudentMessaging();

  return (
    <div className="flex w-full justify-center mt-5 items-center bg-transparent ">
      <div className="flex flex-col h-[550px] md:h-[800px] w-full max-w-7xl mx-auto rounded-3xl overflow-hidden">
        <div className="flex items-center p-3 bg-[#2f726d] text-white">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#e0eaff] rounded-full flex items-center justify-center text-[#5682a3] font-bold">
              T
            </div>
            <div>
              <h2 className="font-semibold">TUTOR</h2>
              <p className="text-xs opacity-80">
                {connected ? 'online' : 'last seen recently'}
              </p>
            </div>
          </div>

          <div className="ml-auto flex space-x-1">
            {/* <Button variant="ghost" size="icon" className="text-white hover:bg-[#4a729a]">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-[#4a729a]">
            <VideoIcon className="h-4 w-4" />
          </Button> */}
            {/* <Button variant="ghost" size="icon" className="text-white hover:bg-[#4a729a]">
            <MoreVertical className="h-4 w-4" />
          </Button> */}
          </div>
        </div>

        <ScrollArea className="flex-1 p-4 bg-gray-400/20 text-[#AEBAC1]">
          <div className="space-y-2 text-black opacity-75 ">
            {loading ? (
              <ChatSkeleton />
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.sender === student.user_code ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === student.user_code
                          ? 'bg-[#effdde]'
                          : 'bg-white'
                      }`}
                    >
                      <p className="break-word text-[15px]">
                        {message.content || message.message}
                      </p>
                      <div className="flex justify-end items-center mt-1">
                        <span className="text-[11px] text-gray-500">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {message.sender === student.user_code && (
                          <span className="ml-1 text-[#5fd467]">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            <div ref={lastMessageRef} className="h-0" />
          </div>
        </ScrollArea>

        <div className="p-3 bg-[#2a6965] border-t">
          <div className="flex items-center space-x-2">
            {/* <Button variant="ghost" size="icon" className="text-gray-500">
            <Paperclip className="h-5 w-5" />
          </Button> */}
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message"
              className="rounded-full flex-1 border-none text-black bg-white"
            />
            <Button
              onClick={sendMessage}
              size="icon"
              disabled={!connected || !input.trim()}
              className="bg-[#5682a3] text-white hover:bg-[#4a729a] rounded-full h-10 w-10"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">*</p>}
        </div>
      </div>
    </div>
  );
}
