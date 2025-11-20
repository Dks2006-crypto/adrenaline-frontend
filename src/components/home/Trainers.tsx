"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/lib/api"; // Инстанс настроенного Axios
import BookingModal from "@/components/ui/BookingModal"; // 👈 Предполагаем, что этот компонент существует
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

// Интерфейс данных тренера (совпадает с тем, что отдает Laravel)
interface Trainer {
  id: number;
  name: string;
  last_name?: string;
  avatar_url: string | null;
  specialties: string[] | null;
  bio: string | null;
  rating: number;
  reviews_count: number;
}

export default function Trainers() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Состояние для модального окна записи
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrainerId, setSelectedTrainerId] = useState<number | null>(null);
  
  // Проверка авторизации
  const { token } = useAuthStore(); 

  // 1. Загрузка списка тренеров
  useEffect(() => {
    api
      .get("/public/trainers")
      .then((res) => {
        setTrainers(res.data);
        console.log("Загруженные тренеры:", res.data);
      })
      .catch((err) => {
        console.error("Ошибка загрузки тренеров:", err);
        toast.error("Не удалось загрузить список тренеров");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  
  // 2. Обработчик клика по кнопке "Записаться"
  const handleBookClick = (trainerId: number) => {
    if (!token) {
      toast.error("Для записи необходимо войти в систему.");
      // Можно также перенаправить на страницу логина: router.push('/login');
      return;
    }
    setSelectedTrainerId(trainerId);
    setIsModalOpen(true);
  };
  
  // 3. Обработчик успешной записи (можно добавить логику обновления UI)
  const handleBookingSuccess = () => {
    setIsModalOpen(false);
    setSelectedTrainerId(null);
    toast.success("Запись отправлена. Тренер скоро свяжется с вами!");
    // Дополнительно можно обновить данные пользователя или записи
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-16">
          Наши <span className="text-indigo-600">профессиональные</span> тренеры
        </h2>

        {loading && (
          <div className="text-center py-12 text-gray-500">
            Загрузка тренеров...
          </div>
        )}

        {/* Список тренеров */}
        {!loading && trainers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {trainers.map((trainer) => (
              <div
                key={trainer.id}
                className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col hover:shadow-2xl transition duration-300"
              >
                {/* Аватар и имя */}
                <div className="relative h-64 w-full">
                  <Image
                    src={trainer.avatar_url || "/images/default-trainer.jpg"}
                    alt={`${trainer.name} ${trainer.last_name || ""}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-6">
                    <div>
                      <h3 className="text-3xl font-bold text-white leading-tight">
                        {trainer.name} {trainer.last_name}
                      </h3>
                    </div>
                  </div>
                  {/* Рейтинг */}
                  <div className="absolute top-4 right-4 bg-indigo-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-lg">
                    ⭐️ {trainer.rating.toFixed(1)} ({trainer.reviews_count})
                  </div>
                </div>

                {/* Блок с информацией */}
                <div className="p-6 flex flex-col grow">
                  {/* Специализации (теги) */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {trainer.specialties && trainer.specialties.length > 0 ? (
                      trainer.specialties.map((spec, index) => (
                        <span
                          key={index}
                          className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-md"
                        >
                          {spec}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">
                        Персональный тренер
                      </span>
                    )}
                  </div>

                  {/* Биография (обрезаем если длинная) */}
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 grow">
                    {trainer.bio ||
                      "Опытный инструктор поможет вам достичь поставленных целей."}
                  </p>
                  
                  {/* Кнопка записи */}
                  <button
                    onClick={() => handleBookClick(trainer.id)}
                    className="w-full mt-auto py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition shadow-md"
                  >
                    Записаться на тренировку
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Если тренеров нет */}
        {!loading && trainers.length === 0 && (
          <p className="text-center text-gray-500">
            Список тренеров пока пуст.
          </p>
        )}
      </div>
      
      {/* Модальное окно записи */}
      <BookingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleBookingSuccess}
        trainerId={selectedTrainerId} 
        classId={null} 
      />
    </section>
  );
}