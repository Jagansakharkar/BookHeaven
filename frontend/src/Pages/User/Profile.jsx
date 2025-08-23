import { useGetUserInfo } from "../../hooks/User"
import Loader from '../../Components/common/Loader'
import { Sidebar } from '../../Components/User/Sidebar'
import { MobileNav } from '../../Components/User/MobileNav'
import { Outlet } from 'react-router-dom'
const Profile = () => {
  const { data: profile, isLoading, isError, error, refetch } = useGetUserInfo()

  if (isError) {
    return <><div>Failed To Fetch Data, Please try Again</div></>
  }
  if (isLoading) {
    <div className='w-full flex items-center justify-center h-[60vh]'>
      <Loader size="lg" />
    </div>
  }
  return (
    <div className='min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-gray-100 px-4 py-6 md:px-8 lg:px-12'>
      <div className='max-w-7xl mx-auto'>
        {profile && (
          <div className='flex flex-col md:flex-row gap-6'>
            <div className='hidden md:block w-full md:w-64 lg:w-72 h-fit md:sticky md:top-6 rounded-xl bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 shadow-lg'>
              <Sidebar data={profile} />
            </div>

            <div className='flex-1'>
              <div className='md:hidden mb-6'>
                <MobileNav data={profile} />
              </div>

              <div className='bg-zinc-800/50 backdrop-blur-sm rounded-xl border border-zinc-700 shadow-lg overflow-hidden'>
                <Outlet context={{ profile }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default Profile