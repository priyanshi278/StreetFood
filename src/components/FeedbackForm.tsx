// src/components/FeedbackForm.tsx
import React, { useState } from 'react';
import { db } from '../firebase/config'; // adjust path as needed
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface FeedbackFormProps {
  userId: string;
  role: 'vendor' | 'supplier';
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ userId, role }) => {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'feedbacks'), {
        userId,
        role,
        feedback,
        createdAt: serverTimestamp(),
      });
      setFeedback('');
      alert('Feedback submitted!');
    } catch (error) {
      console.error('Error adding feedback:', error);
      alert('Error submitting feedback.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow">
      <h2 className="text-lg font-semibold mb-2">Submit Feedback</h2>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        rows={4}
        placeholder="Enter your feedback..."
      ></textarea>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
};

export default FeedbackForm;
