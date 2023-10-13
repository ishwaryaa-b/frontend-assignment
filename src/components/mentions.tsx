import React, { useEffect, useRef, useState } from 'react';
import data from '../assets/data.json';

const MentionsComponent: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [mentionOptions, setMentionOptions] = useState<string[]>([]);
  const [mentionStart, setMentionStart] = useState<number>(-1); // Track the start position of the mention
  const [selectedOption, setSelectedOption] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputText(text);

    // Detect '@' symbol and populate mention options
    if (text.includes('@')) {
      const searchTerm = text.split('@').pop();
      const filteredOptions = data.filter((option) =>
        option.toLowerCase().includes(searchTerm?.toLowerCase() || '')
      );
      setMentionOptions(filteredOptions);
      setMentionStart(text.lastIndexOf('@') + 1); // Track the start position
    } else {
      setMentionOptions([]);
      setMentionStart(-1); // Reset the start position
    }
  };

  const handleSelectOption = (option: string) => {
    // Replace the mention with the selected option
    if (mentionStart >= 0) {
      const updatedText =
        inputText.slice(0, mentionStart) +
        option +
        ' ' +
        inputText.slice(mentionStart + selectedOption.length);
      setInputText(updatedText);
    }

    // Clear mention options and selected option
    setMentionOptions([]);
    setSelectedOption('');
    setMentionStart(-1);
    setSelectedOption(option);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  useEffect(() => {
    // Focus on the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div>
      <input
        type="text"
        ref={inputRef}
        className="text-black w-full"
        value={inputText}
        onChange={handleInputChange}
        placeholder="Type your message..."
      />
      <div>
        {mentionOptions.length > 0 && (
          <div className="options">
            {mentionOptions.map((option, index) => (
              <div
                className="mention-options"
                key={index}
                onClick={() => handleSelectOption(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentionsComponent;
