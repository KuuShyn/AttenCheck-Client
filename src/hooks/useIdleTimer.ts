import { useEffect } from 'react';

type UseIdleTimer = (onIdle: () => void, timeout?: number) => void;

const useIdleTimer: UseIdleTimer = (onIdle, timeout = 300000) => {
    // 5 minutes default
    useEffect(() => {
        let timer: NodeJS.Timeout;

        const resetTimer = () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(onIdle, timeout);
        };

        const handleActivity = () => resetTimer();

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keypress', handleActivity);
        window.addEventListener('click', handleActivity);

        resetTimer(); // Start timer on mount

        return () => {
            clearTimeout(timer);
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keypress', handleActivity);
            window.removeEventListener('click', handleActivity);
        };
    }, [onIdle, timeout]);
};

export default useIdleTimer;
