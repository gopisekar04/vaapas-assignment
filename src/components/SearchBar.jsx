import { useState } from "react"
const openLibraryApi = import.meta.env.VITE_OPEN_LIB_API;
const dogImgAPi = import.meta.env.VITE_DOG_IMG_API
import { v4 as uuidv4 } from 'uuid';

const fetchStatus = {
    initial: 'INITIAL',
    loading: 'LOADING',
    success: 'SUCCESS',
    failure: 'FAILURE'
}

export default function SearchBar(){
    
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);    
    const [movies, setMovies] = useState([]);
    const [fetching, setfetching] = useState(fetchStatus.initial)
    const itemsPerPage = 10;

  const generateRandomImage = async() => {
    const res = await fetch(dogImgAPi);
    if(res.ok){
        const jsonData = await res.json();
        const { message } = jsonData
        return message;
  }
}

  const handleSearch = async (e) => {    
    e.preventDefault();
    setfetching(fetchStatus.loading)    
    if (query.trim() === '') return;

    try {
        const queryData = query.split(' ').join('+')            
      const response = await fetch(`${openLibraryApi}?q=${query}`);      
      if(response.ok){
        const data = await response.json();            
        const updatedData = await Promise.all(data.docs.map(async (eachMovie) => {
            const imageUrl = await generateRandomImage();
            return {
                id: uuidv4(),
                movieImg: imageUrl,
                title: eachMovie.title,
                authorName: eachMovie.author_name,
                characters: eachMovie.person,
                year: eachMovie.first_publish_year,
                language: eachMovie.language,
                avgRating: eachMovie.ratings_average,
                rating1: eachMovie.ratings_count_1,
                rating2: eachMovie.ratings_count_2,
                rating3: eachMovie.ratings_count_3,
                rating4: eachMovie.ratings_count_4,
                rating5: eachMovie.ratings_count_5
            };
        }));
        setCurrentPage(1) ;
        setMovies(updatedData)
        setQuery("");
        setfetching(fetchStatus.success)    
        console.log(updatedData);    
      }else{
        setfetching(fetchStatus.failure)    
      }      
      

    } catch (error) {
      console.error('Error fetching the movies:', error);
    }
  };

  const indexOfLastItem = currentPage* itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = movies.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(movies.length / itemsPerPage);

  const renderPagination = () => {
    const pageButtons = [];
    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 mx-1 bg-gray-200 rounded-md hover:bg-gray-300 ${currentPage === i ? 'bg-gray-300' : ''}`}
        >
          {i}
        </button>
      );
    }
    return pageButtons;
  };

    return <div className="min-h-screen bg-gray-100 text-gray-900">
    <header className="flex justify-center items-center h-20 bg-white shadow-md">
      <form className="flex space-x-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
          className="w-80 p-2 rounded-md text-gray-900 focus:outline-none border border-gray-300"
        />
        <button onClick={handleSearch} className="p-2 bg-gray-200 rounded-md hover:bg-gray-300">
          Search
        </button>
      </form>
    </header>
    {fetching == fetchStatus.success&& <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
        <div className="flex justify-center mt-4">
          {renderPagination()}
        </div>
      </div>}

    {
        fetching == fetchStatus.loading && <div className="p-4 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="bg-gray-200 p-4 rounded-md shadow-md text-gray-900">
            <div className="w-full h-64 bg-gray-300 rounded-md mb-4"></div>
            <div className="h-4 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 w-2/4 mb-2"></div>
            <div className="h-3 bg-gray-300 w-full mb-2"></div>
            <div className="h-3 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-3/4 mb-2"></div>
          </div>
          <div className="bg-gray-200 p-4 rounded-md shadow-md text-gray-900">
            <div className="w-full h-64 bg-gray-300 rounded-md mb-4"></div>
            <div className="h-4 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 w-2/4 mb-2"></div>
            <div className="h-3 bg-gray-300 w-full mb-2"></div>
            <div className="h-3 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-3/4 mb-2"></div>
          </div>
          <div className="bg-gray-200 p-4 rounded-md shadow-md text-gray-900">
            <div className="w-full h-64 bg-gray-300 rounded-md mb-4"></div>
            <div className="h-4 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 w-2/4 mb-2"></div>
            <div className="h-3 bg-gray-300 w-full mb-2"></div>
            <div className="h-3 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-3/4 mb-2"></div>
          </div>
          <div className="bg-gray-200 p-4 rounded-md shadow-md text-gray-900">
            <div className="w-full h-64 bg-gray-300 rounded-md mb-4"></div>
            <div className="h-4 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 w-2/4 mb-2"></div>
            <div className="h-3 bg-gray-300 w-full mb-2"></div>
            <div className="h-3 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-3/4 mb-2"></div>
          </div>
          <div className="bg-gray-200 p-4 rounded-md shadow-md text-gray-900">
            <div className="w-full h-64 bg-gray-300 rounded-md mb-4"></div>
            <div className="h-4 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 w-2/4 mb-2"></div>
            <div className="h-3 bg-gray-300 w-full mb-2"></div>
            <div className="h-3 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-3/4 mb-2"></div>
          </div>
          <div className="bg-gray-200 p-4 rounded-md shadow-md text-gray-900">
            <div className="w-full h-64 bg-gray-300 rounded-md mb-4"></div>
            <div className="h-4 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 w-2/4 mb-2"></div>
            <div className="h-3 bg-gray-300 w-full mb-2"></div>
            <div className="h-3 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-3/4 mb-2"></div>
          </div>
          <div className="bg-gray-200 p-4 rounded-md shadow-md text-gray-900">
            <div className="w-full h-64 bg-gray-300 rounded-md mb-4"></div>
            <div className="h-4 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 w-2/4 mb-2"></div>
            <div className="h-3 bg-gray-300 w-full mb-2"></div>
            <div className="h-3 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-3/4 mb-2"></div>
          </div>
          <div className="bg-gray-200 p-4 rounded-md shadow-md text-gray-900">
            <div className="w-full h-64 bg-gray-300 rounded-md mb-4"></div>
            <div className="h-4 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-300 w-2/4 mb-2"></div>
            <div className="h-3 bg-gray-300 w-full mb-2"></div>
            <div className="h-3 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-300 w-3/4 mb-2"></div>
          </div>
        </div>
      
        <div className="flex justify-center mt-4 h-10 bg-gray-300 rounded">
        </div>
      </div>
    }
  </div>
}


// import { useState } from "react";
// import { v4 as uuidv4 } from 'uuid';

// const openLibraryApi = import.meta.env.VITE_OPEN_LIB_API;
// const dogImgAPi = import.meta.env.VITE_DOG_IMG_API;

// const fetchStatus = {
//   initial: 'INITIAL',
//   loading: 'LOADING',
//   success: 'SUCCESS',
//   failure: 'FAILURE'
// };

// export default function SearchBar() {
//   const [query, setQuery] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [movies, setMovies] = useState([]);
//   const [fetching, setFetching] = useState(fetchStatus.initial);
//   const itemsPerPage = 10;

//   const generateRandomImage = async () => {
//     try {
//       const res = await fetch(dogImgAPi);
//       if (res.ok) {
//         const jsonData = await res.json();
//         const { message } = jsonData;
//         return message;
//       } else {
//         throw new Error('Failed to fetch image');
//       }
//     } catch (error) {
//       console.error('Error fetching the image:', error);
//       return 'https://via.placeholder.com/200x300'; // Fallback image in case of error
//     }
//   };

//   const handleSearch = async (e) => {
//     // e.preventDefault();
//     // setFetching(fetchStatus.loading);
    
//     if (query.trim() === '') {      
//       return;
//     }

//     try {
//       const queryData = query.split(' ').join('+');
//       const response = await fetch(`${openLibraryApi}?q=${queryData}`);
      
//       if (response.ok) {
//         const data = await response.json();
//         const updatedData = await Promise.all(data.docs.map(async (eachMovie) => {
//           const movieImg = await generateRandomImage();
//           return {
//             id: uuidv4(),
//             movieImg,
//             title: eachMovie.title,
//             authorName: eachMovie.author_name,
//             characters: eachMovie.person,
//             release_date: eachMovie.first_publish_year,
//             language: eachMovie.language,
//             avgRating: eachMovie.ratings_average,
//             rating1: eachMovie.ratings_count_1,
//             rating2: eachMovie.ratings_count_2,
//             rating3: eachMovie.ratings_count_3,
//             rating4: eachMovie.ratings_count_4,
//             rating5: eachMovie.ratings_count_5
//           };
//         }));
        
//         setMovies(updatedData);
//         setCurrentPage(1);
//         setFetching(fetchStatus.success);
//         console.log(updatedData);
//       } else {
//         setFetching(fetchStatus.failure);
//       }
//     } catch (error) {
//       console.error('Error fetching the movies:', error);
//       setFetching(fetchStatus.failure);
//     }
//   };

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = movies.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(movies.length / itemsPerPage);

//   const renderPagination = () => {
//     const pageButtons = [];
//     for (let i = 1; i <= totalPages; i++) {
//       pageButtons.push(
//         <button
//           key={i}
//           onClick={() => setCurrentPage(i)}
//           className={`px-4 py-2 mx-1 bg-gray-200 rounded-md hover:bg-gray-300 ${currentPage === i ? 'bg-gray-300' : ''}`}
//         >
//           {i}
//         </button>
//       );
//     }
//     return pageButtons;
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 text-gray-900">
//       <header className="flex justify-center items-center h-20 bg-white shadow-md">
//         <form onSubmit={handleSearch} className="flex space-x-4">
//           <input
//             type="text"
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search for a movie..."
//             className="w-80 p-2 rounded-md text-gray-900 focus:outline-none border border-gray-300"
//           />
//           <button type="submit" className="p-2 bg-gray-200 rounded-md hover:bg-gray-300">
//             Search
//           </button>
//         </form>
//       </header>

//       {fetching === fetchStatus.success && (
//         <div className="p-4">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {currentItems.map(movie => (
//               <div key={movie.id} className="bg-gray-200 p-4 rounded-md shadow-md text-gray-900">
//                 <img src={movie.movieImg} alt="thumbnail" className="w-full h-64 object-cover rounded-md mb-4" />
//                 <h3 className="text-lg font-semibold">{movie.title}</h3>
//                 <p className="text-sm">Release Year: {movie.release_date}</p>
//                 <p className="text-sm">Author Name: {movie.authorName}</p>
//                 <p className="text-sm">Characters: {movie.characters?.join(', ')}</p>
//                 <p className="text-sm">Language: {movie.language}</p>
//                 <p className="text-sm">Average Rating: {movie.avgRating}</p>
//                 <p className="text-sm">Ratings Count: {movie.rating1}, {movie.rating2}, {movie.rating3}, {movie.rating4}, {movie.rating5}</p>
//               </div>
//             ))}
//           </div>
//           <div className="flex justify-center mt-4">
//             {renderPagination()}
//           </div>
//         </div>
//       )}

//       {fetching === fetchStatus.loading && (
//         <div className="p-4 animate-pulse">
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {[...Array(itemsPerPage)].map((_, index) => (
//               <div key={index} className="bg-gray-200 p-4 rounded-md shadow-md text-gray-900">
//                 <div className="w-full h-64 bg-gray-300 rounded-md mb-4"></div>
//                 <div className="h-4 bg-gray-300 w-1/2 mb-2"></div>
//                 <div className="h-3 bg-gray-300 w-3/4 mb-2"></div>
//                 <div className="h-3 bg-gray-300 w-2/4 mb-2"></div>
//                 <div className="h-3 bg-gray-300 w-full mb-2"></div>
//                 <div className="h-3 bg-gray-300 w-1/2 mb-2"></div>
//                 <div className="h-3 bg-gray-300 w-1/2 mb-2"></div>
//                 <div className="h-3 bg-gray-300 w-3/4 mb-2"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {fetching === fetchStatus.failure && (
//         <div className="p-4">
//           <p className="text-red-500">Failed to fetch movies. Please try again later.</p>
//         </div>
//       )}
//     </div>
//   );
// }
