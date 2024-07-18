import { useState } from "react"
import MovieCard from "./MovieCard";
import SkeletionCard from "./SkeletonCard";
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
        <MovieCard currentItems={currentItems} />
        <div className="flex justify-center mt-4">
          {renderPagination()}
        </div>
      </div>}

    {
        fetching == fetchStatus.loading && <div className="p-4 animate-pulse">
            <SkeletionCard itemsPerPage={itemsPerPage} />
      
        <div className="flex justify-center mt-4 h-10 bg-gray-300 rounded">
        </div>
      </div>
    }
  </div>
}


