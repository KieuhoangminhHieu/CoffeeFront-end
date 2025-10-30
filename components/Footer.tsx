import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-theme-primary text-theme-secondary mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-serif font-bold text-theme-accent">Góc Cà Phê</h3>
            <p className="text-sm mt-1">&copy; {new Date().getFullYear()} Đã đăng ký bản quyền.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-theme-accent transition duration-300">Facebook</a>
            <a href="#" className="hover:text-theme-accent transition duration-300">Instagram</a>
            <a href="#" className="hover:text-theme-accent transition duration-300">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;