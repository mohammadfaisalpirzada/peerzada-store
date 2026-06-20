import React from "react";

const EducationPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Master Sahub&rsquo;s Educational Hub
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Welcome to our educational platform. We&rsquo;re building something amazing for you.
            </p>
          </div>
          
          {/* Content Area */}
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Coming Soon
            </h2>
            <p className="text-gray-600">
              Educational content will be added here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EducationPage;