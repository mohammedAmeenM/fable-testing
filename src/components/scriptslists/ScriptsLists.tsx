import React, { useEffect, useState } from "react";
import ScriptWritingSession from "./ScriptWritingSession";
// import { LuFilter } from "react-icons/lu";
import { MdLocationOn } from "react-icons/md";
import { GiBackwardTime } from "react-icons/gi";
import { BiSolidCommentDetail } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { RxPerson } from "react-icons/rx";
import { ChevronsDownUp } from "lucide-react";
import ProfileIcon from "../../assets/profile-icon.png";
import StoryBoardIcon from "../../assets/storyboard-icon.png";
import AddSceneIcon from "../../assets/addscene-icon.png";
import { createScript, getScriptsUsers } from "../../api/services/scriptServices";
import { useSelector } from "react-redux";
import { RootState } from "../../app/redux";
import { StatusDropdown } from "./StatusDropdown";
import { useParams } from "react-router-dom";
import EpisodicBreak from "./EpisodicBreak"; // Import the new component

interface SceneContent {
  description?: string;
  characters?: string;
  dialog?: string;
  parenthetical?: string;
}

interface Scene {
  id: number;
  title: string;
  location: string;
  characters: string[];
  synopsis: string;
  content: SceneContent[];
  sceneType: string;
  sceneId?:any;
  lastEdited: string;
  status?: string;
  comments?:any;
}

// New interface for episodic breaks
interface EpisodeBreak {
  id: number;
  position: number; // Position between scenes (after which scene it appears)
  episodeNumber: number;
  title: string;
}

const initialScenesData = [
  {
    id: 1,
    title: " Introduction Pt. 1",
    location: "Central Park, London",
    characters: [],
    synopsis: "",
    content: [
      {
        description: "",
      },
    ],
    sceneType: "DAY/EXT",
    comments:[],
    lastEdited: "24/05 19:10 by Koga",
    status: "Status",
  }
];

