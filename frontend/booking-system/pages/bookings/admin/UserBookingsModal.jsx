import React from "react";
import { X, Loader2, Calendar, Clock, User, Mail, FileText, CheckCircle, XCircle, ClockIcon } from "lucide-react";

const UserBookingsModal = ({ 
  isOpen, 
  onClose, 
  booking,
  loading = false, 
  error = "" 
}) => {
  if (!isOpen || !booking) return null;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusInfo = (status) => {
    const statusLower = status?.toLowerCase();
    
    switch (statusLower) {
      case "accepted":
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          classes: "bg-green-100 text-green-800 border-green-200",
          label: "Accepted"
        };
      case "rejected":
        return {
          icon: <XCircle className="h-5 w-5 text-red-500" />,
          classes: "bg-red-100 text-red-800 border-red-200",
          label: "Rejected"
        };
      case "pending":
        return {
          icon: <ClockIcon className="h-5 w-5 text-yellow-500" />,
          classes: "bg-yellow-100 text-yellow-800 border-yellow-200",
          label: "Pending"
        };
      default:
        return {
          icon: <ClockIcon className="h-5 w-5 text-gray-500" />,
          classes: "bg-gray-100 text-gray-800 border-gray-200",
          label: "Unknown"
        };
    }
  };

  const statusInfo = getStatusInfo(booking.status);
  
  const userName = booking.name || booking.userName || booking.user?.name || "Unknown User";
  const userEmail = booking.email || booking.userEmail || booking.user?.email || "No email";
  const bookingId = booking._id || booking.id || "N/A";
  const serviceName = booking.serviceName || booking.service || "N/A";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Booking Details
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-2 ${statusInfo.classes}`}>
                {statusInfo.icon}
                {statusInfo.label}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
              <p className="text-gray-600">Loading booking details...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-600 text-lg">⚠️</span>
                </div>
                <div>
                  <p className="font-medium text-red-800">Error loading booking</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-6">
              <div className="space-y-4">

                {/* User Information */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">User Information</h3>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-xl">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{userName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{userEmail}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time Information */}
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-5 w-5" />
                        <span className="font-medium">Start Time</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatDate(booking.startTime)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-5 w-5" />
                        <span className="font-medium">End Time</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatDate(booking.endTime)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-4">
                  {/* Status Details */}
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Booking Status</h3>
                    <div className="flex items-center gap-3">
                      {statusInfo.icon}
                      <div>
                        <p className="font-medium text-gray-900">{statusInfo.label}</p>
                        <p className="text-sm text-gray-600">
                          Updated: {formatDate(booking.updatedAt || booking.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {booking.notes && (
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
                      </div>
                      <p className="text-gray-700 bg-white p-3 rounded border">
                        {booking.notes}
                      </p>
                    </div>
                  )}

                  {booking.location && (
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
                      <p className="text-gray-700">{booking.location}</p>
                    </div>
                  )}

                  {booking.price && (
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Price</h3>
                      <p className="text-2xl font-bold text-gray-900">
                        ${parseFloat(booking.price).toFixed(2)}
                      </p>
                    </div>
                  )}

                  {booking.paymentStatus && (
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Status</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.paymentStatus === 'paid' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}>
                        {booking.paymentStatus.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-500 space-y-1">
                  <p>Created: {formatDate(booking.createdAt)}</p>
                  {booking.updatedAt && booking.updatedAt !== booking.createdAt && (
                    <p>Last Updated: {formatDate(booking.updatedAt)}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6">
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                console.log("Edit booking:", booking);
              }}
              className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg font-medium transition-colors"
            >
              Edit Booking
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBookingsModal;