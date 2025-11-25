export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-10 mt-16">
      <div className="container mx-auto px-6 text-center">
        <p className="text-lg mb-2">&copy; 2025 Adrenaline Fitness. Все права защищены.</p>
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <a href="#" className="hover:text-blue-400">Политика конфиденциальности</a>
          <a href="#" className="hover:text-blue-400">Условия использования</a>
          <a href="#" className="hover:text-blue-400">Контакты</a>
        </div>
      </div>
    </footer>
  );
}