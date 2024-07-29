'use client';

import { signOut } from 'next-auth/react';
import useIdleTimer from '@/hooks/useIdleTimer';

const AutoLogout = () => {
    useIdleTimer(() => {
        signOut();
    }, 300000); // Set to 5 minutes

    return null;
};

export default AutoLogout;
