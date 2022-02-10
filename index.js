function getUserMovie() {
    let url = 'http://www.omdbapi.com/?apikey=11ff0cf1&s='
    let movie = document.getElementById('movieName').value; // get movie the user types in
    url += movie;
    debounce(url);
}

let run;
function debounce(url) {
    if(run) {
        clearTimeout(run);
    }
    
    run = setTimeout(() => {
        getMovie(url);
    },1000)
}

async function getMovie(url) {
    let res = await fetch(url);
    let data = await res.json();
    if (data.Response == "True") {
        showResults(data);
    } else {
        document.getElementById('search-results').textContent = 'No results';
    }
}

function showResults(data) {
    document.getElementById('image').src = '';
    document.getElementById('title').textContent = null;
    document.getElementById('rating').textContent = null;
    document.getElementById('year').textContent = null;
    document.getElementById('recommend').src = '';

    document.getElementById('search-results').innerHTML = null;  // removing any previous search results
    data = data.Search;
    data.forEach((el) => {
        let image = document.createElement('img');
        let title = document.createElement('p');
        let div = document.createElement('div');

        if (el.Poster == 'N/A') {
            image.src = 'https://www.utvolshop.com/sca-dev-2020-1/img/no_image_available.jpeg'; // display unavailable image
        } else {
            image.src = el.Poster;
        }
        
        title.textContent = el.Title;
        div.append(image,title);

        div.setAttribute('id',el.imdbID); // setting id as imdbID
        div.setAttribute('onclick',`displayData(this.id)`); // passing id as parameter to retrieve data for display when user clicks on the movie they wanna watch
        document.getElementById('search-results').append(div);
    })
}

async function displayData(id) {
    document.getElementById('search-results').innerHTML = null;
    let url = `http://www.omdbapi.com/?apikey=11ff0cf1&i=${id}`;
    let res = await fetch(url);
    let data = await res.json();
    
    document.getElementById('image').setAttribute('src',data['Poster']);
    document.getElementById('title').textContent = data['Title'];
    let rating = "IMDB rating: " + data['imdbRating'];
    document.getElementById('rating').textContent = rating;
    let year = "Released in: " + data['Year'];
    document.getElementById('year').textContent = year;

    // setting a recommend icon if rating is greater than 8.5
    if (data['imdbRating'] > 8.5) {
        document.getElementById('recommend').setAttribute('src','https://cdn-icons-png.flaticon.com/512/411/411724.png');
    } else {
        document.getElementById('recommend').setAttribute('src','');
    }
}
