import { useState } from 'react'
import AddProjectModal from '../modal/AddProjectModal';

const Home = () => {

  const [projectAddModal,setProjectAddModal] = useState(false);

  return (
    <>
    <div className="bg-amber-50 flex justify-end items-center p-10">
  <div className="flex flex-col justify-center items-center">
    <button
      className="px-8 py-2 rounded-2xl bg-black text-white border-2 border-cyan-900"
      onClick={() => setProjectAddModal(true)}
    >
      Add Project
    </button>


  </div>
</div>

    </>
  )
}

export default Home
