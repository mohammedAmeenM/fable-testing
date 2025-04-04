import React, { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const NavigationMenu: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const navigate = useNavigate()

  return (
    <div className="relative"> 
      <section className="bg-[#F7F7F7] py-4 px-4 sm:px-7 flex flex-col md:flex-row justify-between"> 
        <div className="flex  flex-row gap-4 sm:gap-7"> 
          <p className="flex items-center gap-2 font-bold text-[15px] sm:text-[17px]"
          onClick={()=>navigate(-1)}>
            <IoArrowBackOutline className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" /> Back
          </p>
 
          <div className="flex items-center gap-2">
            <div className="bg-[#EDEDED] w-[40px] h-[40px] sm:w-[51px] sm:h-[54px] rounded-[5px] border-[1px] border-[#0000001A]"></div>
            <p className="text-[20px] sm:text-[24px] font-medium">Movie Title</p>
          </div>
        </div>
 
        <div className="flex flex-row gap-4 sm:gap-5 items-center mt-4 "> 
          <div className=" w-[185px] h-[40px] sm:h-[45px] rounded-full bg-[#6856562d] flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full mr-3"></div>
            <p className="font-semibold text-[13px] sm:text-[15px]">Project Status</p>
            <IoMdArrowDropdown className="w-5 h-6 sm:w-6 sm:h-7 ml-1 text-[#685656]" />
          </div>
 
          <div className="flex space-x-0.5 h-[40px] sm:h-[46px]"> 
            <div
              className={`bg-[#D9D9D9] w-[80px] sm:w-[115px] rounded-tl-[50px] rounded-bl-[50px] flex items-center justify-center transition-all duration-300 ${
              activeItem === "script" ? "bg-black text-white" : "" }`}
              onClick={() => setActiveItem("script")}
            >
              <p className="font-semibold text-[12px] sm:text-[13px] flex gap-1.5">
                Script{" "}
                <div 
                  className={`rounded-full text-[13px] sm:text-[15px] w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] flex justify-center items-center ${
                  activeItem ? "bg-white text-black" : "bg-white"  }`}
                >
                  2
                </div>
              </p>
            </div>
 
            <div
              className={`bg-[#D9D9D9] w-[95px] sm:w-[130px] flex items-center justify-center transition-all duration-300 ${
              activeItem === "story-board" ? "bg-black text-white" : "" }`}
              onClick={() => setActiveItem("story-board")}
            >
              <p className="font-semibold text-[12px] sm:text-[13px] flex gap-1.5">
                Story-Board{" "}
                <div
                  className={`rounded-full text-[13px] sm:text-[15px] w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] flex justify-center items-center ${
                  activeItem ? "bg-white text-black" : "bg-white" }`}
                >
                  2
                </div>
              </p>
            </div>

            {/* Report Tab */}
            <div
              className={`bg-[#D9D9D9] w-[70px] sm:w-[115px] rounded-tr-[50px] rounded-br-[50px] flex items-center justify-center transition-all duration-300 ${
              activeItem === "report" ? "bg-black text-white" : "" }`}
              onClick={() => setActiveItem("report")}
            >
              <p className="font-semibold text-[12px] sm:text-[13px]">Report</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Border */}
      <div className="border-b-[3px] mt-2 border-[#0000001A]"></div>
    </div>
  );
};

export default NavigationMenu;