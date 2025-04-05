
const ScriptWriting:React.FC = () => {


  return (
    <div className="min-h-screen bg-gray-100">
    {/* Header - Responsive title input */}
    <div className="flex w-full justify-center p-4">
  <input 
    type="text" 
    className="text-2xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl font-medium bg-transparent outline-none w-full md:w-2/3 text-center border-b-4 border-black border-opacity-30 mb-6 py-2" 

  />
</div>;

    <div className="flex flex-col ">
      {/* Sidebar Controls - Responsive positioning */}
      <div className="w-full  flex justify-center sticky top-5  z-50 ">

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
