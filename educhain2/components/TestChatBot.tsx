import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from '../constants';

const TestChatBot: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testAPI = async () => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
      console.log('API Key:', GEMINI_API_KEY ? 'Có' : 'Không có');
      
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const result = await model.generateContent(input || "Xin chào, bạn là ai?");
      const text = result.response.text();
      
      setResponse(text);
      console.log('Success:', text);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test Gemini API</h1>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          API Key: {GEMINI_API_KEY ? '✅ Đã cấu hình' : '❌ Chưa có'}
        </p>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập câu hỏi..."
          className="w-full p-3 border rounded-lg"
        />
      </div>

      <button
        onClick={testAPI}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
      >
        {loading ? 'Đang gửi...' : 'Test API'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg">
          <strong>Lỗi:</strong> {error}
        </div>
      )}

      {response && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
          <strong>Phản hồi:</strong>
          <p className="mt-2">{response}</p>
        </div>
      )}
    </div>
  );
};

export default TestChatBot;
