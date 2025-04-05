
const ScriptWriting:React.FC = () => {


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

            <p className="text-center text-opacity-70 text-black">Type Character & Press Enter</p>
          </div>

 
      
        </div>
      </div>
<div className="w-full flex justify-center">
      {/* Main Content Area - Responsive width and padding */}
      <div className="w-full  lg:w-4/5  px-4 md:px-8 lg:px-6 mt-4 lg:mt-7 flex flex-col space-y-8">
      

        {/* Add Scene Button */}
        <div className="mt-4 flex justify-center pb-8">
          <button
            className="border flex  justify-center items-center gap-1  text-lg md:text-lg font-bold border-black border-opacity-30 hover:bg-gray-300 rounded-lg px-4 py-1 bg-white text-black"

          >

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
