import React, { useState } from "react";
import { BiSolidDownArrow } from "react-icons/bi";

interface StatusDropdownProps {
    options: string[];
    selectedStatus: string | null;
    onChange: (status: string) => void;
    type?: boolean;
  }

  export const StatusDropdown: React.FC<StatusDropdownProps> = ({ options, selectedStatus, onChange, type }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const getStatusColor = (status:any) => {
      switch (status) {
        case "Work in progress":
          return "bg-[#FD902F]";
        case "Re-work":
          return "bg-[#C44545]";
        case "Approved":
          return "bg-[#45C460]";
        case "In Production":
          return "bg-[#1F28B2]";
        case "In Review":
          return "bg-[#FFD069]";
        case "Status":
          return "bg-gray-300";
        default:
          return "bg-gray-300"; // Default color for null or "No Status"
      }
    };
  
    return (
      <div className="relative ">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={` ${
            type ? "w-[240px] 2xl:w-[300px] bg-white" : "w-[140px] bg-[#D9D9D9]/30 text-[15px] flex justify-between py-6 items-center  font-bold 2xl:w-[210px]"
          } h-10  rounded-[40px]  focus:outline-none`}
        >
          <span
            className={`  w-2 h-2 mr-2 ml-4 rounded-full ${
              selectedStatus ? getStatusColor(selectedStatus) : "bg-gray-300"
            }`}
          ></span>
          <p className="">
            {selectedStatus || "Status"}
          </p>
          <BiSolidDownArrow size={10} className=" mr-4" />
        </button>
        {isOpen && (
          <div
            className={`absolute mt-1  ${
              type ? `w-5/6 2xl:w-3/4   left-5 2xl:left-9 ` : `w-[210px] border-t-[0.5px] border-l-[0.5px] border-r-[0.5px]  border-gray-300  left-[-25px] 2xl:left-0`
            } h-[250px] bg-fill     bg-no-repeat rounded-lg   z-10 bg-white text-black` }
            // style={{ backgroundImage: `url(${}) ` }}
          >
            {options.map((option) => (
              <label
                key={option}
                className="flex items-center px-4 py-2 cursor-pointer border-b border-gray-300 "
              >
                <span
                  className={`w-2 h-2 mt-2 rounded-full ${getStatusColor(
                    option
                  )} mr-2`}
                ></span>
                <span className="ml-2 mt-2">{option}</span>
                <input
                  type="radio"
                  name="status"
                  value={option}
                  checked={selectedStatus === option}
                  onChange={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className="text-orange-600 mt-3 w-full  focus:ring-orange-500 flex absolute left-20 2xl:left-20"
                />
              </label>
            ))}
          </div>
        )}
        
      </div>
    );
  };