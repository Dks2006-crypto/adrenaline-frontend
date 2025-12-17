import { useEffect, useState } from 'react';
import { GroupClassListItem } from '@/features/group-classes/model/types';
import toast from 'react-hot-toast';

export const useGroupClasses = () => {
  const [groupClasses, setGroupClasses] = useState<GroupClassListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroupClasses = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const response = await fetch(`${apiUrl}/group-classes`);

        if (!response.ok) throw new Error("Не удалось загрузить групповые занятия");
        const data = await response.json();
        setGroupClasses(data);
      } catch (err) {
        console.error('Ошибка загрузки групповых занятий:', err);
        toast.error('Не удалось загрузить список групповых занятий');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupClasses();
  }, []);

  return { groupClasses, loading };
};