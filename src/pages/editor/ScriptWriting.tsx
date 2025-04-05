
const ScriptWriting:React.FC = () => {

      useEffect(() => {
        localStorage.setItem("title", title);
      }, [title]);
      
      const handleTitleChangee = (e:any) => {
        setTitle(e.target.value);
      };
  return (
    <div className="min-h-screen bg-gray-100">
    {/* Header - Responsive title input */}
    <div className="flex w-full justify-center p-4">
  <input 
    type="text" 
    className="text-2xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl font-medium bg-transparent outline-none w-full md:w-2/3 text-center border-b-4 border-black border-opacity-30 mb-6 py-2" 
    value={title}
    onChange={handleTitleChangee}
  />
</div>;

    <div className="flex flex-col ">
      {/* Sidebar Controls - Responsive positioning */}
      <div className="w-full  flex justify-center sticky top-5  z-50 ">
        <div className="flex justify-center w-[85%] lg:w-4/5 xl:w-[52%] 2xl:w-[45%]  border border-opacity-30  py-7 px-9 gap-4 bg-gray-100 border-black rounded-xl">
          {/* Scene Action Button */}

          <div className="flex flex-col w-1/3 2xl:w-1/3 space-y-4 ">
            <button className={`border border-black border-opacity-30 rounded-full px-4 py-2 ${
            selectedButton === "Description" 
              ? "bg-pink-100 text-black font-semibold" 
              : "bg-blue-200 text-black font-medium"
          }`}>Action</button>
            <p  className="text-center text-opacity-70 text-black">Press Keyboard Shift+Tab</p>
          </div>
{/* Add Character Button */}
          <div className="flex flex-col w-1/3 2xl:w-1/3  space-y-4 ">
            <button className={`border border-black border-opacity-30 rounded-full px-4 py-2 ${
            selectedButton === "Characters" 
              ? "bg-pink-100 text-black font-semibold" 
              : "bg-blue-200 text-black font-medium"
          }`}>Character</button>
            <p className="text-center text-opacity-70 text-black">Press Keyboard Tab</p>
          </div>

                   {/* Add Dialog Button */}
          <div className="flex flex-col w-1/3 2xl:w-1/3  space-y-4 ">
            <button className={`border border-black border-opacity-30 rounded-full px-4 py-2 ${
            selectedButton === "Dialog" 
              ? "bg-pink-100 text-black font-semibold" 
              : "bg-blue-200 text-black font-medium"
          }`}>Dialog</button>
            <p className="text-center text-opacity-70 text-black">Type Character & Press Enter</p>
          </div>

 
      
        </div>
      </div>
<div className="w-full flex justify-center">
      {/* Main Content Area - Responsive width and padding */}
      <div className="w-full  lg:w-4/5  px-4 md:px-8 lg:px-6 mt-4 lg:mt-7 flex flex-col space-y-8">
      {scenes.map((scene:any, sceneIndex:any) => (
          <div key={scene.id} className="w-full bg-white rounded-lg">
            {/* Scene Header */}
            <div className="w-full bg-pink-100 p-3 md:p-4 mb-6 rounded-md shadow-md">
              <div className="flex items-center gap-2 justify-between mb-3">
                <span className="text-xl md:text-2xl bg-gray-200 py-1 px-3 rounded-md">
                {sceneIndex + 1}
                </span>
                <input
                  type="text"
                  className="w-full bg-transparent text-xl md:text-xl lg:text-2xl xl:text-3xl 2xl:text-3xl font-medium outline-none"
                  value={scene.title}
                  onChange={(e) => handleTitleChange(scene.id, e.target.value)}
                />
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-200 rounded-full">
                    {scene.isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  {scenes.length > 1 && (
                <button
                  className="p-2 hover:bg-red-200 rounded-full text-red-500"
                  onClick={() => handleDeleteScene(sceneIndex)}
                >
                  <FaTrash />
                </button>
              )}
                </div>
              </div>

              {/* Characters Section */}
              <div className="mb-4 mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-xl md:text-xl font-medium">Characters:</span>
                {scene.characters.map((char:any, charIndex:any) => (
                  <span
                    key={charIndex}
                    className="text-lg md:text-lg lg:text-lg font-medium text-white bg-gray-400 px-4 py-2 rounded-xl flex items-center gap-2"
                  >
                    {char}
                    <button onClick={() => removeCharacter(sceneIndex, charIndex)} className="hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Scene Content */}
            {scene.content.map((content:any, contentIndex:any) => (
              <div key={contentIndex} className="mb-4">
                {/* Description */}
                {content.description !== undefined && (
                  <textarea
                    ref={(el:any) => (inputRefs.current[`scene-${sceneIndex}-description-${contentIndex}`] = el)}
                    className="w-full p-3 md:p-4 text-xl md:text-2xl outline-none resize-none"
                    value={content.description}
                    placeholder="Type Your Content Here...................."
                    onChange={(e) => handleContentChange(sceneIndex, contentIndex, "description", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, sceneIndex, contentIndex)}
                    onFocus={() => setSelectedButton("Description")}
                  />
                )}

                {/* Characters Input */}
                {content.characters !== undefined && (
                  <div className="w-full flex justify-center">
                    <input
                      ref={(el:any) => (inputRefs.current[`scene-${sceneIndex}-characters-${contentIndex}`] = el)}
                      type="text"
                      className="w-full md:w-1/2 text-xl md:text-3xl text-center p-2 outline-none"
                      placeholder="Type your characters..."
                      value={content.characters}
                      onChange={(e) => handleContentChange(sceneIndex, contentIndex, "characters", e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, sceneIndex, contentIndex)}
                      onFocus={() => setSelectedButton("Characters")}
                    />
                  </div>
                )}

                {/* Dialog */}
                {content.dialog !== undefined && (
                  <div className="w-full flex justify-center">
                    <textarea
                      ref={(el:any) => (inputRefs.current[`scene-${sceneIndex}-dialog-${contentIndex}`] = el)}
                      className="w-full md:w-3/5 text-xl md:text-2xl p-2 outline-none resize-none"
                      rows={2}
                      placeholder="Type your dialog..."
                      value={content.dialog}
                      onChange={(e) => handleContentChange(sceneIndex, contentIndex, "dialog", e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, sceneIndex, contentIndex)}
                      onInput={(e:any) => {
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                      onFocus={() => setSelectedButton("Dialog")}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        {/* Add Scene Button */}
        <div className="mt-4 flex justify-center pb-8">
          <button
            className="border flex  justify-center items-center gap-1  text-lg md:text-lg font-bold border-black border-opacity-30 hover:bg-gray-300 rounded-lg px-4 py-1 bg-white text-black"
            onClick={handleAddScene}
          >
            <span><MdOutlinePostAdd size={23}/></span>
            <span className="font-semibold mt-[6px] text-lg">New Scene</span>
          </button>
        </div>
      </div>
</div>


    </div>
  </div>
  )
}

export default ScriptWriting
