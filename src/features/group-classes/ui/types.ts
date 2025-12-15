import { GroupClassListItem } from '@/features/group-classes/model/types';

export interface GroupClassCardProps {
  groupClass: GroupClassListItem;
}

export interface GroupClassListProps {
  groupClasses: GroupClassListItem[];
  loading: boolean;
}