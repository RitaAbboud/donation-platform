import React from "react";
import { Phone, MapPin, Tag, ExternalLink } from "lucide-react";

const RequestCard = ({ request }) => {
  // Destructuring for cleaner code
  const { categories, description, phone, location } = request;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Category and User Info */}
      <div className="flex justify-between items-start mb-4">
       

        <div className="flex items-center space-x-1 text-[#e25e2d] bg-indigo-50 px-3 py-1 rounded-full">
          <Tag size={14} />
          <span className="text-xs font-semibold"> {categories?.name}</span>
        </div>
      </div>

      {/* Description Area */}
      <div className="mb-6">
        <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">
          Description
        </h4>
        <p className="text-slate-700 text-sm leading-relaxed min-h-[60px]">
          {description || "No description provided for this request."}
        </p>
      </div>

      {/* Details List */}
      <div className="space-y-3">
        <div className="flex items-center text-slate-600 text-sm">
          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center mr-3">
            <MapPin size={16} className="text-red-500" />
          </div>
          <span className="font-medium">{location}</span>
        </div>

        <div className="flex items-center text-slate-600 text-sm">
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center mr-3">
            <Phone size={16} className="text-green-500" />
          </div>
          <span className="font-mono">{phone}</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => (window.location.href = `https://wa.me/${phone}`)}
        className="w-full mt-6 bg-[#e25e2d] text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#d14d1c] active:scale-95 transition-all"
      >
        Contact Requestor
        <ExternalLink size={16} />
      </button>
    </div>
  );
};

export default RequestCard;
