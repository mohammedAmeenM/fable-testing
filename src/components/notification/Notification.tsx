import { useState } from 'react'
import { GoArrowRight } from 'react-icons/go'



const Notification = () => {
    const [notifications, ] = useState([
        {
          id: 1,
          title: "Movie title",
          comments: "4 Unreviewed Comments",
          status: "Status was changed",
        },
        {
          id: 2,
          title: "Movie title",
          comments: "4 Unreviewed Comments",
          status: "Status of 2 sequences was changed",
        },
        {
          id: 3,
          title: "Movie title",
          comments: "4 Unreviewed Comments",
          status: "Status of 2 scenes has been changed",
        },
      ]);
    
  return (
    <div className="w-48 bg-[#656464] border-l border-zinc-300 overflow-auto lg:w-80 p-2">
          <div className="p-4">
            <h3 className="font-semibold text-[16px] text-[#FFFFFF]">
              Notifications
            </h3>
          </div>

          <div className="">
            {notifications.map((notif) => (
              <div key={notif.id} className="p-4">
                <div className="flex bg-[#FFFFFF] p-4 pb-0 pl-0 pr-0 rounded-[10px] w-[274px] h-[137px]">
                  <div className="flex-1 relative">
                    <h4 className="font-medium text-sm pl-2 mb-1">{notif.title}</h4>
                    <div className="text-xs text-zinc-600 pl-2">
                      {notif.comments}
                    </div>
                    <div className="text-xs text-zinc-600 pl-2 pb-2">{notif.status}</div>
                    <div className="w-10 h-10 bg-[#D9D9D9] rounded-[7px] absolute -top-2 right-2"></div>
                    <div className="mt-2 flex justify-between items-center bg-[#ABABAB]/20 rounded-b-[10px]">
                      <div className="text-xs font-medium p-4 pl-2">Goto Project</div>
                      <GoArrowRight size={20} className="mr-2"/>
                     
                    </div>
                  </div>
                </div>
               
              </div>
            ))}
          </div>
        </div>
  )
}

export default Notification
