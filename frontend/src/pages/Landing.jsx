import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomDrawer from '../components/ui/BottomDrawer';
import Login from './Login';
import Register from './Register';

const Landing = () => {
  const { isAuthenticated, user, logoutUser } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePos({ x: x * 20, y: y * 20 });
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const features = [
    {
      icon: '💸',
      title: 'Smart Expense Tracking',
      description: 'Track expenses with category-based cards. Quick entry with visual icons for Food, Transport, Shopping and more.'
    },
    {
      icon: '💰',
      title: 'Income Management',
      description: 'Monitor income from multiple sources like Salary, Freelance, Business, and Investments with detailed tracking.'
    },
    {
      icon: '📊',
      title: 'Visual Reports',
      description: 'Interactive pie charts and analytics showing spending patterns by category with real-time insights.'
    },
    {
      icon: '🎯',
      title: 'Budget Control',
      description: 'Set monthly budgets for each category with progress tracking and overspending alerts.'
    },
    {
      icon: '📈',
      title: 'Dashboard Overview',
      description: 'Complete financial overview with income, expenses, balance, and recent transaction previews.'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and secure with user authentication and data protection.'
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden flex flex-col items-center justify-center">
      {/* 3D Background Elements */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          transform: `translate3d(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px, 0) rotateX(${mousePos.y * 0.1}deg) rotateY(${mousePos.x * 0.1}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full blur-lg"></div>
        <div className="absolute bottom-32 left-40 w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-lg"></div>
      </div>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 relative z-10 w-full fixed top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center py-6 ${isAuthenticated ? 'justify-between' : 'justify-between'}`}>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600 flex items-center">
                <svg className="w-7 h-7 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                ExpenseTracker
              </span>
            </div>
            {isAuthenticated && (
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <span className="text-lg font-medium text-gray-700">Welcome back, {user?.name}!</span>
              </div>
            )}
            <div className="space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logoutUser();
                      window.location.reload();
                    }}
                    className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md transition-all duration-300 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] border-2 border-transparent"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setShowRegister(true)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-all duration-300 hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] border-2 border-transparent"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative z-10 w-full mt-20">
        <div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          style={{
            transform: `translate3d(${mousePos.x * 0.2}px, ${mousePos.y * 0.2}px, 0) rotateX(${mousePos.y * 0.05}deg) rotateY(${mousePos.x * 0.05}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
            Take Control of Your
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent"> Finances</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track expenses, manage income, set budgets, and get insights with our intuitive expense tracker. 
            Make smarter financial decisions with visual reports and real-time analytics.
          </p>
          <div className="space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors inline-block"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/expenses"
                  className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-colors inline-block"
                >
                  Track Expenses
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowRegister(true)}
                  className="bg-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-all duration-300 ease-out hover:scale-105 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] border-2 border-transparent inline-block"
                >
                  Start Tracking Free
                </button>
                <button
                  onClick={() => setShowLogin(true)}
                  className="border-2 border-gray-600 text-gray-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-all duration-300 ease-out hover:scale-105 hover:border-orange-500 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] inline-block"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/80 backdrop-blur-sm relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ perspective: '1000px' }}>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Money
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features designed to make expense tracking simple and effective
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-2 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300 group relative overflow-hidden transform hover:scale-105"
                style={{
                  transform: `translate3d(${mousePos.x * (0.1 + index * 0.02)}px, ${mousePos.y * (0.1 + index * 0.02)}px, 0) rotateX(${mousePos.y * 0.03}deg) rotateY(${mousePos.x * 0.03}deg)`,
                  transition: 'transform 0.1s ease-out, box-shadow 0.3s ease-out'
                }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* How it Works */}
      <section className="py-20 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in 3 simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Sign Up</h3>
              <p className="text-gray-600">Create your free account in seconds</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Add Transactions</h3>
              <p className="text-gray-600">Click category cards to quickly add expenses and income</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Insights</h3>
              <p className="text-gray-600">View reports, set budgets, and make better financial decisions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 w-full">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of users who are already managing their money smarter with ExpenseTracker
          </p>
          {isAuthenticated ? (
            <Link
              to="/"
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Go to Your Dashboard
            </Link>
          ) : (
            <button
              onClick={() => setShowRegister(true)}
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
            >
              Start Your Free Journey
            </button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                ExpenseTracker
              </div>
              <p className="text-gray-400">
                Smart expense tracking for better financial decisions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Expense Tracking</li>
                <li>Income Management</li>
                <li>Budget Planning</li>
                <li>Visual Reports</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Twitter</li>
                <li>Facebook</li>
                <li>LinkedIn</li>
                <li>Instagram</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ExpenseTracker. All rights reserved.</p>
            <p className="mt-2">Developed by <a href="https://konthamjagan.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-orange-400 transition-colors">Jagan</a></p>
          </div>
        </div>
      </footer>

      {/* Bottom Drawers */}
      <BottomDrawer 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)}
        title="Sign In"
      >
        <Login onSuccess={() => setShowLogin(false)} />
      </BottomDrawer>

      <BottomDrawer 
        isOpen={showRegister} 
        onClose={() => setShowRegister(false)}
        title="Create Account"
      >
        <Register onSuccess={() => setShowRegister(false)} />
      </BottomDrawer>
    </div>
  );
};

export default Landing;