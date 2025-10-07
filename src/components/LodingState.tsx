// components/LoadingState.tsx
export default function LoadingState() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900">Loading Your Cart</h3>
              <p className="text-gray-600 mt-2">Getting everything ready for you...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }