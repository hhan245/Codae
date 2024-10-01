import { authOptions } from '../app/api/auth/[...nextauth]/authOptions';
import { getCurrentUser } from './fetchData/getCurrentUser';
import { getServerSession } from 'next-auth';
import ChangePassword from '../components/password/ChangePassword';
import EditUsername from '../components/username/EditUsername';
import { FaUserAlt, FaEnvelope } from 'react-icons/fa';

export default async function Account() {
  const session = await getServerSession(authOptions);
  const currentUser = await getCurrentUser(session.strapiToken);

  return (
    <div className='flex justify-center items-center h-full'>
      <div className='bg-white shadow-lg rounded-lg p-6 mb-8 max-w-md w-full'>
        <h2 className='font-bold text-2xl mb-6 text-center text-sky-700'>Account</h2>

        <div className='bg-zinc-50 rounded-lg shadow p-6 mb-8'>
          <h3 className='font-bold mb-6 text-xl text-sky-600 flex items-center'>
            <FaUserAlt className='mr-2' /> User Data
          </h3>
          <EditUsername username={currentUser.username} />
          <div className='mb-4'>
            <div className='flex items-center'>
              <FaEnvelope className='mr-2 text-sky-700' />
              <span className='font-semibold'>Email: </span>
            </div>
            <div className='pl-6'>{currentUser.email}</div>
            <div className='pl-6 text-gray-500'>(You cannot edit your email.)</div>
          </div>
          <div className='text-gray-500'>
            Last updated: {new Date(currentUser.updatedAt).toLocaleString()}
          </div>
        </div>
        {session.provider !== 'google' && (
          <div className='bg-zinc-50 rounded-lg shadow p-6'>
            <h3 className='font-bold mb-4 text-xl text-sky-600'>Change Password</h3>
            <ChangePassword />
          </div>
        )}
      </div>
    </div>
  );
}