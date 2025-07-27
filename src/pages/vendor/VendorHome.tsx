import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Phone, Mail, MessageSquare } from 'lucide-react';

const offers = [
  { title: '10% Off on First Order!', description: 'Get 10% off when you place your first order today.' },
  { title: 'Free Delivery', description: 'Enjoy free delivery on orders above ₹500.' },
];

const popularProducts = [
  { name: 'Fresh Tomatoes', description: 'Best quality tomatoes from local farms.' },
  { name: 'Paneer', description: 'Soft and fresh paneer for your recipes.' },
  { name: 'Masala Mix', description: 'Spicy masala mix for street food.' },
];

const VendorHome: React.FC = () => {
  const { userData } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const username = userData?.email ? userData.email.split('@')[0] : null;

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, 'feedback'), {
        userId: userData?.uid,
        email: userData?.email,
        feedback,
        role: 'vendor',
        createdAt: new Date(),
      });
      setSubmitSuccess(true);
      setFeedback('');
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowFeedback(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200">
      <div className="flex-grow">
        <div className="max-w-full mx-auto px-0 py-8">
          <h1 className="text-4xl font-extrabold text-indigo-800 mb-2 text-center drop-shadow-lg animate-fade-in">
            Welcome, {username || userData?.name || 'Vendor'}!
          </h1>
          <div className="text-lg text-gray-600 mb-8 text-center">to Street Food Hub</div>
          
          {/* Offers Section */}
          <div className="w-full mb-8">
            <h2 className="text-2xl font-bold text-yellow-600 mb-4 text-center animate-bounce">🔥 Offers for You</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer, idx) => (
                <li
                  key={idx}
                  className="bg-gradient-to-r from-yellow-100 via-white to-yellow-50 text-gray-900 rounded-xl p-6 shadow-lg border-2 border-yellow-400 flex flex-col items-center justify-center animate-fade-in"
                  style={{ animation: `fadeIn 1s ease ${idx * 0.3}s both` }}
                >
                  <div className="font-extrabold text-xl mb-2 drop-shadow-lg text-yellow-700">{offer.title}</div>
                  <div className="text-gray-700 text-base font-medium text-center">{offer.description}</div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Popular Products Section */}
          <div className="w-full mb-8">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">🌟 Popular Products</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {popularProducts.map((product, idx) => (
                <li key={idx} className="bg-white border-2 border-indigo-200 rounded-xl p-6 shadow-md flex flex-col items-center justify-center hover:scale-105 transition-transform">
                  <div className="font-bold text-lg text-indigo-800 mb-1">{product.name}</div>
                  <div className="text-gray-600 text-base text-center">{product.description}</div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 mt-8 w-full justify-center">
            <Link to="/vendor/dashboard" className="w-full sm:w-auto bg-indigo-700 text-white px-8 py-4 rounded-xl shadow-lg hover:bg-indigo-800 text-xl font-bold text-center transition-all duration-300">
              Browse Products
            </Link>
            <Link to="/vendor/orders" className="w-full sm:w-auto bg-yellow-500 text-white px-8 py-4 rounded-xl shadow-lg hover:bg-yellow-600 text-xl font-bold text-center transition-all duration-300">
              View Orders
            </Link>
          </div>
        </div>
      </div>

      {/* Compact Footer */}
      <footer className="bg-gray-800 text-white py-4 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Phone className="text-indigo-300" size={18} />
            <Mail className="text-indigo-300" size={18} />
            <span className="text-sm">support@streetfoodhub.com</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowFeedback(!showFeedback)}
              className="flex items-center text-sm hover:text-indigo-300 transition-colors"
            >
              <MessageSquare className="mr-2" size={16} />
              {showFeedback ? 'Close Feedback' : 'Give Feedback'}
            </button>
            <span className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Street Food Hub</span>
          </div>
        </div>

        {/* Feedback Form */}
        {showFeedback && (
          <div className="container mx-auto mt-4 bg-gray-700 rounded-lg p-4">
            {submitSuccess ? (
              <div className="text-green-400 text-center">Thank you for your feedback!</div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="flex flex-col space-y-2">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Your feedback..."
                  className="w-full p-2 rounded text-gray-800 text-sm"
                  rows={2}
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm self-end disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Submit'}
                </button>
              </form>
            )}
          </div>
        )}
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease both;
        }
        .animate-bounce {
          animation: bounce 1s infinite alternate;
        }
      `}</style>
    </div>
  );
};

export default VendorHome;