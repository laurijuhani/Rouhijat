import { useState, useEffect } from "react";

const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

const fetchData = async <T>(url: string, cacheKey: string): Promise<T> => {
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }

  const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  const data = await response.json();
  localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));
  return data;
};


const useFetchData = <T>(url: string, cacheKey: string): T | null => {
  const [data, setData] = useState<T | null>(null);
  
  useEffect(() => {
    fetchData<T>(url, cacheKey)
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [url, cacheKey]);


  return data;
};

export default useFetchData;