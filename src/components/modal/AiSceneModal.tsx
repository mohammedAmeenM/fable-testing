import React, { useEffect } from "react";

const AiSceneModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  scene: any; 
  scenes: any; 
  setScenes: React.Dispatch<React.SetStateAction<any>>; 
}> = ({ isOpen, onClose, scene, scenes, setScenes }) => {

  const sceneUpdateRef = React.useRef(false);

  const handleSaveScene = () => {
    if (!scene || !scene.content) {
      console.error("No valid scene content to save");
      return;
    }

    const lastSceneIndex = scenes.length - 1;
    const lastScene = scenes[lastSceneIndex];

    // Create a deep copy of scenes to ensure React detects the change
    const updatedScenes = JSON.parse(JSON.stringify(scenes));

    if (lastScene.content.length === 1 && lastScene.content[0].description === '') {
      // Update the last scene with the new content
      updatedScenes[lastSceneIndex] = {
        ...lastScene,
        content: scene.content, // Assign the selected scene's content
        lastEdited: new Date().toLocaleDateString() + " " + 
                   new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + 
                   " by User"
      };
    } else {
      // Add a new scene with the AI-generated content
      const newScene = {
        id: scenes.length + 1,
        title: `Scene ${scenes.length + 1}`,
        location: scene.location || "Location",
        sceneType: scene.sceneType || "DAY/EXT",
        synopsis: scene.synopsis || "",
        content: scene.content,
        characters: scene.characters || [],
        lastEdited: new Date().toLocaleDateString() + " " + 
                    new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + 
                    " by User"
      };

      updatedScenes.push(newScene);
    }

    // Set the flag so we know we've updated scenes
    sceneUpdateRef.current = true;
    
    // Update scenes state with new array (ensuring immutability)
    setScenes(updatedScenes);
    
    // Close the modal
    onClose();
  };

  // Effect to ensure parent components re-render after scene update
useEffect(() => {
    if (sceneUpdateRef.current) {
      // Reset the flag
      sceneUpdateRef.current = false;
      
      // This is optional but can help ensure parent components detect the change
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('scenesUpdated'));
      }
    }
  }, [scenes]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-[#000000]/50 backdrop-blur-[1.5px] flex items-center justify-center z-50">
      <div className="bg-transparent max-w-[831px] w-full">
        <div className="w-full flex justify-end mb-3">
          <button
            className="text-black text-sm font-semibold bg-[#EDEDED] gap-1 border-[0.5px] px-2 py-2 border-[#FFFFFF4D] rounded-lg flex items-center justify-center"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="shadow-xl w-full">
          {/* Header Section */}
          <div className="flex justify-between w-full p-4 bg-[#EDEDED] rounded-t-lg text-[#000000]">
            <div className="flex flex-col">
              <p className="py-1 text-lg font-semibold">Scene Title as suggested by AI</p>
              <p className="text-sm text-[#444444] font-medium">Exploring idea further</p>
            </div>
            <div className="mt-3">
              <button className="bg-[#D9D9D9] shadow-[inset_0_4px_4px_0_rgba(0,0,0,0.25)] px-4 py-1 rounded-[15px]">
                AI Assist
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="text-black p-4 space-y-3 bg-white rounded-b-lg">
            {scene.content.map((item: any, index: any) => (
              <div key={index}>
                {item.description && (
                  <p className="text-gray-700 font-medium mb-4">{item.description}</p>
                )}
                {item.characters && (
                  <p className="font-semibold ml-2 inline-block px-2 bg-[#D9D9D9]/60">
                    {item.characters}
                  </p>
                )}
                {item.dialog && (
                  <p className="text-black ml-6 mb-6">➤ {item.dialog}</p>
                )}
                {item.parenthetical && (
                  <p className="text-gray-500 ml-6 italic">{item.parenthetical}</p>
                )}
              </div>
            ))}

            <div className="flex w-full justify-end">
              <button 
                onClick={handleSaveScene} 
                className="bg-[#D9D9D9] rounded-[10px] px-3 py-2 text-lg font-medium"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiSceneModal;
