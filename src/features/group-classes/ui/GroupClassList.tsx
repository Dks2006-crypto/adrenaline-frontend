import GroupClassCard from "./GroupClassCard";
import { GroupClassListProps } from './types';

export default function GroupClassList({ groupClasses, loading }: GroupClassListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-gray-900 border border-gray-700 rounded-lg p-6 animate-pulse"
          >
            <div className="h-6 bg-gray-700 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-4/5"></div>
              <div className="h-4 bg-gray-700 rounded w-3/5"></div>
            </div>
            <div className="h-10 bg-gray-700 rounded mt-6"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!groupClasses || groupClasses.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-xl">Групповые занятия временно недоступны</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groupClasses.map((groupClass) => (
        <GroupClassCard key={groupClass.id} groupClass={groupClass} />
      ))}
    </div>
  );
}
