import React, { useMemo } from 'react';
import HeroSlider from '../components/HeroSlider';
import MovieGrid from '../components/MovieGrid';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import { useMovies, useFeaturedMovies, useGenres } from '../hooks/useMovies';
import './HomePage.css';

const HomePage = () => {
  const { movies: featured, loading: featuredLoading, error: featuredError, refetch: refetchFeatured } = useFeaturedMovies();
  const { data: latestData, loading: latestLoading, error: latestError, refetch: refetchLatest } = useMovies({ sort: 'newest', limit: 12 });
  const { data: popularData, loading: popularLoading, error: popularError, refetch: refetchPopular } = useMovies({ sort: 'popular', limit: 12 });
  
  const { genres } = useGenres();

  return (
    <div className="home-page">
      {featuredLoading ? <div style={{height: '70vh'}}><LoadingSkeleton count={1}/></div> : 
       featuredError ? <ErrorState onRetry={refetchFeatured} /> :
       <HeroSlider movies={featured} />}
       
      <div className="home-content">
        {latestError ? <ErrorState onRetry={refetchLatest} /> :
         latestLoading ? <LoadingSkeleton count={6} /> :
         <MovieGrid title="Latest Uploads" movies={latestData?.movies} seeAllLink="/search?sort=newest" />}
         
        {popularError ? <ErrorState onRetry={refetchPopular} /> :
         popularLoading ? <LoadingSkeleton count={6} /> :
         <MovieGrid title="Popular" movies={popularData?.movies} seeAllLink="/search?sort=popular" />}
      </div>
    </div>
  );
};
export default HomePage;