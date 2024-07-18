export default function MovieCard({currentItems}){
    return  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {currentItems.map(movie => (
      <div key={movie.id} className="bg-gray-200 p-4 rounded-md shadow-md text-gray-900">
        <img src={movie.movieImg} alt="thumbnail" className="w-full h-64 object-cover rounded-md mb-4" />
        <h3 className="text-lg font-semibold">{movie.title}</h3>
        <p className="text-sm">Release Year: {movie.release_date}</p>
        <p className="text-sm">Author Name: {movie.authorName}</p>
        <p className="text-sm">Characters: {movie.characters?.join(', ')}</p>
        <p className="text-sm">Language: {movie.language?.join(', ')}</p>
        <p className="text-sm">Average Rating: {movie.avgRating}</p>
        <p className="text-sm">Ratings Count: {movie.rating1}, {movie.rating2}, {movie.rating3}, {movie.rating4}, {movie.rating5}</p>
      </div>
    ))}
  </div>
}