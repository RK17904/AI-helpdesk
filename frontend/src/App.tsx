import { useState } from 'react';
import axios from 'axios';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/chat', {
        message: userMessage.text,
      });

      const aiMessage: Message = { sender: 'ai', text: response.data.reply };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error connecting to AI:", error);
      setMessages((prev) => [...prev, { sender: 'ai', text: "Sorry, I couldn't connect to the server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-[80vh]">
        
        <div className="bg-blue-600 text-white p-4 font-bold text-lg">
          Enterprise Knowledge Nexus (EKN) Support
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-gray-400 text-center mt-10">
              How can I help you today?
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 rounded-lg p-3 rounded-bl-none animate-pulse">
                Thinking...
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-100 border-t border-gray-200 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your issue here..."
            className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;