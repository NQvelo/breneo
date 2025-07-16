
import React from 'react';
import { AuthForm } from '@/components/auth/AuthForm';

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-breneo-lightgray flex flex-col">
      {/* Simple header */}
      <header className="bg-white py-3 px-4 md:py-4 md:px-6 shadow-sm">
        <div className="container mx-auto">
          <a href="/" className="flex items-center space-x-2">
            <img src="/lovable-uploads/a27089ec-2666-4c11-a0e0-0d8ea54e1d39.png" alt="Breneo Logo" className="h-8 md:h-10" />
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center py-6 px-4 md:py-12">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </main>

      {/* Simple footer */}
      <footer className="bg-white py-3 px-4 md:py-4 md:px-6 border-t">
        <div className="container mx-auto">
          <p className="text-xs md:text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} Breneo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;
