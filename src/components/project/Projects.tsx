import { BiEditAlt } from "react-icons/bi";
import { PiCopySimple } from "react-icons/pi";
import { IoNotifications } from "react-icons/io5";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import Notification from "../notification/Notification";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/redux";
import { getProjectsByUserId } from "../../api/services/projectTitleService";
import AddProjectModal from "../modal/AddProjectModal";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectAddModal, setProjectAddModal] = useState(false);
  const navigate = useNavigate();

  const userId = useSelector((state: RootState) => state.auth.userId);

  const fetchProjectsbyUserId = async () => {
    try {
      const response: any = await getProjectsByUserId(userId);
      console.log(response.data, ".................................");
      if (response?.data.data) {
        console.log(response.data,'111111')
        setProjects(response.data.data);
      }
    } catch (error) {
      console.log("Error in fetch projects by userId");
    }
  };
  useEffect(() => {
    fetchProjectsbyUserId();
  }, [userId]);

  const handleScriptList = (scriptId:any)=>{
    navigate(`/scriptlists/${scriptId}`)
  }

  return (
    <>
      {/* <div className="flex flex-col h-screen bg-zinc-900 text-white"> */}
      {/* Top navigation bar */}

      {/* Search bar */}

      <div className="flex items-center">
        <div className="flex-1 relative">
          <div className="w-full bg-white text-black">
            <h2 className="text-[24px] font-bold p-5">Fable</h2>

            <div className="flex justify-between items-center bg-[#1E1E1E] p-8">
              <div className="flex-col ">
                <h2 className="font-medium text-white text-[24px] mb-1">
                  All your Projects
                </h2>
                <h2 className="font-medium text-[#FFFFFF] text-[14px]">
                  12 Projects in progress
                </h2>
                {/* <Maximize2 size={16} className="text-zinc-500" /> */}
              </div>
              <button
                className="px-8 py-2 rounded-2xl bg-black text-white border-2 border-cyan-900"
                onClick={() => setProjectAddModal(true)}
              >
                Add Project
              </button>
              <button
                className="px-8 py-2 rounded-2xl bg-black text-white border-2 border-cyan-900"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              {projectAddModal && (
                <AddProjectModal
                  onClose={() => setProjectAddModal(false)}
                  fetchProjects={fetchProjectsbyUserId}
                />
              )}
            </div>
          </div>
          <div className="absolute right-0 top-0 bg-[#656464] w-30 h-[76px] flex items-center justify-center">
            {/* Notification Button */}
            <button
              className="bg-[#D9D9D9] rounded-full p-3"
              onClick={() => setIsOpen(!isOpen)}
            >
              <IoNotifications size={22} className="text-[#1E1E1E]" />
            </button>

            {/* Notification Dropdown */}
            {isOpen && (
              <div className="absolute top-[calc(100%+8px)] right-0 min-w-[250px] max-h-[300px] bg-white shadow-lg rounded-lg z-50">
                <Notification />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Projects panel */}
        <div className="flex-1 bg-white p-4 overflow-auto">
          <div className="mt-6">
            <div className="text-xs text-[#000000] font-medium mb-4 pl-4">
              February 2025
            </div>

            <div className="grid grid-cols-5 gap-10 pl-4">
              {projects.length > 0 ? (
                projects?.map((project: any) => (
                  <div
                    key={project._id}
                    className="bg-[#F4F4F4] pl-0 px-8 py-2 rounded-[8.75px] flex relative h-[198.88px]"
                    onClick={() => handleScriptList(project._id)}
                  >
                    {/* Left Bar Div */}
                    <div className="w-4 bg-[#F4F4F4] flex flex-col justify-between py-2 mr-1">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className="h-2 w-full bg-[#1E1E1E] rounded-[0.88px]"
                        ></div>
                      ))}
                    </div>

                    {/* Right Green Project Card */}
                    <div className="bg-[#D6D6D6] rounded-lg overflow-hidden flex-1 p-4 flex flex-col justify-between h-[183.38px]">
                      <div className="font-medium">{project.title}</div>

                      <div className="flex justify-between items-end">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>

                    {/* Icons on the right side */}
                    <div className="absolute top-2 right-1 flex flex-col space-y-2">
                      <button className="p-1 text-[#000000] hover:text-zinc-700">
                        <BiEditAlt size={20} />
                      </button>
                      <button className="p-1 text-[#000000] hover:text-zinc-700">
                        <PiCopySimple size={20} />
                      </button>
                    </div>
                    {/* <div className="absolute bottom-2 right-1 flex flex-col space-y-2 ">
        <button className="p-1 text-[#C50A0A] hover:text-zinc-700">
          <Trash2 size={20} />
        </button>
        </div> */}

                    <div className="absolute bottom-2 right-0 flex flex-col space-y-2 ">
                      <button className="p-1 text-[#000000] hover:text-zinc-700">
                        <PiDotsThreeVerticalBold size={25} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No projects available</p>
              )}
            </div>
          </div>
        </div>

        {/* Notifications panel */}
      </div>
      {/* </div> */}
    </>
  );
};

export default Projects;
