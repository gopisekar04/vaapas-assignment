export default function SkeletionCard({itemsPerPage}){
    return <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {[...Array(itemsPerPage)].map((_, index) => (
      <div key={index} className="bg-gray-200 p-4 rounded-md shadow-md text-gray-900">
        <div className="w-full h-64 bg-gray-300 rounded-md mb-4"></div>
        <div className="h-4 bg-gray-300 w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-300 w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 w-2/4 mb-2"></div>
        <div className="h-3 bg-gray-300 w-full mb-2"></div>
        <div className="h-3 bg-gray-300 w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-300 w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-300 w-3/4 mb-2"></div>
      </div>
    ))}
  </div>
}