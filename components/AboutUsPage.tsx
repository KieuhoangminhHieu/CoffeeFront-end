import React from 'react';

// Fix: Replaced component with a placeholder as the "About Us" feature is not supported by the API, resolving import errors.
const AboutUsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-center mb-12 text-theme-primary">
        Về chúng tôi
      </h1>
      <p className="text-center text-gray-600">
        Trang này đang được xây dựng.
      </p>
    </div>
  );
};

export default AboutUsPage;
