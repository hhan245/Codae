'use client';

import { useRef, useState } from 'react';
import changePasswordAction from './changePasswordAction';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PendingSubmitButton from '../PendingSubmitButton';

export default function ChangePassword() {
  const [actionState, setActionState] = useState({
    error: false,
  });
  const router = useRouter();
  const formRef = useRef(null);
  const { update } = useSession();

  async function handleSubmit(formData) {
    const actionRes = await changePasswordAction(formData);
    setActionState(actionRes);

    // if actionRes was successful (password was updated)
    // the actionRes returns us a new jwt strapiToken
    // we use this token to update next auth token and session
    if (
      !actionRes.error &&
      'message' in actionRes &&
      actionRes.message === 'Success'
    ) {
      // reset form fields with useRef
      // https://sabin.dev/blog/how-to-clear-your-forms-when-using-server-actions-in-nextjs
      formRef.current?.reset();
      // update next auth
      await update({ strapiToken: actionRes.data.strapiToken });
      // after update we should do a router.refresh to refresh the server session
      router.refresh();
    }
  }

  return (
    <form className='my-8 max-w-md bg- p-6 rounded-lg shadow-lg' action={handleSubmit} ref={formRef}>
      <div className='mb-4'>
        <label htmlFor='currentPassword' className='block text-gray-700 mb-2'>
          Enter your old password *
        </label>
        <input
          type='password'
          id='currentPassword'
          name='currentPassword'
          required
          className='bg-gray-50 border border-gray-300 w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-600'
        />
        {actionState.error && actionState?.inputErrors?.currentPassword ? (
          <div className='text-red-600 mt-2' aria-live='polite'>
            {actionState.inputErrors.currentPassword[0]}
          </div>
        ) : null}
      </div>
      <div className='mb-4'>
        <label htmlFor='newPassword' className='block text-gray-700 mb-2'>
          Enter your new password *
        </label>
        <input
          type='password'
          id='newPassword'
          name='newPassword'
          required
          className='bg-gray-50 border border-gray-300 w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-600'
        />
        {actionState.error && actionState?.inputErrors?.newPassword ? (
          <div className='text-red-600 mt-2' aria-live='polite'>
            {actionState.inputErrors.newPassword[0]}
          </div>
        ) : null}
      </div>
      <div className='mb-4'>
        <label htmlFor='passwordConfirmation' className='block text-gray-700 mb-2'>
          Confirm your new password *
        </label>
        <input
          type='password'
          id='passwordConfirmation'
          name='passwordConfirmation'
          required
          className='bg-gray-50 border border-gray-300 w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-600'
        />
        {actionState.error && actionState?.inputErrors?.passwordConfirmation ? (
          <div className='text-red-600 mt-2' aria-live='polite'>
            {actionState.inputErrors.passwordConfirmation[0]}
          </div>
        ) : null}
      </div>
      <div className='mb-4'>
        <PendingSubmitButton />
      </div>
      {actionState.error && actionState.message ? (
        <div className='text-red-600 mt-4' aria-live='polite'>
          {actionState.message}
        </div>
      ) : null}
      {!actionState.error &&
        'message' in actionState &&
        actionState.message === 'Success' ? (
        <div className='text-green-600 mt-4' aria-live='polite'>
          Your password was updated.
        </div>
      ) : null}
    </form>
  );
}
