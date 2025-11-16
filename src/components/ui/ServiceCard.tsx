import { FC } from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  price: number;
  duration: number;
  onClick: () => void;
}

const ServiceCard: FC<ServiceCardProps> = ({ title, description, price, duration, onClick }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg" onClick={onClick}>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex justify-between">
        <span>Цена: {price} RUB</span>
        <span>Длительность: {duration} дней</span>
      </div>
    </div>
  );
};

export default ServiceCard;