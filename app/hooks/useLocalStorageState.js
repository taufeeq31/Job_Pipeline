'use client';

import { useEffect, useRef, useState } from 'react';

const STORAGE_SYNC_EVENT = 'job-tracker:local-storage-sync';

export default function useLocalStorageState(storageKey, initialValue) {
    const [value, setValue] = useState(initialValue);
    const [isLoaded, setIsLoaded] = useState(false);
    const instanceIdRef = useRef(
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : `${storageKey}-${Date.now()}-${Math.random()}`
    );

    useEffect(() => {
        try {
            const rawValue = window.localStorage.getItem(storageKey);
            if (rawValue !== null) {
                setValue(JSON.parse(rawValue));
            }
        } catch {
            // Fallback to in-memory state if localStorage is unavailable or corrupted.
        } finally {
            setIsLoaded(true);
        }
    }, [storageKey]);

    useEffect(() => {
        function handleStorageEvent(event) {
            if (event.key !== storageKey) return;

            try {
                setValue(event.newValue === null ? initialValue : JSON.parse(event.newValue));
            } catch {
                // Ignore malformed storage updates.
            }
        }

        function handleSyncEvent(event) {
            const detail = event.detail;
            if (!detail || detail.storageKey !== storageKey) return;
            if (detail.sourceId === instanceIdRef.current) return;

            setValue(detail.value);
        }

        window.addEventListener('storage', handleStorageEvent);
        window.addEventListener(STORAGE_SYNC_EVENT, handleSyncEvent);

        return () => {
            window.removeEventListener('storage', handleStorageEvent);
            window.removeEventListener(STORAGE_SYNC_EVENT, handleSyncEvent);
        };
    }, [initialValue, storageKey]);

    useEffect(() => {
        if (!isLoaded) return;

        try {
            window.localStorage.setItem(storageKey, JSON.stringify(value));
            window.dispatchEvent(
                new CustomEvent(STORAGE_SYNC_EVENT, {
                    detail: {
                        storageKey,
                        value,
                        sourceId: instanceIdRef.current,
                    },
                })
            );
        } catch {
            // Ignore write errors so the app remains usable.
        }
    }, [isLoaded, storageKey, value]);

    return [value, setValue, isLoaded];
}
