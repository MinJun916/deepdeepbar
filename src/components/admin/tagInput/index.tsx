'use client';

import { useRef, useState } from 'react';

type TagInputProps = {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
};

const TagInput = ({ tags, onChange, placeholder = '태그 입력 후 Enter' }: TagInputProps) => {
  const [input, setInput] = useState('');
  const ignoreNextEnterRef = useRef(false);

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag) {
      return;
    }

    if (tags.includes(tag)) {
      setInput('');
      return;
    }

    onChange([...tags, tag]);
    setInput('');
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((item) => item !== tag));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      if (event.key === 'Backspace' && !input && tags.length > 0) {
        onChange(tags.slice(0, -1));
      }
      return;
    }

    event.preventDefault();

    if (event.nativeEvent.isComposing) {
      return;
    }

    if (ignoreNextEnterRef.current) {
      ignoreNextEnterRef.current = false;
      return;
    }

    addTag(input);
  };

  const handleCompositionEnd = () => {
    ignoreNextEnterRef.current = true;
  };

  return (
    <div className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2">
      <p className="mb-2 text-xs font-medium text-[#6b7280]">태그</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full border border-[#e2d6c8] bg-[#f4ebdf] px-2.5 py-1 text-[11px] font-medium text-[#4b5563]"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-[#9ca3af] hover:text-[#4b5563]"
              aria-label={`${tag} 태그 삭제`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionEnd={handleCompositionEnd}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="min-w-[120px] flex-1 border-0 bg-transparent px-1 py-1 text-sm outline-none"
        />
      </div>
    </div>
  );
};

export default TagInput;
