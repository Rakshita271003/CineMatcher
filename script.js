const API_KEY = '9cfd479ae86b3dfdbe351d288e87295b' ; // Replace with your TMDb API key
const BASE_URL = 'https://api.themoviedb.org/3';

document.getElementById("recommend-btn").addEventListener("click", function () {
    const movieInput = document.getElementById("movie-input").value.trim();

    if (movieInput === "") {
        alert("Please enter a movie name.");
        return;
    }

    searchMovie(movieInput);
});

function searchMovie(query) {
    fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const movieId = data.results[0].id; // Get the ID of the first matching movie
                fetchMovieDetails(movieId);
            } else {
                document.getElementById("recommendations").innerHTML = "<p>No recommendations found.</p>";
            }
        })
        .catch(error => {
            console.error("Error searching for movie:", error);
            document.getElementById("recommendations").innerHTML = "<p>Failed to fetch movie recommendations.</p>";
        });
}

function fetchMovieDetails(movieId) {
    fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
            const genres = data.genres.map(genre => genre.id); // Extract genre IDs
            fetchGenreRecommendations(genres);
        })
        .catch(error => {
            console.error("Error fetching movie details:", error);
            document.getElementById("recommendations").innerHTML = "<p>Failed to fetch movie details.</p>";
        });
}

function fetchGenreRecommendations(genreIds) {
    const genreIdsParam = genreIds.join(','); // Convert genre IDs into a comma-separated string

    fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreIdsParam}&sort_by=popularity.desc`)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                displayRecommendations(data.results);
            } else {
                document.getElementById("recommendations").innerHTML = "<p>No recommendations found for this genre.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching genre-based recommendations:", error);
            document.getElementById("recommendations").innerHTML = "<p>Failed to fetch movie recommendations.</p>";
        });
}

function displayRecommendations(movies) {
    const recommendationsContainer = document.getElementById("recommendations");
    recommendationsContainer.innerHTML = "";

    movies.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        // Construct genre names from the genres array (if available)
        const genres = movie.genre_ids ? movie.genre_ids.join(", ") : "Unknown Genres";

        // Use movie.poster_path with a fallback image if no poster is available
        const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : "https://via.placeholder.com/220x300?text=No+Image";

        movieCard.innerHTML = `
            <img src="${posterUrl}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p><strong>Release Date:</strong> ${movie.release_date}</p>
            <p><strong>Genres:</strong> ${genres}</p>
            <p><strong>Overview:</strong> ${movie.overview}</p>
            <p><strong>Rating:</strong> ${movie.vote_average} / 10 (${movie.vote_count} votes)</p>
        `;

        recommendationsContainer.appendChild(movieCard);
    });
}
