import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import axios from "./axios";
import "./Row.css";
import movieTrailer from "movie-trailer";

const baseURL = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl,setTrailerUrl] = useState("");
  //A snippet of code which runs based on a specific condition
  useEffect(() => {
    //if we leave the bracket blank it means, run when the row loads, and don't run it again
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);
  //   console.log(movies);
  console.table(movies);

  const opts= {
    height : "390",
    width :"100%",
    playervars : {
        autoplay:1,
    },
  };

  const handleClick = (movie) => {
    if(trailerUrl){
        setTrailerUrl('');
    } else {
        movieTrailer(movie.name || "")
        .then((url) => {
            const urlParams =new URLSearchParams(new URL(url).search);
            setTrailerUrl( urlParams.get('v'));
        }).catch((error) => console.log(error))
    }
  }

  return (
    <div className="row">
      <h2>{title} </h2>
      <div className="row_posters">
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick ={() => handleClick(movie)}
            className={`row_poster ${isLargeRow && 'row_posterLarge'}`}
            src={`${baseURL}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
            alt={movie.name}
          />
        ))}
      </div>
         {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
