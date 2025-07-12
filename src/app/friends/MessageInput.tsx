import React, { useState } from 'react';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [value, setValue] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSend(value.trim());
      setValue('');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-2 border-t bg-white">
      <input
        type="text"
        className="flex-1 border rounded px-3 py-2"
        placeholder="Nhập tin nhắn..."
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={disabled}
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" disabled={disabled || !value.trim()}>Gửi</button>
    </form>
  );
} 