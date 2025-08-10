import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, XCircle } from 'lucide-react';
import axios from 'axios';

// Configure axios base URL (adjust according to your backend URL)


const SubmitQuote = () => {
  const { queryId } = useParams();
  const navigate = useNavigate();
  const [quoteItems, setQuoteItems] = useState([
    { country: '', hours: '', rate: '', total: 0 }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateQuoteItem = (index, field, value) => {
    const updatedItems = [...quoteItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    if (field === 'hours' || field === 'rate') {
      const hours = field === 'hours' ? value : updatedItems[index].hours;
      const rate = field === 'rate' ? value : updatedItems[index].rate;
      updatedItems[index].total = hours * rate;
    }
    
    setQuoteItems(updatedItems);
  };

  const addQuoteItem = () => {
    setQuoteItems([...quoteItems, { country: '', hours: 0, rate: 0, total: 0 }]);
  };

  const calculateTotal = () => {
    return quoteItems.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const handleSubmit = async () => {
    // Validate form
    if (quoteItems.some(item => !item.country || item.hours <= 0 || item.rate <= 0)) {
      setError('Please fill in all fields with valid values');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/provider/quotes/${queryId}`,
        {
          breakdown: quoteItems
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Quote submitted successfully:', response.data);
      

      navigate('/service-provider', { 
        state: { message: 'Quote submitted successfully!' } 
      });
      
    } catch (error) {
      console.error('Error submitting quote:', error);
      
      if (error.response?.status === 401) {
        setError('Authentication required. Please log in again.');
      } else if (error.response?.status === 404) {
        setError('Query not found.');
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Failed to submit quote. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/service-provider')}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
        >
          <ChevronRight className="w-5 h-5 rotate-180 mr-2" />
          Back to Dashboard
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Submit Quote</h1>
          <p className="text-xl text-gray-600">Query ID: {queryId}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {quoteItems.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  value={item.country}
                  onChange={(e) => updateQuoteItem(index, 'country', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., United States"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
                <input
                  type="number"
                  value={item.hours}
                  onChange={(e) => updateQuoteItem(index, 'hours', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  min="0"
                  step="0.5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rate ($/hr)</label>
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => updateQuoteItem(index, 'rate', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="flex items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                  <div className="px-3 py-2 bg-gray-50 border rounded-md">
                    ${item.total.toFixed(2) || '0.00'}
                  </div>
                </div>
                {quoteItems.length > 1 && (
                  <button
                    onClick={() => setQuoteItems(quoteItems.filter((_, i) => i !== index))}
                    className="ml-2 p-2 text-red-600 hover:text-red-800"
                    type="button"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={addQuoteItem}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400"
            type="button"
          >
            + Add Another Country
          </button>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total Quote:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => navigate('/service-provider')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
              type="button"
            >
              {loading ? 'Submitting...' : 'Submit Quote'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitQuote;