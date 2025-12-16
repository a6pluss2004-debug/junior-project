export default function AuthLayout({ children }) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* You can place a shared Logo here if you want */}
          {children}
        </div>
      </div>
    );
  }
  