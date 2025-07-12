'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle,
  Star,
  MessageSquare,
  User,
  Calendar,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Testimonial {
  id: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  productName?: string;
  orderId?: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    filterTestimonials();
  }, [testimonials, searchTerm, statusFilter, ratingFilter]);

  const fetchTestimonials = async () => {
    try {
      // Mock data - replace with actual API call
      const mockTestimonials: Testimonial[] = [
        {
          id: '1',
          customerName: 'Sarah Johnson',
          customerEmail: 'sarah@example.com',
          rating: 5,
          comment: 'Amazing quality! The polaroid set exceeded my expectations. Perfect for gifts.',
          status: 'approved',
          createdAt: '2024-01-15',
          productName: 'Custom Polaroid Set',
          orderId: 'ORD-001'
        },
        {
          id: '2',
          customerName: 'Mike Chen',
          customerEmail: 'mike@example.com',
          rating: 4,
          comment: 'Great phone case, fits perfectly and looks stylish.',
          status: 'pending',
          createdAt: '2024-01-14',
          productName: 'Vintage Phone Case',
          orderId: 'ORD-002'
        },
        {
          id: '3',
          customerName: 'Emily Davis',
          customerEmail: 'emily@example.com',
          rating: 3,
          comment: 'The gift box was nice but shipping took longer than expected.',
          status: 'rejected',
          createdAt: '2024-01-13',
          productName: 'Handmade Gift Box',
          orderId: 'ORD-003'
        },
        {
          id: '4',
          customerName: 'David Wilson',
          customerEmail: 'david@example.com',
          rating: 5,
          comment: 'Outstanding craftsmanship! Will definitely order again.',
          status: 'approved',
          createdAt: '2024-01-12',
          productName: 'Custom Polaroid Set',
          orderId: 'ORD-004'
        }
      ];
      setTestimonials(mockTestimonials);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setLoading(false);
    }
  };

  const filterTestimonials = () => {
    let filtered = testimonials;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(testimonial =>
        testimonial.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.productName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(testimonial => testimonial.status === statusFilter);
    }

    // Rating filter
    if (ratingFilter !== 'all') {
      const rating = parseInt(ratingFilter);
      filtered = filtered.filter(testimonial => testimonial.rating === rating);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredTestimonials(filtered);
  };

  const updateTestimonialStatus = async (testimonialId: string, newStatus: 'approved' | 'rejected') => {
    try {
      // API call to update testimonial status
      setTestimonials(testimonials.map(testimonial => 
        testimonial.id === testimonialId ? { ...testimonial, status: newStatus } : testimonial
      ));
    } catch (error) {
      console.error('Error updating testimonial status:', error);
    }
  };

  const getStatusColor = (status: Testimonial['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-600">Manage customer feedback and reviews</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Export Reviews
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{testimonials.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {testimonials.filter(t => t.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {testimonials.filter(t => t.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {testimonials.filter(t => t.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search testimonials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          {/* Highlight Top Reviews */}
          <Button
            variant="outline"
            onClick={() => setFilteredTestimonials(testimonials.filter(t => t.rating === 5 && t.status === 'approved'))}
            className="flex items-center"
          >
            <Star className="w-4 h-4 mr-2" />
            Top Reviews
          </Button>
        </div>
      </div>

      {/* Testimonials List */}
      <div className="space-y-4">
        {filteredTestimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{testimonial.customerName}</h3>
                  <p className="text-sm text-gray-500">{testimonial.customerEmail}</p>
                  <div className="flex items-center mt-1">
                    {renderStars(testimonial.rating)}
                    <span className="ml-2 text-sm text-gray-500">({testimonial.rating}/5)</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(testimonial.status)}`}>
                  {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(testimonial.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-700">{testimonial.comment}</p>
              {testimonial.productName && (
                <p className="text-sm text-gray-500 mt-2">
                  Product: {testimonial.productName}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex space-x-2">
                {testimonial.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => updateTestimonialStatus(testimonial.id, 'approved')}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => updateTestimonialStatus(testimonial.id, 'rejected')}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Order: {testimonial.orderId}</span>
                <span>•</span>
                <span>{new Date(testimonial.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 