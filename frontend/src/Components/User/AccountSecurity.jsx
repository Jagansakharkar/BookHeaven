
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";

export const AccountSecurity = () => {

  const navigator = useNavigate()

  return (
    <>
      {/* back button */}
      <button onClick={() => navigator("/profile/settings")} className='px-8 py-3 text-2xl bg-blue-600 mb-4 flex items-center gap-1 text-zinc-300 hover:text-white'><IoMdArrowRoundBack /></button>

      <div className='bg-zinc-800 mt-4 rounded-lg px-8 py-6 text-2xl w-1/2 h-min'>
        <div className='mt-2'>
          <label htmlFor="CurrentPass">Current Password:</label><br />
          <input type="password" className='p-2 w-[100%] bg-zinc-600' id='currentPass' />

        </div>
        <div className='mt-2' >
          <label htmlFor="newPass">New Password:</label><br />
          <input type="password" className='p-2 w-[100%] bg-zinc-600' id='newPass' />

        </div>
        <div className='mt-2'>
          <label htmlFor="re-type_new_pass">Re-type New Password:</label><br />
          <input type="password" className='p-2 w-[100%] bg-zinc-600' id='retype_new_Pass' />

        </div>
        <div className='mt-4 flex justify-end gap-8'>
          <button className='bg-green-500 py-2 px-8 rounded-md'>Save</button>
          <button className='bg-zinc-600 py-2 px-8 rounded-md'>Cancel</button>
        </div>

      </div>

    </>
  )
}
