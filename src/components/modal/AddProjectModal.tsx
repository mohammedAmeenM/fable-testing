import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProjectTitle } from "../../api/services/projectTitleService";
import { useSelector } from "react-redux";
import { RootState } from "../../app/redux";

interface AddProjectModalProps {
  onClose: () => void;
  fetchProjects: () => void;
}


const AddProjectModal = ({ onClose, fetchProjects }: AddProjectModalProps) => {
  const [projectName, setProjectName] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const navigate = useNavigate();

  const userId = useSelector((state: RootState) => state.auth.userId);

  const types = ["Movie", "Shortfilm"];

  const handleChange = (e: any) => {
    e.preventDefault();
    setProjectName(e.target.value);
  };

  const handleCreateProject = async () => {
    try {
      if (!projectName || !selectedType) {
        console.error("Project Name and Type are required!");
        return;
      }

      const values = {
        userId: userId,
        title: projectName,
        type: selectedType,
      };

      const response: any = await createProjectTitle(values);
      console.log(response.data);
      if (response?.data?.success) {
        fetchProjects();
        onClose();
        navigate("/");
      } else {
        console.error(
          "Failed to create project:",
          response?.data?.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs">
      <div className="text-white rounded-lg w-full max-w-[530px] max-h-[500px] shadow-lg py-6 px-6 bg-orange-50">
        {/* Header */}
        <div className="relative flex justify-center items-center ">
          <button
            className="absolute -top-[90px] -right-6 text-black  text-sm font-semibold bg-[#49454533] gap-1 border-[0.5px] px-2 py-2 border-[#FFFFFF4D] rounded-lg flex items-center justify-center"
            aria-label="Close"
            onClick={onClose}
          >
            close
            <span></span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex justify-center text-center border-b-[0.5px] border-[#B0B0B080] ">
          <h2 className="text-[33px] font-semibold w-full max-w-[600px] text-black">
            Add your Project Name
          </h2>
        </div>

        {/* Footer */}
        <div className="flex flex-col justify-center items-center mt-14">
          <input
            type="text"
            value={projectName}
            onChange={handleChange}
            placeholder="Add Project Name"
            className="rounded-md py-2 px-4 w-[300px] h-[50px] text-black bg-white border border-gray-300 focus:outline-none "
          />

          <select
            id="type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="mt-3 py-2 px-4 w-[300px] h-[50px] border border-gray-300 text-black bg-white rounded-md shadow-sm"
          >
            <option value="" disabled hidden>
              Select a type
            </option>
            {types.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-evenly items-center p-4 mt-4 gap-1 ">
          <button
            className="bg-[#272727] hover:bg-[#383737] text-white text-[16.34px] fo font-semibold rounded-[7.78px] w-[174.14px] h-[50.82px] cursor-pointer "
            onClick={handleCreateProject}
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProjectModal;