const ScriptsLists: React.FC = () => {
  const { id } = useParams();
  const projectId: any = id;
  // const [isOpen, setIsOpen] = useState<number | null>(null);
  const [expandedScenes, setExpandedScenes] = useState<number[]>([]);
  const [scenes, setScenes] = useState<Scene[]>(initialScenesData);

  // State for episodic breaks
  const [episodicBreaks, setEpisodicBreaks] = useState<EpisodeBreak[]>(() => {
    // Load from localStorage on initial render
    const savedBreaks = localStorage.getItem(`episodic-breaks-${projectId}`);
    return savedBreaks ? JSON.parse(savedBreaks) : [];
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [, setSelectedOption] = useState("EXT/DAY");

  const options = ["EXT/DAY", "EXT/NIGHT", "INT/DAY", "INT/NIGHT"];
  const statusOptions = ["Work in progress", "Re-work", "Approved", "In Production", "In Review"];
  
  const [, setRefresh] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  const userId: any = useSelector((state: RootState) => state.auth.userId);

  // Save episodic breaks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`episodic-breaks-${projectId}`, JSON.stringify(episodicBreaks));
  }, [episodicBreaks, projectId]);

  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const response: any = await getScriptsUsers(userId, projectId);
        console.log(response, 'API response');
        
        if (response.data.success && response.data.data && response.data.data.length > 0) {
          const transformedScenes = response.data.data[0].scenes.map((scene: any, index: number) => {
            const formattedComments = scene.comments ? scene.comments.map((comment: any) => ({
              id: comment._id,
              text: comment.content,
              author: comment.authorName || "Unknown",
              timestamp: new Date(comment.createdAt || Date.now()).toLocaleString(),
              avatar: 'https://i.pinimg.com/564x/a9/84/97/a984975ea4053921c7983f0213840890.jpg',
              userId: comment.userId
            })) : [];
            return {
              id: index + 1,
              title: scene.title || "No Title",
              location: scene.location || "No Location",
              characters: scene.characters || [],
              synopsis: scene.synopsis || "",
              content: scene.content || [{description: ""}],
              sceneType: "DAY/EXT",
              lastEdited: scene.lastEdited ? `${scene.lastEdited}` : "No edit info",
              comments:formattedComments,
              status: scene.status || "Status",
              sceneId: scene.sceneId
            };
          });
      
          if (transformedScenes.length > 0) {
            setScenes(transformedScenes);
          }
        }
      } catch (error) {
        console.error('Error fetching scripts:', error);
      }
    };
  
    if (userId && projectId) {
      fetchScripts();
    }
  }, [userId, projectId]);

  useEffect(() => {
    setHasChanges(true);
  }, [scenes, episodicBreaks]);

  const triggerSaveNotification = () => {
    setShowSavedNotification(true);
    setTimeout(() => {
      setShowSavedNotification(false);
    }, 2000); 
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const scriptData = {
        userId: userId,
        projectTitleId: projectId,
        scenes: scenes.map((scene) => ({
          title: scene.title,
          location: scene.location,
          characters: scene.characters,
          synopsis: scene.synopsis,
          content: scene.content
            .filter((item) => Object.keys(item).length > 0)
            .map((item) => ({
              description: item.description,
              characters: item.characters,
              dialog: item.dialog,
              parenthetical: item.parenthetical,
            })),
          lastEdited: "Ameen",
          comments:scene.comments,
          status: scene.status,
        })),
        status: "pending",
      };

      console.log("Payload being sent:", JSON.stringify(scriptData, null, 2));
      const result = await createScript(scriptData);
      console.log("Data saved successfully:", result);
      triggerSaveNotification();
      setHasChanges(false);
    } catch (error) {
      console.error("Error saving data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const handleSceneUpdate = () => {
      setRefresh(prev => prev + 1);
    };
    
    window.addEventListener('scenesUpdated', handleSceneUpdate);
    
    return () => {
      window.removeEventListener('scenesUpdated', handleSceneUpdate);
    };
  }, []);
  
  const handleExpandAll = () => {
    if (expandedScenes.length >= 1) {
      setExpandedScenes([]);
    } else {
      setExpandedScenes(scenes.map(scene => scene.id));
    }
  };

  const handleOptionClick = (option: string, sceneId: number) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
    
    setScenes(prevScenes => 
      prevScenes.map(scene => 
        scene.id === sceneId ? { ...scene, sceneType: option } : scene
      )
    );
  };

  const handleStatusChange = (sceneId: number, newStatus: string) => {
    setScenes(prevScenes => 
      prevScenes.map(scene => 
        scene.id === sceneId ? { ...scene, status: newStatus } : scene
      )
    );
  };

  // const toggleDropdown = (id: number) => {
  //   setIsOpen(isOpen === id ? null : id);
  // };

  const toggleExpand = (id: number) => {
    if (expandedScenes.includes(id)) {
      setExpandedScenes(expandedScenes.filter(sceneId => sceneId !== id));
    } else {
      setExpandedScenes([id]);
    }
  };

  // const updateSceneTitle = (id: number, newTitle: string) => {
  //   setScenes(prevScenes => 
  //     prevScenes.map(scene => 
  //       scene.id === id ? { ...scene, title: newTitle } : scene
  //     )
  //   );
  // };

  const updateSceneLocation = (id: number, newLocation: string) => {
    setScenes(prevScenes => 
      prevScenes.map(scene => 
        scene.id === id ? { ...scene, location: newLocation } : scene
      )
    );
  };

  const updateSceneSynopsis = (id: number, newSynopsis: string) => {
    setScenes(prevScenes => 
      prevScenes.map(scene => 
        scene.id === id ? { ...scene, synopsis: newSynopsis } : scene
      )
    );
  };

  const updateSceneContent = (id: number, newContent: SceneContent[]) => {
    setScenes(prevScenes => 
      prevScenes.map(scene => 
        scene.id === id ? { ...scene, content: newContent } : scene
      )
    );
  };

  const addNewScene = (afterSceneId: number = 0) => {
    const newId = scenes.length > 0 ? Math.max(...scenes.map(scene => scene.id)) + 1 : 1;
    const newScene = {
      id: newId,
      title: " New Scene",
      location: "Location",
      characters: [],
      synopsis: "",
      content: [
        {
          description: "", 
        },
      ],
      comments:[],
      sceneType: "DAY/EXT",
      lastEdited: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })} ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} by User`,
      status: "Status",
    };
    
    // If afterSceneId is specified, insert after that scene
    if (afterSceneId > 0) {
      const index = scenes.findIndex(scene => scene.id === afterSceneId);
      if (index !== -1) {
        const updatedScenes = [
          ...scenes.slice(0, index + 1),
          newScene,
          ...scenes.slice(index + 1)
        ];
        setScenes(updatedScenes);
      } else {
        setScenes([...scenes, newScene]);
      }
    } else {
      setScenes([...scenes, newScene]);
    }
    
    setExpandedScenes([...expandedScenes, newId]);
  };

  const updateSceneCharacters = (id: number, characterName: string) => {
    setScenes(prevScenes => 
      prevScenes.map(scene => {
        if (scene.id === id) {
          const currentCharacters = scene.characters || [];
          const characterExists = currentCharacters.some(
            char => char.toLowerCase() === characterName.toLowerCase()
          );
          
          if (!characterExists) {
            return { 
              ...scene, 
              characters: [...currentCharacters, characterName]
            };
          }
        }
        return scene;
      })
    );
  };

  const removeSceneCharacter = (id: number, characterName: string) => {
    setScenes(prevScenes => 
      prevScenes.map(scene => {
        if (scene.id === id && scene.characters) {
          return { 
            ...scene, 
            characters: scene.characters.filter(char => char !== characterName) 
          };
        }
        return scene;
      })
    );
  };

  // Add episodic break after a scene
  const addEpisodicBreak = (afterSceneId: number = 0) => {
    const lastScene = scenes.length > 0 ? scenes[scenes.length - 1].id : 0;
    const positionAfter = afterSceneId > 0 ? afterSceneId : lastScene;
    
    const newBreakId = Date.now(); // Use timestamp for unique ID
    const episodeNumber = episodicBreaks.length + 2; // Start with Episode 2
    
    const newBreak: EpisodeBreak = {
      id: newBreakId,
      position: positionAfter,
      episodeNumber: episodeNumber,
      title: `Episode ${episodeNumber}`
    };
    
    setEpisodicBreaks([...episodicBreaks, newBreak]);
  };

  // Update episodic break title
  const updateEpisodicBreakTitle = (breakId: number, newTitle: string) => {
    setEpisodicBreaks(prevBreaks => 
      prevBreaks.map(breakItem => 
        breakItem.id === breakId ? { ...breakItem, title: newTitle } : breakItem
      )
    );
  };

  // Delete episodic break
  const deleteEpisodicBreak = (breakId: number) => {
    setEpisodicBreaks(prevBreaks => 
      prevBreaks.filter(breakItem => breakItem.id !== breakId)
    );
  };

  // Find episodic break that comes after a specific scene
  const findEpisodicBreakAfterScene = (sceneId: number) => {
    return episodicBreaks.find(breakItem => breakItem.position === sceneId);
  };

  useEffect(() => {
    console.log("Scenes state updated:", scenes);
    console.log("Episodic breaks updated:", episodicBreaks);
  }, [scenes, episodicBreaks]); 

  return (
    <div className="relative py-10 w-full max-w-[1700px] mx-auto px-4 md:px-8">
      {hasChanges && (
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      )}

      {showSavedNotification && (
        <div className="fixed top-16 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          Saved Successfully!
        </div>
      )}
      
      {/* Header Section */}
      <section className="text-black flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex relative gap-3 items-center">
          <div className="flex">
            <img
              src={ProfileIcon}
              alt=""
              className="z-[20] w-8 h-8 md:w-12 md:h-12"
            />
            <img
              src={ProfileIcon}
              alt=""
              className="z-[10] -ml-5 w-8 h-8 md:w-12 md:h-12"
            />
            <img
              src={ProfileIcon}
              alt=""
              className="-ml-5 w-8 h-8 md:w-12 md:h-12"
            />
          </div>
          <p className="font-medium text-[16px] md:text-[24px]">
            4 Members on this project
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div 
            className="flex items-center justify-center bg-[#D9D9D9] rounded-[10px] px-4 py-2 gap-2 cursor-pointer"
            onClick={handleExpandAll}
          >
            <ChevronsDownUp className="rotate-40 w-[15px] h-[15px]" />
            <p className="font-semibold text-[14px] md:text-[20px] cursor-pointer">
              {expandedScenes.length === scenes.length ? "Collapse all scenes" : "Expand all scenes"}
            </p>
          </div>
          {/* <div className="bg-[#D9D9D9] py-2 px-3 rounded-[10px] flex items-center gap-2">
            <LuFilter className="size-[18px] md:size-[20px]" />
            <button className="font-bold text-[14px] md:text-[15px] cursor-pointer">
              Filter
            </button>
          </div> */}
          {/* Add Global Episodic Break Button */}
          {/* <div 
            className="bg-[#CBA757] py-2 px-3 rounded-[10px] flex items-center gap-2 cursor-pointer"
            onClick={() => addEpisodicBreak()}
          >
            <button className="font-bold text-[14px] md:text-[15px] text-white">
              Add Episodic Break
            </button>
          </div> */}
        </div>
      </section>

      {/* Scenes Section */}
      <section className="mx-auto mt-7 text-white w-full max-w-[1500px]">
        <div className="space-y-5">
          {scenes.map((scene, index) => (
            <React.Fragment key={`scene-group-${scene.id}`}>
              <div
                className="flex flex-col w-full rounded-[10px]"
                style={{ boxShadow: "0px 7px 2px 0px #c5c4c4b7" }}
              >
                <div
                  className={`bg-[#1E1E1E] pl-4 md:pl-8 py-4 md:py-0 flex flex-col sm:flex-row items-start md:items-center w-full gap-6 md:gap-0 ${
                    expandedScenes.includes(scene.id)
                      ? "rounded-tl-[10px] rounded-tr-[10px]"
                      : "rounded-[10px]"
                  }`}
                >
                  <div className="flex-1">
                    {expandedScenes.includes(scene.id) ? (
                      <div className="relative">
                        <div
                          className="cursor-pointer rounded-md"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                          {scene.sceneType}
                        </div>

                        {isDropdownOpen && (
                          <div className="absolute top-8 left-0 bg-[black] rounded-md shadow-lg z-10 w-[130px]">
                            {options.map((option) => (
                              <div
                                key={option}
                                className="p-2 hover:bg-[#838181] rounded-md cursor-pointer"
                                onClick={() => handleOptionClick(option, scene.id)}
                              >
                                {option}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : null}

                    <div className="font-semibold flex text-[18px] gap-3 md:text-[24px]">
                      <p className={` ${expandedScenes.includes(scene.id) ?"w-1/12":"w-1/8"}`}>Scene {index + 1}</p>
                      <input 
                        type="text" 
                        placeholder="New Scene"
                        className="outline-none w-[90%] bg-transparent "
                        
                        defaultValue={scene.title}
                      />
                    </div>
                    {!expandedScenes.includes(scene.id) && (
                      <div className="text-[#696969] text-[12px] font-bold flex flex-col md:flex-row gap-1 md:gap-3 mt-1">
                        <p className="flex items-center gap-1">
                          <MdLocationOn className="size-[14px]" />{" "}
                          {scene.location}
                        </p>
                        <p className="flex items-center gap-1">
                          <GiBackwardTime className="size-[14px]" /> Last
                          edited: {scene.lastEdited}
                        </p>
                      </div>
                    )}
                  </div>

                  {expandedScenes.includes(scene.id) ? (
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      {(scene.characters && scene.characters.length > 0) ? (
                        scene.characters.map((character, index) => (
                          <div 
                            key={index}
                            className="bg-white text-black text-[12px] font-bold flex items-center gap-1 py-2 px-3 rounded-[30px] group relative"
                          >
                            <RxPerson className="size-3.5" />
                            {character}
                            <button 
                              className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSceneCharacter(scene.id, character);
                              }}
                              title="Remove character"
                            >
                              ×
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm">No characters added</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex h-[60px] md:h-[130px] items-center">
                      <div className="relative flex items-center">
                        <StatusDropdown
                          options={statusOptions}
                          selectedStatus={scene.status || "Status"}
                          onChange={(status) => handleStatusChange(scene.id, status)}
                          type={false}
                        />
                      </div>

                      <div className="border-l border-[#696969] h-full mx-2 md:mx-4"></div>

                      <div className="flex flex-col items-center space-x-4 md:space-x-0 md:space-y-2 px-0 md:px-4 relative">
                      {scene.comments && scene.comments.length > 0 && (
                        <div className="absolute -top-2 -right-1.5 sm:-top-2 sm:-right-1.5 md:-top-3.5 md:right-4 bg-[#706d6da9] font-bold text-[10px] md:text-[12px] rounded-full w-[18px] h-[18px] md:w-[24px] md:h-[24px] flex items-center justify-center p-1">
                          {scene.comments.length}
                        </div>
                      )}
                        <BiSolidCommentDetail className="w-[30px] h-[30px] md:w-[40px] md:h-[35px] z-[10]" />
                        <p className="font-semibold text-[13px] md:text-[15px]">
                          comment
                        </p>
                      </div>

                      <div className="border-l border-[#696969] h-full mx-2 md:mx-4"></div>

                      <div className="flex flex-col items-center space-y-1.5 px-8">
                        <img
                          src={StoryBoardIcon}
                          alt="Storyboard"
                          className="w-[30px] h-[30px] md:w-[40px] md:h-[40px]"
                        />
                        <p className="font-semibold text-[13px] md:text-[15px]">
                          Storyboard
                        </p>
                      </div>
                    </div>
                  )}

                  <div
                    className={`h-[50px] md:h-[131px] w-full md:w-[81px] rounded-b-[10px] md:rounded-b-none md:rounded-tr-[10px] md:rounded-br-[10px] flex items-center justify-center cursor-pointer ${
                      expandedScenes.includes(scene.id) ? "bg-none" : "bg-[#757373]"
                    }`}
                    onClick={() => toggleExpand(scene.id)}
                  >
                    <IoIosArrowDown
                      className={`w-[30px] h-[30px] md:w-[45px] md:h-[45px] transition-transform ${
                        expandedScenes.includes(scene.id) ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {expandedScenes.includes(scene.id) && (
                  <ScriptWritingSession 
                    scene={scene} 
                    scenes={scenes}
                    setScenes={setScenes}
                    updateLocation={(location) => updateSceneLocation(scene.id, location)}
                    updateSynopsis={(synopsis) => updateSceneSynopsis(scene.id, synopsis)}
                    updateContent={(content) => updateSceneContent(scene.id, content)}
                    updateCharacters={(character) => updateSceneCharacters(scene.id, character)}
                    projectId = {projectId}
                  />
                )}
              </div>

              {/* Episodic Break that appears after this scene if it exists */}
              {findEpisodicBreakAfterScene(scene.id) && (
                <div className="my-6">
                  <EpisodicBreak
                    id={findEpisodicBreakAfterScene(scene.id)!.id}
                    title={findEpisodicBreakAfterScene(scene.id)!.title}
                    episodeNumber={findEpisodicBreakAfterScene(scene.id)!.episodeNumber}
                    onEdit={updateEpisodicBreakTitle}
                    onDelete={deleteEpisodicBreak}
                  />
                  {expandedScenes.includes(scene.id) && (
                      <div className="flex justify-center mt-4 mb-6">
                      <button 
                        onClick={() => addNewScene(scene.id)}
                        className="bg-[#7920FF] text-white flex items-center gap-2 rounded-[38px] px-6 py-2.5 text-[14px] font-medium"
                      >
                        <img src={AddSceneIcon} alt="" className="w-[16px] h-[16px]" />
                        Add Scene After Episode
                      </button>
                    </div>
                  )}
                
                </div>
              )}

              {/* Add Scene and Episodic Break buttons after expanded scene */}
              {expandedScenes.includes(scene.id) && !findEpisodicBreakAfterScene(scene.id) && (
                <div className="text-black flex justify-center gap-5 py-4">
                  <div 
                    className="flex items-center justify-center gap-3 w-[161px] h-[55px] border rounded-[20px] cursor-pointer bg-white hover:bg-gray-100"
                    onClick={() => addNewScene(scene.id)}
                  >
                    <img
                      src={AddSceneIcon}
                      alt=""
                      className="w-[21px] h-[21px]"
                    />
                    <p className="font-medium text-base">Add Scene</p>
                  </div>

                  <div 
                    className="flex items-center justify-center gap-3 w-[248px] h-[55px] border border-[#CBA757] rounded-[20px] cursor-pointer bg-white hover:bg-[#FDF8E8]"
                    onClick={() => addEpisodicBreak(scene.id)}
                  >
                    <img
                      src={AddSceneIcon}
                      alt=""
                      className="w-[21px] h-[21px]"
                    />
                    <p className="font-medium text-base">Add Episodic Break</p>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}

          {/* If there are no scenes yet */}
          {scenes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 bg-[#1E1E1E] rounded-[10px] min-h-[200px]">
              <p className="text-gray-400 mb-6">No scenes created yet</p>
              <button 
                onClick={() => addNewScene()}
                className="bg-[#7920FF] text-white flex gap-1 rounded-[38px] px-6 py-2.5 text-[14px] font-medium"
              >
                <img src={AddSceneIcon} alt="" className="w-[16px] h-[16px]" />
                Add First Scene
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ScriptsLists;