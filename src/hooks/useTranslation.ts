'use client';

import { useState, useEffect } from 'react';

export function useTranslation() {
    const [translations, setTranslations] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTranslations = async () => {
            try {
                const nativeLanguage = localStorage.getItem('nativeLanguage') || 'English';

                // Don't fetch if it's already English (default)
                if (nativeLanguage === 'English') {
                    setLoading(false);
                    return;
                }

                const response = await fetch('/api/translate-ui', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ targetLanguage: nativeLanguage })
                });

                if (response.ok) {
                    const data = await response.json();
                    setTranslations(data);
                }
            } catch (error) {
                console.error('Failed to fetch translations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTranslations();

        // Listen for language changes
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'nativeLanguage') {
                fetchTranslations();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const t = (key: string, fallback?: string): string => {
        return translations[key] || fallback || key;
    };

    return { t, loading };
}
