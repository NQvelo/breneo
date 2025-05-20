
import React from 'react';
import { AuthForm } from '@/components/auth/AuthForm';

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-breneo-lightgray flex flex-col">
      {/* Simple header */}
      <header className="bg-white py-4 px-6 shadow-sm">
        <div className="container mx-auto">
          <a href="/" className="flex items-center space-x-2">
            <img src="/lovable-uploads/6bee4aa6-3a7f-4806-98bd-dc73a1955812.png" alt="Breneo Logo" className="h-10" />
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </main>

      {/* Simple footer */}
      <footer className="bg-white py-4 px-6 border-t">
        <div className="container mx-auto">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} Breneo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;
