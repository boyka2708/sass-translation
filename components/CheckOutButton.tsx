'use client';

import { db } from '@/firebase';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import LoadingSpinner from './Loading';
import { useSubscriptionStore } from '@/store/store';
import ManageAccountBtn from './ManageAccountBtn';

type Props = {};

function CheckOutButton({}: Props) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const subscription = useSubscriptionStore((state) => state.subscription);

  const isLoadingSubscription = subscription === undefined;

  const isSubscribed =
    subscription?.status === 'active' && subscription?.role === 'pro';

  const createCheckOutSession = async () => {
    if (!session) return;

    setLoading(true);

    const docRef = await addDoc(
      collection(db, 'customers', session.user.id, 'checkout_sessions'),
      {
        price: 'price_1OATPCSD4XG4AMPo2G7otLsH',
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      }
    );

    return onSnapshot(docRef, (snap) => {
      const data = snap.data();
      const url = data?.url;
      const error = data?.error;

      if (error) {
        alert(`An error occured: ${error.message}`);
        setLoading(false);
      }

      if (url) {
        window.location.assign(url);
        setLoading(false);
      }
    });
  };
  return (
    <div className="flex flex-col space-y-2">
      {isSubscribed && (
        <>
          <hr className='mt-5' />
          <p className='pt-5 text-center text-xs text-indigo-600'>
            You&apos;re subscribed to PRO
          </p>
        </>
      )}
      <div
        className="mt-8 block rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold
      leading-6 cursor-pointer disabled:opacity-80 text-white dark:text-white shadow-sm hover:bg-indigo-500
      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        {isSubscribed ? (
          <ManageAccountBtn />
        ) : isLoadingSubscription || loading ? (
          <LoadingSpinner />
        ) : (
          <button onClick={() => createCheckOutSession()}>Sign Up</button>
        )}
      </div>
    </div>
  );
}

export default CheckOutButton;
