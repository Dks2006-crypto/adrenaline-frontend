import { useEffect, useState } from 'react';
import { GroupClass } from '@/features/group-classes/model/types';
import toast from 'react-hot-toast';

export const useGroupClass = (id: string | number) => {
  const [groupClass, setGroupClass] = useState<GroupClass | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupClass = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const response = await fetch(`${apiUrl}/group-classes/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Групповое занятие не найдено");
          }
          throw new Error("Не удалось загрузить информацию о групповом занятии");
        }
        
        const data = await response.json();
        setGroupClass(data);
      } catch (err) {
        console.error('Ошибка загрузки группового занятия:', err);
        toast.error(err instanceof Error ? err.message : 'Не удалось загрузить информацию о групповом занятии');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGroupClass();
    }
  }, [id]);

  return { groupClass, loading };
};