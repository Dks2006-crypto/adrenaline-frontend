"use client";

import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";

export default function ProfileSection() {
  const { user, loadUser } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const roleText =
    user?.role_id === 1
      ? "Администратор"
      : user?.role_id === 2
      ? "Тренер"
      : "Клиент";

  const roleColor =
    user?.role_id === 1
      ? "bg-red-100 text-red-800"
      : user?.role_id === 2
      ? "bg-amber-100 text-amber-800"
      : "bg-green-100 text-green-800";

  const fallbackAvatar = (
    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
      {user?.name?.charAt(0).toUpperCase() || "U"}
    </div>
  );

  // Открываем выбор файла
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Когда выбрали файл
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

  // Когда обрезали
  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Загрузка обрезанного изображения
  const uploadCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsUploading(true);
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);

      const formData = new FormData();
      formData.append("avatar", croppedFile);

      await api.post("/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Аватар обновлён!");
      await loadUser();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(
        "Ошибка загрузки: " + (err.response?.data?.error || err.message)
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <section>
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Мой профиль</h2>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-2xl">
          <div className="flex items-center gap-8">
            {/* Аватар с кликабельностью */}
            <div className="shrink-0 relative group">
              <div
                className="relative cursor-pointer transition-all hover:scale-105"
                onClick={handleAvatarClick}
              >
                {/* Обязательно добавляем pointer-events-none к Image */}
                {user?.avatar_url ? (
                  <Image
                    src={user.avatar_url + "?t=" + Date.now()}
                    alt="Аватар"
                    width={112}
                    height={112}
                    className="w-28 h-28 rounded-full object-cover shadow-xl border-4 border-white pointer-events-none"
                    unoptimized
                  />
                ) : (
                  fallbackAvatar
                )}

                {/* Оверлей с камерой */}
                <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Скрытый input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
              />
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Имя</p>
                <p className="text-xl font-semibold text-gray-800">
                  {user?.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg text-gray-800">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Роль в клубе</p>
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${roleColor}`}
                >
                  {roleText}
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Нажмите на аватар, чтобы изменить фото
          </p>
        </div>
      </section>

      {/* Модалка с обрезкой */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <h3 className="text-2xl font-bold mb-4">Обрезка аватара</h3>

            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
              <Cropper
                image={imageSrc!}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="mt-4 flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setImageSrc(null);
                }}
                className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Отмена
              </button>
              <button
                onClick={uploadCroppedImage}
                disabled={isUploading}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-70 transition"
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
