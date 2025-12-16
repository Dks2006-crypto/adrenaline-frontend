"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { AxiosError } from "axios";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";
import EditProfileModal from "@/shared/ui/EditProfileModal";
import { trainerApi } from "@/entities/trainer";

export default function ProfileSection() {
  const { user, loadUser, logout } = useAuthStore();
  const router = useRouter();
  
  const isTrainer = user?.role_id === 2;
  const meta = user?.metadata || {};

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ width: number; height: number; x: number; y: number } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUpdatingBookings, setIsUpdatingBookings] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Файл слишком большой (макс 10МБ)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setIsModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const [editOpen, setEditOpen] = useState(false);

  const handlePersonalBookingsToggle = async (accepts_personal_bookings: boolean) => {
    setIsUpdatingBookings(true);
    try {
      await trainerApi.updatePersonalBookingsSetting(accepts_personal_bookings);
      await loadUser();
      toast.success(accepts_personal_bookings ? "Теперь вы принимаете заявки на персональные тренировки" : "Заявки на персональные тренировки отключены");
    } catch (error) {
      console.error('Failed to update personal bookings setting:', error);
      toast.error("Не удалось обновить настройку");
    } finally {
      setIsUpdatingBookings(false);
    }
  };

  const onCropComplete = (_: unknown, cropped: { width: number; height: number; x: number; y: number }) =>
    setCroppedAreaPixels(cropped);

  const uploadCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsUploading(true);
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      const formData = new FormData();
      formData.append("avatar", croppedFile);

      await api.post("/me/avatar", formData);
      toast.success("Аватар обновлён!");
      await loadUser();
      setIsModalOpen(false);
    } catch (error: unknown) {
      console.error('Avatar upload error:', error);
      
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 422) {
          const errors = error.response.data.errors;
          if (errors?.avatar) {
            toast.error(`Ошибка валидации: ${errors.avatar[0]}`);
          } else {
            toast.error("Ошибка валидации файла");
          }
        } else if (error.response.status === 401) {
          toast.error("Необходимо авторизоваться");
        } else if (error.response.status === 413) {
          toast.error("Файл слишком большой");
        } else {
          toast.error(`Ошибка загрузки: ${error.response.data?.message || error.message || 'Неизвестная ошибка'}`);
        }
      } else {
        toast.error("Ошибка загрузки");
      }
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <section className="flex justify-center py-12 sm:py-16 lg:py-20">
        <div className="w-full max-w-4xl border-2 border-[#1E79AD] rounded-2xl p-4 sm:p-6 lg:p-8 text-white relative bg-black/70 backdrop-blur">
          <h2 className="text-center text-lg sm:text-xl mb-8 sm:mb-10 opacity-90">Мой профиль</h2>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-6 sm:gap-8 lg:gap-10">
            {/* ЛЕВАЯ ЧАСТЬ */}
            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm order-2 lg:order-1">
              <InfoRow label="Имя" value={user.name} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Роль" value={isTrainer ? "Тренер" : "Клиент"} />

              {/* ТРЕНЕР */}
              {isTrainer && (
                <div className="pt-4 sm:pt-6 space-y-3 sm:space-y-4">
                  {user.bio && (
                    <div>
                      <h3 className="mb-2 text-white/80 text-sm sm:text-base">Биография:</h3>
                      <p className="text-white/70 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                        {user.bio}
                      </p>
                    </div>
                  )}
                  
                  {/* Переключатель персональных заявок */}
                  <div className="border-t border-[#1E79AD] pt-4">
                    <h3 className="mb-3 text-white/80 text-sm sm:text-base">Персональные тренировки:</h3>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className="text-white/60 text-xs sm:text-sm">
                        {(user.accepts_personal_bookings ?? true) ? "Принимаю заявки" : "Не принимаю заявки"}
                      </span>
                      <button
                        onClick={() => handlePersonalBookingsToggle(!(user.accepts_personal_bookings ?? true))}
                        disabled={isUpdatingBookings}
                        className={`
                          relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E79AD] focus:ring-offset-2
                          ${(user.accepts_personal_bookings ?? true) ? 'bg-[#1E79AD]' : 'bg-gray-600'}
                          ${isUpdatingBookings ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}
                        `}
                      >
                        <span
                          className={`
                            inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform
                            ${(user.accepts_personal_bookings ?? true) ? 'translate-x-4 sm:translate-x-6' : 'translate-x-1'}
                          `}
                        />
                      </button>
                    </div>
                    <p className="text-white/50 text-xs mt-2">
                      Включите, чтобы клиенты могли записываться к вам на персональные тренировки
                    </p>
                  </div>
                </div>
              )}

              {/* КЛИЕНТ */}
              {!isTrainer && (
                <div className="pt-4 sm:pt-6 space-y-2">
                  <ProfileItem
                    label="Возраст"
                    value={meta.age ? `${meta.age} лет` : "—"}
                  />
                  <ProfileItem
                    label="Уровень подготовки"
                    value={meta.fitness_level || "—"}
                  />
                  <ProfileItem label="Цель" value={meta.goal || "—"} />
                </div>
              )}
            </div>

            {/* ПРАВАЯ ЧАСТЬ */}
            <div className="flex flex-col items-center gap-3 sm:gap-4 order-1 lg:order-2">
              <div
                className="relative w-32 h-32 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden border-2 border-[#1E79AD] cursor-pointer group"
                onClick={handleAvatarClick}
              >
                <Image
                  src={user.avatar_url || "/avatar-placeholder.png"}
                  alt="avatar"
                  fill
                  unoptimized
                  className="object-cover pointer-events-none"
                />

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs sm:text-sm pointer-events-none">
                  Сменить фото
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditOpen(true);
                }}
                className="px-3 sm:px-4 py-2 bg-[#1E79AD] hover:bg-[#145073] transition rounded-xl text-xs sm:text-sm w-full sm:w-auto"
              >
                Редактировать профиль
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
              />

              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-2 bg-red-600/80 hover:bg-red-700 transition rounded-xl text-xs sm:text-sm w-full sm:w-auto"
              >
                Выйти из аккаунта
              </button>
            </div>
          </div>
        </div>
      </section>

      <EditProfileModal isOpen={editOpen} onClose={() => setEditOpen(false)} />

      {/* МОДАЛКА ОБРЕЗКИ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-black rounded-2xl max-w-lg w-full p-6 border border-[#1E79AD] text-white">
            <h3 className="text-xl mb-4">Обрезка аватара</h3>

            <div className="relative h-80 rounded-xl overflow-hidden bg-black">
              <Cropper
                image={imageSrc!}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 border border-white/20 rounded-lg"
              >
                Отмена
              </button>
              <button
                onClick={uploadCroppedImage}
                disabled={isUploading}
                className="flex-1 py-3 bg-[#1E79AD] rounded-lg"
              >
                {isUploading ? "Загрузка..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- ВСПОМОГАТЕЛЬНЫЕ ---------- */

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex border-b border-[#1E79AD] pb-2">
      <span className="w-40 text-white/60">{label}:</span>
      <span>{value || "—"}</span>
    </div>
  );
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-white/60">{label}:</span>
      <span className="ml-2">{value}</span>
    </div>
  );
}
