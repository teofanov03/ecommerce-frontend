// src/hooks/useFetch.js - AŽURIRANO
import { useState, useEffect, useCallback } from 'react'; // Dodajemo useCallback
import axios from 'axios';

const useFetch = (url, initialData = null) => {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // KREIRAMO FUNKCIJU ZA DOHVAT PODATAKA
    // Koristimo useCallback da bi fetcher funkcija bila stabilna
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(url);
            setData(response.data); // Prilagođeno Vašoj API strukturi
        } catch (err) {
            setError(err);
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [url]); // Zavisi od URL-a

    // Prvo učitavanje
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // VRAĆAMO fetchData kao refetch
    return { 
        data, 
        loading, 
        error, 
        refetch: fetchData // <-- NOVA FUNKCIJA
    };
};

export default useFetch;