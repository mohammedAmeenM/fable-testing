
import React, { useState, useRef, useEffect } from "react";
import { FaPen } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";

interface EpisodicBreakProps {
  id: number;
  title: string;
  episodeNumber: number;
  onEdit: (id: number, newTitle: string) => void;
  onDelete: (id: number) => void;
}

const EpisodicBreak: React.FC<EpisodicBreakProps> = ({
  id,
  title,
  episodeNumber,
  onEdit,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Extract the episode number part and the rest of the title
  const [episodeTitlePart, setEpisodeTitlePart] = useState(() => {
    // If the title starts with "Episode X", extract the rest
    const match = title.match(/^Episode\s+\d+\s*(.*)$/);
    return match ? match[1] : title;
  });
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // Combine the fixed episode number with the editable title part
  const getFullTitle = () => {
    const basePart = `Episode ${episodeNumber}`;
    return episodeTitlePart ? `${basePart} ${episodeTitlePart}` : basePart;
  };

  const handleSave = () => {
    onEdit(id, getFullTitle());
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="episodic-break w-full py-8 bg-[#EDEBEB] rounded-lg my-5 border-t-2 border-b-2 border-[#CBA757] relative">
      {isEditing ? (
        <div className="flex items-center justify-center w-full">
          <div className="flex items-center max-w-2xl w-full">
            {/* Fixed episode number part */}
            <span className="text-2xl font-bold text-black  rounded-l-md px-4 py-2 ">
              Episode {episodeNumber}
            </span>
            
            {/* Editable title part */}
            <input
              ref={inputRef}
              type="text"
              value={episodeTitlePart}
              onChange={(e) => setEpisodeTitlePart(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Title (optional)"
              className="text-2xl font-bold text-black bg-white border border-gray-300 rounded-r-md px-4 py-2 flex-1"
            />
          </div>
          
          <div className="flex ml-2">
            <button 
              onClick={handleSave}
              className="bg-[#656464] text-white rounded-md px-3 py-1 text-sm mr-1"
            >
              Save
            </button>
            <button 
              onClick={() => {
                // Reset to original title part
                const match = title.match(/^Episode\s+\d+\s*(.*)$/);
                setEpisodeTitlePart(match ? match[1] : title);
                setIsEditing(false);
              }}
              className="bg-[#D9D9D9] text-[#585757] rounded-md px-3 py-1 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <h2 className="text-2xl font-bold text-center text-black">{getFullTitle()}</h2>
          <div className="flex ml-3">
            <button 
              onClick={() => setIsEditing(true)} 
              className="ml-2 text-[#585757] p-1 rounded hover:bg-[#D9D9D9]"
              title="Edit episode title"
            >
              <FaPen size={14} />
            </button>
            <button 
              onClick={() => onDelete(id)} 
              className="ml-2 text-red-500 p-1 rounded hover:bg-[#D9D9D9]"
              title="Delete episode break"
            >
              <RxCross2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EpisodicBreak;