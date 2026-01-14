import Image from 'next/image';
import { MapPin, Phone, Calendar } from 'lucide-react';

export default function ItemCard({ item }) {

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };


  const formatCost = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  return (
    <div className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* 1. Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <Image
          src={item.image_url || '/api/placeholder/400/320'} 
          alt={item.description || 'Item image'}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* 2. Content Section */}
      <div className="p-4">
       
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-bold text-green-700">
            {formatCost(item.cost)}
          </span>
          <div className="flex items-center text-xs text-slate-500">
            <Calendar className="mr-1 h-3 w-3" />
            {formatDate(item.created_at)}
          </div>
        </div>

        {/* Description */}
        <h3 className="mb-4 line-clamp-2 text-sm font-medium text-slate-800">
          {item.description}
        </h3>

        <hr className="my-3 border-slate-100" />

        {/* Footer: Location and Phone */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-slate-600">
            <MapPin className="mr-2 h-4 w-4 text-slate-400" />
            {item.location}
          </div>
          <div className="flex items-center text-sm text-slate-600">
            <Phone className="mr-2 h-4 w-4 text-slate-400" />
            {item.phone_number}
          </div>
        </div>
      </div>
    </div>
  );
}