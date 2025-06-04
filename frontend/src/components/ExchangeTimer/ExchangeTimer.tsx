'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ExchangeTimer({ initialSeconds = 60 }) {
    const [seconds, setSeconds] = useState(initialSeconds);
    const router = useRouter();

    useEffect(() => {
        if (seconds === 0) {
            // Refresh SSR data (initial exchange rate)
            router.refresh();
            setSeconds(60);
        }

        const timer = setTimeout(() => setSeconds(seconds - 1), 1000);

        return () => clearTimeout(timer);
    }, [seconds, initialSeconds]);

    return <p>Refreshing in {seconds}s</p>;
}
