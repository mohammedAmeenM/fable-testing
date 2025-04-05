


const ScriptWritingSession: React.FC<Props> = ({ scene,updateLocation, updateSynopsis, updateContent ,updateCharacters,scenes,setScenes,projectId })=> {


  useEffect(() => {
    setSceneContent(scene.content || [{ description: "" }]);
  }, [scene]);
  
  useEffect(() => {
    console.log("Scene content updated:", sceneContent);
    handleClearAi()
  }, [sceneContent]);

  // Initialize content with description if empty
  useEffect(() => {
    const initialContent = scene.content && scene.content.length > 0 
      ? scene.content 
      : [{description: ""}];
    
    setSceneContent(initialContent);
    setNextScene([])
  }, [scene.id]);

  // Focus first description input when the session loads
  useEffect(() => {
    setTimeout(() => {
      const firstDescInput = inputRefs.current[`scene-${scene.id}-description-0`];
      if (firstDescInput) {
        firstDescInput.focus();
      }
    }, 100);
  }, [scene.id]);

  // Adjust textareas height
  useEffect(() => {
    if (synopsisRef.current) {
      adjustTextareaHeight(synopsisRef.current);
    }
    
    // Adjust height for all textareas
    Object.values(inputRefs.current).forEach((element: any) => {
      if (element && element.tagName.toLowerCase() === 'textarea') {
        adjustTextareaHeight(element);
      }
    });
  }, [scene.synopsis, sceneContent]);

  const adjustTextareaHeight = (textarea: any) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;

  };
  
  const handleSynopsisChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSynopsis(e.target.value);
    adjustTextareaHeight(e.target);
  };
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateLocation(e.target.value);
  };
  
  const handleContentChange = (contentIndex: number, field: string, value: string) => {
    const updatedContent = [...sceneContent];
    
    
    updatedContent[contentIndex] = {
      ...updatedContent[contentIndex],
      [field]: value
    };
    
    setSceneContent(updatedContent);
    updateContent(updatedContent);
  
    // Adjust height after content change
    setTimeout(() => {
      const textarea = inputRefs.current[`scene-${scene.id}-${field}-${contentIndex}`];
      if (textarea && textarea.tagName.toLowerCase() === 'textarea') {
        adjustTextareaHeight(textarea as HTMLTextAreaElement);
      }
    }, 0);
  };

    // Comment section handlers
    const toggleCommentSection = () => {
      setIsCommentSectionOpen(!isCommentSectionOpen);
    };
  
    const handleCommentInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNewComment(e.target.value);
      if (commentInputRef.current) {
        adjustTextareaHeight(commentInputRef.current);
      }
    };
  
    const handleAddComment = async () => {
      if (!newComment.trim()) return;
      
      try {
        const commentData = {
          projectTitleId: projectId,
          userId: userId,
          sceneId: scene.sceneId,
          content: newComment,
        };
        
        // Make API call to create comment
        const response = await createComment(commentData);
        console.log(response, 'comment response');
        
        // If you get the full comment object back from the API, use it
        // Otherwise create a temporary one
        const commentFromApi = response?.data?.data;
        
        const newCommentObj = {
          id: commentFromApi?._id || Date.now().toString(),
          text: newComment,
          author: commentFromApi?.authorName || "You",
          timestamp: new Date().toLocaleString(),
          avatar: 'https://i.pinimg.com/564x/a9/84/97/a984975ea4053921c7983f0213840890.jpg',
          userId: userId
        };
        
        // Update the scene directly in the scenes array
        const updatedScenes = scenes.map((s: any) => {
          if (s.id === scene.id) {
            return {
              ...s,
              comments: [...(s.comments || []), newCommentObj]
            };
          }
          return s;
        });
        
        // Update scenes state (this will eliminate need for separate comments state)
        setScenes(updatedScenes);
        
        // Clear input
        setNewComment("");
        
        // Reset textarea height
        if (commentInputRef.current) {
          commentInputRef.current.style.height = 'auto';
        }
      } catch (error) {
        console.error(error, 'error comment');
      }
    };
  
    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleAddComment();
      }
    };
  

    const handleDeleteComment = async (commentId: string) => {
      try {
        // Call API to delete the comment
        const response = await deleteComment(commentId);
        console.log('Delete comment response:', response);
        
        // If API call is successful, update the UI
        if (response && response.status === 200) {
          // Update scenes state directly without using separate comments state
          const updatedScenes = scenes.map((s: any) => {
            if (s.id === scene.id) {
              return {
                ...s,
                comments: s.comments.filter((comment: any) => comment.id !== commentId)
              };
            }
            return s;
          });
          
          setScenes(updatedScenes);
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
        // You might want to show an error message to the user
      }
    };

  
  const handleButtonClick = (buttonName: string) => {
    setSelectedButton(buttonName);
    
    // Get the active element to insert content after current position
    const activeElement = document.activeElement;
    let activeContentIndex = -1;
    
    Object.keys(inputRefs.current).forEach((key) => {
      if (inputRefs.current[key] === activeElement) {
        const match = key.match(/scene-\d+-\w+-(\d+)/);
        if (match) {
          activeContentIndex = parseInt(match[1]);
        }
      }
    });
    
    // If no active element found, add to the end
    if (activeContentIndex === -1) {
      activeContentIndex = sceneContent.length - 1;
    }
    
    let newContent: SceneContent = {};
    
    if (buttonName === "Dialog") {
      newContent = { dialog: "" };
    } else if (buttonName === "Character") {
      newContent = { characters: "" };
    } else if (buttonName === "Action") {
      newContent = { description: "" };
    }
     else if (buttonName === "Parenthetical") {
      newContent = { parenthetical: "(    )" };
    }
    
    // Insert new content
    const updatedContent = [...sceneContent];
    updatedContent.splice(activeContentIndex + 1, 0, newContent);
    setSceneContent(updatedContent);
    updateContent(updatedContent);
    
    // Focus the newly created element
    setTimeout(() => {
      const field = Object.keys(newContent)[0];
      const newElement = inputRefs.current[`scene-${scene.id}-${field}-${activeContentIndex + 1}`];
      if (newElement) {
        newElement.focus();
      }
      if(field==="parenthetical"){
        return newElement.setSelectionRange(3, 3);
      }
    }, 0);
  };
  
  const handleKeyDown = (event: React.KeyboardEvent, contentIndex: number) => {
    const input = event.currentTarget;
    const field = Object.keys(sceneContent[contentIndex]).find(
      key => sceneContent[contentIndex][key as keyof SceneContent] !== undefined
    ) as keyof SceneContent;
  
    if (field === "parenthetical") {
      const value = (input as HTMLTextAreaElement).value;
      const selStart = (input as HTMLTextAreaElement).selectionStart;
      const selEnd = (input as HTMLTextAreaElement).selectionEnd;
  
      // Handle Backspace when value is `()` and cursor is between them
      if (event.key === "Backspace" && value === "()" && selStart === 1 && selEnd === 1) {
        event.preventDefault();
  
        // Remove the entire parenthetical block
        const updatedContent = sceneContent.filter((_, index) => index !== contentIndex);
        setSceneContent(updatedContent);
        updateContent(updatedContent);
  
        // Focus on the previous input
        setTimeout(() => {
          if (contentIndex > 0) {
            const prevIndex = contentIndex - 1;
            const prevField = Object.keys(updatedContent[prevIndex])[0];
            const prevInput = inputRefs.current[`scene-${scene.id}-${prevField}-${prevIndex}`];
  
            if (prevInput) {
              prevInput.focus();
              if (prevInput.tagName.toLowerCase() === "textarea") {
                (prevInput as HTMLTextAreaElement).setSelectionRange(
                  (prevInput as HTMLTextAreaElement).value.length,
                  (prevInput as HTMLTextAreaElement).value.length
                );
              }
            }
          }
        }, 0);
  
        return;
      }
    }
    // Handle Backspace on empty input
    if (
      event.key === "Backspace" &&
      ((input.tagName === "TEXTAREA" && (input as HTMLTextAreaElement).value === "") ||
        (input.tagName === "INPUT" && (input as HTMLInputElement).value === ""))
    ) {
      if (sceneContent.length === 1) {
        return; // Don't delete if it's the only content
      }
  
      event.preventDefault();
  
      // Remove the current content
      const updatedContent = sceneContent.filter((_, index) => index !== contentIndex);
      setSceneContent(updatedContent);
      updateContent(updatedContent);
  
      // Focus previous input
      setTimeout(() => {
        const prevIndex = contentIndex > 0 ? contentIndex - 1 : 0;
        const prevField = Object.keys(updatedContent[prevIndex])[0];
        const prevInput = inputRefs.current[`scene-${scene.id}-${prevField}-${prevIndex}`];
  
        if (prevInput) {
          prevInput.focus();
          if (prevInput.tagName.toLowerCase() === "textarea") {
            (prevInput as HTMLTextAreaElement).setSelectionRange(
              (prevInput as HTMLTextAreaElement).value.length,
              (prevInput as HTMLTextAreaElement).value.length
            );
          }
        }
      }, 0);
    }
    // Tab or Enter key pressed
    else if (event.key === "Tab" && !event.shiftKey) {
      // For description -> create character
      if (field === "description") {
        event.preventDefault();
        
        setSelectedButton("Character");
        const newContent = [...sceneContent];
        newContent.splice(contentIndex + 1, 0, { characters: "" });
        setSceneContent(newContent);
        updateContent(newContent);
        
        setTimeout(() => {
          const charInput = inputRefs.current[`scene-${scene.id}-characters-${contentIndex + 1}`];
          if (charInput) {
            charInput.focus();
          }
        }, 50);
      }
     
    }
    else if(((field === "characters"||field==="parenthetical")&& (event.key === "Enter" && !event.shiftKey))){
      event.preventDefault();
          // Add the character to the scene's characters array when Enter is pressed
    const characterName = sceneContent[contentIndex].characters?.trim();
    if (characterName) {
      updateCharacters(characterName);
    }
      setSelectedButton("Dialog");
      const newContent = [...sceneContent];
      newContent.splice(contentIndex + 1, 0, { dialog: "" });
      setSceneContent(newContent);
      
      updateContent(newContent);
      
      setTimeout(() => {
        const dialogInput = inputRefs.current[`scene-${scene.id}-dialog-${contentIndex + 1}`];
        if (dialogInput) {
          dialogInput.focus();
        }
      }, 50);
    } else if((field === "dialog"&& (event.key === "Enter" && !event.shiftKey))){
      event.preventDefault();
        
      setSelectedButton("Character");
      const newContent = [...sceneContent];
      newContent.splice(contentIndex + 1, 0, { characters: "" });
      setSceneContent(newContent);
      updateContent(newContent);
      
      setTimeout(() => {
        const charInput = inputRefs.current[`scene-${scene.id}-characters-${contentIndex + 1}`];
        if (charInput) {
          charInput.focus();
        }
      }, 50);
    }else if ((field === "dialog" || field === "characters") && (event.key === "Tab" && event.shiftKey)) {
      event.preventDefault();
      
      setSelectedButton("Action");
      const newContent = [...sceneContent];
      newContent.splice(contentIndex + 1, 0, { description: "" });
      setSceneContent(newContent);
      updateContent(newContent);
      
      setTimeout(() => {
        const descInput = inputRefs.current[`scene-${scene.id}-description-${contentIndex + 1}`];
        if (descInput) {
          descInput.focus();
        }
      }, 50);
    }else if (event.ctrlKey && (event.key === "`" || event.key==="~")) {
      event.preventDefault();
      
      setSelectedButton("Parenthetical");
      const newContent = [...sceneContent];
      newContent.splice(contentIndex + 1, 0, { parenthetical: "(    )" });
      setSceneContent(newContent);
      updateContent(newContent);
      
      setTimeout(() => {
        const parentheticalInput = inputRefs.current[`scene-${scene.id}-parenthetical-${contentIndex + 1}`];
        if (parentheticalInput) {
          parentheticalInput.focus();
          // Position cursor between the parentheses
          parentheticalInput.setSelectionRange(3, 3);
        }
      }, 50);
    }
  };
  const handleClearAi =()=>{
    setNextSceneAi([])
    setAiButton([])
  }

  const [nextScene, setNextScene] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCreateNextScene = async (sceneId: any) => {
    setNextSceneAi([sceneId]); 
    setLoading(true); // Start loading
  
    const lastThreeScenesContent = scenes.slice(-3).map((scene: any) => scene.content);
  
    try {
      const response = await api.post('/openai/generate-script', {
        user_prompt: lastThreeScenesContent,
      });
  
      console.log('Loading...');
  
      if (response.data) {
        console.log('Generated Scenes:', response.data.response);
        setNextScene(response.data.response);
      }
    } catch (error) {
      console.error('Error generating next scene:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex ">
      <div  className="w-full flex flex-col bg-[#1E1E1E] px-5 pt-6 pb-7 rounded-b-[10px]">
      <div className="bg-[#EDEBEB] text-black px-4 sm:px-6 md:px-10 py-7 rounded-[10px] space-y-3">
        <div>
          {/* Top row with textarea and location/edit buttons */}
          <div className="flex flex-col lg:flex-row justify-between gap-5">
            {/*Synopsis*/}
            <div className="w-full max-w-full lg:max-w-[750px]">
              <textarea
                ref={synopsisRef}
                placeholder="Enter your synopsis"
                value={scene.synopsis || ""}
                className="text-[16px] font-medium bg-transparent focus:outline-none w-full resize-none overflow-hidden"
                onChange={handleSynopsisChange}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 h-fit">
              <button className="border border-[#656464] bg-[#D9D9D9] text-[#585757] text-[14px] font-medium flex items-center gap-1 px-2 py-1 tracking-widest">
                <MdLocationOn />
                <input 
                  type="text" 
                  value={scene.location} 
                  className="bg-transparent outline-none w-[230px]"
                  onChange={handleLocationChange}
                  onBlur={handleLocationChange}
                />
              </button>

              <button className="border border-[#656464] bg-[#D9D9D9] text-[#585757] text-[14px] font-medium flex items-center gap-2 px-3 py-1 tracking-widest cursor-pointer">
                <FaPen />
                Edit
              </button>
            </div>
          </div>

          {/* Last edited */}
          <p className="font-bold text-[12px] text-[#696969] flex items-center justify-end gap-1">
            <RxCounterClockwiseClock className="size-[14px]" />
            Last edited: {scene.lastEdited}
          </p>
        </div>

        {/* Script writing session */}
        <div className="bg-white min-h-[501px] max-h-auto">
  {sceneContent.map((content, contentIndex) => (
    <div key={contentIndex} className="w-full">
      {/* Description */}
      {content.description !== undefined && (
        <textarea
          ref={(el) => {
            if (el) inputRefs.current[`scene-${scene.id}-description-${contentIndex}`] = el;
          }}
          className="w-full px-4 pt-4 bg-transparent text-base md:text-lg outline-none resize-none overflow-hidden"
          rows={1} // Start as a single line
          value={content.description}
          placeholder="Type action/description here..."
          onChange={(e) => handleContentChange(
            contentIndex,
            "description",
            e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) // Capitalize first letter
          )}
          onInput={(e) => adjustTextareaHeight(e.target)}
          onKeyDown={(e) => handleKeyDown(e, contentIndex)}
          onFocus={() => setSelectedButton("Action")}
        />
      )}

      {/* Characters Input */}
      {content.characters !== undefined && (
        <div className="w-full flex justify-center">
          <input
            ref={(el) => {
              if (el) inputRefs.current[`scene-${scene.id}-characters-${contentIndex}`] = el;
            }}
            type="text"
            className="w-full md:w-1/2 text-lg md:text-xl text-center outline-none font-semibold bg-transparent"
            placeholder="CHARACTER NAME"
            value={content.characters.toUpperCase()} // Ensure uppercase display
            onChange={(e) => handleContentChange(contentIndex, "characters", e.target.value.toUpperCase())} // Convert to uppercase
            onKeyDown={(e) => handleKeyDown(e, contentIndex)}
            onFocus={() => setSelectedButton("Character")}
          />
        </div>
      )}

      {/* Dialog */}
      {content.dialog !== undefined && (
        <div className="w-full flex justify-center ">
          <textarea
            ref={(el) => {
              if (el) inputRefs.current[`scene-${scene.id}-dialog-${contentIndex}`] = el;
            }}
            className="w-full md:w-3/5 text-base md:text-lg p-2 outline-none resize-none text-center bg-transparent overflow-hidden"
            rows={1} // Start as a single line
            value={content.dialog}
            placeholder="Type dialog here..."
            onChange={(e) => handleContentChange(contentIndex, "dialog", e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
            onInput={(e) => adjustTextareaHeight(e.target)}
            onKeyDown={(e) => handleKeyDown(e, contentIndex)}
            onFocus={() => setSelectedButton("Dialog")}
          />
        </div>
      )}

      {/* Parenthetical */}
      {content.parenthetical !== undefined && (
        <div className="w-full flex justify-center ">
          <textarea
            ref={(el) => {
              if (el) inputRefs.current[`scene-${scene.id}-parenthetical-${contentIndex}`] = el;
            }}
            className="w-full parenthetical-wrapper md:w-2/5 text-base md:text-lg p-2 outline-none resize-none text-center bg-transparent overflow-hidden"
            rows={1} // Start as a single line
            value={content.parenthetical}
            placeholder=""
            onChange={(e) => handleContentChange(contentIndex, "parenthetical", e.target.value)}
            onInput={(e) => adjustTextareaHeight(e.target)}
            onKeyDown={(e) => handleKeyDown(e, contentIndex)}
            onFocus={() => setSelectedButton("Parenthetical")}
          />
        </div>
      )}
    </div>
  ))}
</div>

        {/* Bottom button section */}
        <div className="flex flex-col  lg:flex-row justify-between items-start lg:items-center gap-5">
          {/* Left button group */}
          <div className={`bg-white sm:gap-5 rounded-[10px]  ${isCommentSectionOpen?"w-4/5":"w-3/5"}   relative`}>
  {/* Clear Icon */}
  {aiButton.includes(scene.id) ? (
  <button 
    className="absolute  right-[-75px] bg-[#696969]/20 px-2 rounded-[2px] hover:text-gray-700 cursor-pointer"
    // Define the handleClear function to handle close action
    onClick={handleClearAi}
    >
    ✕ Clear 
  </button>
  ):""}
    {aiButton.includes(scene.id)&&!nextSceneAi.includes(scene.id) ? (

  <div className="flex gap-3 justify-end pr-6 pt-4 mb-4 " >
    {/* <button 
      className="bg-[#656464] text-white flex gap-1 rounded-[50px] px-5 py-2.5 text-[14px] font-medium cursor-pointer"
    >
      Plot twist
    </button>
    <button 
      className="bg-[#656464] text-white flex gap-1 rounded-[50px] px-5 py-2.5 text-[14px] font-medium cursor-pointer"
    >
      Build Character
    </button> */}
    <button 
      className="bg-[#656464] text-white flex gap-1 rounded-[50px] px-5 py-2.5 text-[14px] font-medium cursor-pointer"
      onClick={()=>handleCreateNextScene(scene.id)}
    >
      Create next scene
    </button>
  </div>
  ):""}
  <div className="flex gap-3 px-3">
  {nextSceneAi.includes(scene.id) ? (
    <div className="flex gap-4 pt-4 w-full">
      {loading
        ? // Skeleton Loader (Three placeholders)
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="flex-1 bg-gray-300 animate-pulse rounded-[10px] h-[150px]">
              <div className="h-6 bg-gray-400 rounded mt-4 mx-4"></div>
              <div className="h-4 bg-gray-400 rounded mt-2 mx-4 w-3/4"></div>
              <div className="h-4 bg-gray-400 rounded mt-2 mx-4 w-2/3"></div>
            </div>
          ))
        : // Render actual scenes when data is loaded
          nextScene?.map((scene, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedAiScene(scene);
                setIsModalOpen(true);
              }}
              className="flex-1 bg-[#CBA757]/40 rounded-[10px] h-[150px]"
            >
              <p className="px-4 py-2 border-b-[0.5px] text-lg font-semibold border-[#000000]/20">
                Scene {index + 1}
              </p>
              <p className="px-4 py-2 font-medium">
                {(() => {
                  const description = scene.content?.find((item: any) => item.description)?.description || 'No description available';
                  const words = description.split(' ');
                  return words.length > 4 ? words.slice(0, 4).join(' ') + '...' : description;
                })()}
              </p>
            </div>
          ))}
    </div>
  ) : null}
</div>

  <div className={`flex flex-wrap gap-3  py-6 px-5 ${aiButton.includes(scene.id) ?"opacity-25 pointer-events-none ":""}`}>
    <button 
      className={`${selectedButton === "Action" ? "bg-[#656464] text-white" : "bg-[#D9D9D9]"} flex gap-1 rounded-[11px] px-5 py-2.5 text-[14px] font-medium cursor-pointer`}
      onClick={() => handleButtonClick("Action")}
      disabled={aiButton.includes(scene.id)}
    >
      <img src={ActionIcon} alt="" className="w-[21px] h-[21px]" />
      Action
    </button>
    <button 
      className={`${selectedButton === "Character" ? "bg-[#656464] text-white" : "bg-[#D9D9D9]"} flex items-center justify-center gap-2 rounded-[11px] px-6 py-2.5 text-[14px] font-medium cursor-pointer`}
      onClick={() => handleButtonClick("Character")}
      disabled={aiButton.includes(scene.id)}
    >
      <IoMdPerson className="size-5" />
      Character
    </button>
    <button 
      className={`${selectedButton === "Dialog" ? "bg-[#656464] text-white" : "bg-[#D9D9D9]"} flex items-center justify-center gap-2 rounded-[11px] px-7 py-2.5 text-[14px] font-medium cursor-pointer`}
      onClick={() => handleButtonClick("Dialog")}
      disabled={aiButton.includes(scene.id)}
    >
      <FaComment className="size-4" />
      Dialogue
    </button>
    <button 
      className={`${selectedButton === "Parenthetical" ? "bg-[#656464] text-white" : "bg-[#D9D9D9]"} flex items-center justify-center gap-2 rounded-[11px] px-7 py-2.5 text-[14px] font-medium cursor-pointer`}
      onClick={() => handleButtonClick("Parenthetical")}
      disabled={aiButton.includes(scene.id)}
    >
      <BsQuote className="size-5" />
      Parenthetical
    </button>
    <button onClick={() => setAiButton([ scene.id])} className={`${aiButton.includes(scene.id) ?"bg-[#7920FF]":"bg-[#656464]"} flex items-center justify-center gap-2 rounded-[38px] px-6 py-2.5 text-[13px] text-white font-medium ml-0 lg:ml-15 cursor-pointer`}>
      <PiStarFourFill className="size-5" />
      AI Assist
    </button>
  </div>
</div>
         
          {/* Right controls */}
          <div className="flex flex-wrap gap-3 sm:gap-5 items-center justify-start sm:justify-end">
            {/* <button className="w-[127px] h-[55px] bg-white rounded-full border font-medium text-[18px]">
              Status
            </button> */}

            <div className="border rounded-full w-[55px] h-[55px] flex items-center justify-center bg-white cursor-pointer">
              <img src={StoryBoardIcon} alt="Storyboard" />
            </div>

            <div 
                className="flex flex-col items-center relative cursor-pointer"
                onClick={toggleCommentSection}
              >
                {scene.comments && scene.comments.length > 0 && (
                  <div className={`absolute -top-2 -right-1.5 sm:-top-2 sm:-right-1.5 md:-top-3.5 md:-right-2 bg-[#D9D9D9] font-bold text-[10px] md:text-[12px] rounded-full w-[18px] h-[18px] md:w-[24px] md:h-[24px] flex items-center justify-center p-1 ${scene.comments && scene.comments.length ? '' : 'hidden'}`}>
    {scene.comments ? scene.comments.length : 0}
  </div>
  )}
                <BiSolidCommentDetail className={`w-[30px] h-[30px] md:w-[40px] md:h-[35px] z-[10] ${isCommentSectionOpen ? 'text-[#7920FF]' : ''}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Comment section - only visible when toggled */}
       
    
      <AiSceneModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} scene={selectedAiScene} scenes={scenes} setScenes={setScenes} />
      </div>
      {isCommentSectionOpen && (
        <div className="w-1/4 bg-[#EDEBEB] rounded-tl-[10px] transition-all duration-300 flex flex-col min-h-[501px]">
        <div className="bg-[#D9D9D9] text-black p-3 flex justify-between items-center">
          <h3 className="font-semibold text-black">Comments</h3>
          <button onClick={toggleCommentSection} className="text-gray-400 hover:text-white">
            <RxCross2 />
          </button>
        </div>
        
        <div className="flex-grow p-3 overflow-y-auto">
          {scene.comments && scene.comments.length > 0 ? (
            <div className="space-y-4">
              {scene.comments.map((comment:any) => (
                <div key={comment.id} className="bg-white p-3 text-black rounded-md shadow-sm">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <img 
                        src={comment.avatar || 'https://i.pinimg.com/564x/a9/84/97/a984975ea4053921c7983f0213840890.jpg'} 
                        alt={comment.author} 
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="font-semibold text-sm">{comment.author}</span>
                    </div>
                    <button className="text-gray-400 hover:text-red-500 text-xs">
                      <BiCollapse />
                    </button>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                  <div className="w-full text-gray-500 text-sm mt-3">
                    <button onClick={() => handleDeleteComment(comment.id)} className="bg-[#D9D9D9] border-[0.5px] py-1 w-full border-[#656464] rounded-[10px]">
                      Mark as resolved
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <BiSolidCommentDetail className="w-12 h-12 mb-2 opacity-30" />
              <p className="text-sm">No comments yet</p>
            </div>
          )}
        </div>
        
        <div className="p-3 border-t border-gray-300 mt-auto">
          <div className="relative">
            <textarea
              ref={commentInputRef}
              className="w-full p-2 pr-10 border text-gray-700 border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:border-[#7920FF] min-h-[60px]"
              placeholder="Add a comment..."
              rows={1}
              value={newComment}
              onChange={handleCommentInputChange}
              onKeyPress={handleKeyPress}
            />
            <button 
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className={`absolute right-2 bottom-2 ${!newComment.trim() ? 'text-gray-300' : 'text-[#7920FF] cursor-pointer'}`}
            >
              <IoMdSend className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Press Enter to send</p>
        </div>
      </div>
        )}
    </div>

  );
};

export default ScriptWritingSession;