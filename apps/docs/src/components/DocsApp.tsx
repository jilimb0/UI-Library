import React from 'react';

function DocsApp() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">UI Library</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/playground" className="text-gray-500 hover:text-gray-900">Playground</a>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Documentation</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Welcome to UI Library documentation. Explore all components, see live examples,
            and read detailed usage instructions.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Components</h3>
              <p className="text-gray-600 mb-6">
                Button, Card, Modal, DatePicker and 20+ more production-ready components
              </p>
              <button className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                Browse Components →
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-2xl text-white shadow-2xl">
              <h3 className="text-2xl font-semibold mb-4">Coverage 96%</h3>
              <p className="text-indigo-100 mb-6">All components fully tested</p>
              <div className="w-full bg-white/20 rounded-lg p-3">
                <div className="bg-white w-[96%] h-3 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DocsApp;