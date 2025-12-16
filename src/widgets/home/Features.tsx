export default function Features() {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Почему выбирают нас?</h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">Мы создали пространство, где фитнес становится образом жизни, а не обязанностью.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {/* Карточка 1 */}
          <div className="p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition bg-gray-50">
            <div className="bg-blue-100 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-2xl sm:text-3xl">
              🏋️
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl text-gray-800 font-bold mb-2 sm:mb-3">Топовое оборудование</h3>
            <p className="text-gray-600 text-sm sm:text-base">Тренажеры последних моделей от ведущих мировых брендов.</p>
          </div>

          {/* Карточка 2 */}
          <div className="p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition bg-gray-50">
            <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-2xl sm:text-3xl">
              🧘‍♀️
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl text-gray-800 font-bold mb-2 sm:mb-3">Зона релакса</h3>
            <p className="text-gray-600 text-sm sm:text-base">Сауна и массажный кабинет для восстановления после тренировок.</p>
          </div>

          {/* Карточка 3 */}
          <div className="p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition bg-gray-50 sm:col-span-2 lg:col-span-1">
            <div className="bg-purple-100 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 text-2xl sm:text-3xl">
              ⚡
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl text-gray-800 font-bold mb-2 sm:mb-3">Энергия сообщества</h3>
            <p className="text-gray-600 text-sm sm:text-base">Мотивирующее окружение и групповые челленджи.</p>
          </div>
        </div>
      </div>
    </section>
  );
}