import React, { useEffect, useState, useRef } from 'react';
import { Plus, Send, Bot, User } from 'lucide-react';
import useChatStore from '../store/chatStore';
import ReactMarkdown from 'react-markdown';

const Message = ({ role, content }) => {
    const isUser = role === 'user';
    return (
        <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
            { !isUser && <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0"><Bot className="w-4 h-4 text-white" /></div> }
            {/* The 'prose' class from Tailwind's typography plugin helps style markdown */}
            <div className={`prose prose-sm max-w-xl rounded-2xl p-3 shadow-sm ${isUser ? 'bg-blue-600 text-white prose-invert rounded-tr-sm' : 'bg-white border rounded-tl-sm'}`}>
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
            { isUser && <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0"><User className="w-4 h-4 text-gray-600" /></div> }
        </div>
    );
};

const GeminiClonePage = () => {
  const [prompt, setPrompt] = useState('');
  const { chatList, activeChat, isResponseLoading, fetchChatList, fetchChatHistory, sendMessage, createNewChat } = useChatStore();
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchChatList();
  }, [fetchChatList]);

  useEffect(() => {
    // Scroll to the bottom of the chat window when new messages are added
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.history, isResponseLoading]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!prompt.trim() || isResponseLoading) return;
    sendMessage(prompt);
    setPrompt('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6 h-[calc(100vh-8.5rem)]">
      {/* Left Panel: Chat History */}
      <div className="bg-white rounded-xl shadow-sm border p-4 flex-col hidden lg:flex">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800">Chats</h3>
          <button onClick={createNewChat} className="bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"><Plus size={14}/> New Chat</button>
        </div>
        <div className="space-y-1 flex-1 overflow-y-auto -mr-2 pr-2">
            {chatList.map(chat => (
                <button 
                  key={chat._id} 
                  onClick={() => fetchChatHistory(chat._id)} 
                  className={`w-full text-left rounded-lg text-sm px-3 py-2 transition-colors truncate ${activeChat?._id === chat._id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                    {chat.title}
                </button>
            ))}
        </div>
      </div>

      {/* Right Panel: Chat Window */}
      <div className="bg-white rounded-xl shadow-sm border flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {!activeChat && !isResponseLoading && (
                 <div className="text-center h-full flex flex-col justify-center items-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Bot className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Skill Matrix AI Assistant</h3>
                    <p className="text-gray-600 max-w-md mx-auto mt-2">How can I help you today?</p>
                </div>
            )}
            {activeChat?.history.map((msg, index) => <Message key={index} role={msg.role} content={msg.parts} />)}
            {isResponseLoading && (
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0"><Bot className="w-4 h-4 text-white" /></div>
                    <div className="max-w-xl rounded-2xl p-3 shadow-sm bg-white border rounded-tl-sm">
                        <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 bg-gray-300 rounded-full animate-pulse delay-75"></span>
                            <span className="h-2 w-2 bg-gray-300 rounded-full animate-pulse delay-150"></span>
                            <span className="h-2 w-2 bg-gray-300 rounded-full animate-pulse delay-300"></span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t bg-white rounded-b-xl">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3 rounded-xl border-2 border-gray-200 p-2 focus-within:border-blue-500 transition-colors">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSendMessage(e); }}
                placeholder="Ask me anything..."
                rows="1"
                className="w-full flex-1 resize-none bg-transparent focus:outline-none p-1 text-sm"
            />
            <button type="submit" disabled={isResponseLoading} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-400 transition-colors">
                <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GeminiClonePage;