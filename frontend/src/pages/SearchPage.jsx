import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { useMovies, useGenres } from '../hooks/useMovies';
import './SearchPage.css';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const querySearch = searchParams.get('search') || '';
  const queryGenre = searchParams.get('genre') || '';
  const querySort = searchParams.get('sort') || 'newest';
  const queryPage = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(querySearch);
  
  const { genres } = useGenres();
  const { data, loading, error, refetch } = useMovies({
    search: querySearch,
    genre: queryGenre,
    sort: querySort,
    page: queryPage,
    limit: 20
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== querySearch) {
        updateParams({ search: searchInput, page: 1 });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, querySearch]);

  useEffect(() => {
    setSearchInput(querySearch);
  }, [querySearch]);

  const updateParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    setSearchParams(params);
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search movies..." 
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          autoFocus
        />
        
        <div className="filters">
          <select 
            value={queryGenre} 
            onChange={(e) => updateParams({ genre: e.target.value, page: 1 })}
            className="filter-select"
          >
            <option value="">All Genres</option>
            {genres.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          
          <select 
            value={querySort} 
            onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
            className="filter-select"
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>
      
      <div className="search-results">
        {error ? <ErrorState onRetry={refetch} /> :
         loading ? <LoadingSkeleton count={10} /> :
         data?.movies?.length > 0 ? (
           <>
             <div className="results-count">Found {data.pagination?.total} results</div>
             <MovieGrid movies={data.movies} />
             {data.pagination?.pages > 1 && (
               <div className="pagination">
                 <button 
                   disabled={queryPage <= 1}
                   onClick={() => updateParams({ page: queryPage - 1 })}
                 >
                   Prev
                 </button>
                 <span>Page {queryPage} of {data.pagination.pages}</span>
                 <button 
                   disabled={queryPage >= data.pagination.pages}
                   onClick={() => updateParams({ page: queryPage + 1 })}
                 >
                   Next
                 </button>
               </div>
             )}
           </>
         ) : <EmptyState message="No movies found matching your criteria." />}
      </div>
    </div>
  );
};
export default SearchPage;