class APIService {
    constructor(link) {
        this.link = link;
    }

    fetchCats(callback) {
        fetch(this.link)
        .then(response => {
            if (!response.ok) {
                throw Error(`Error: ${response.status}`);
            }
            return response.json();
        }).then(data => {
            callback(data);
        });
    }
}

class DataManager {
    constructor(link) {
        this.apiService = new APIService(link);
        this.catFacts = [];
        this.picURLs = [];
    }

    saveFacts() {
        this.apiService.fetchCats(
            (data) => {
                this.catFacts = data.all;
                setTimeout(() => 
                { console.log(this.catFacts) }, 5000)
            })
    }

    getRnadomInt(min, max) {
        return Math.floor(Math.random() * (max-min)) + min;
    }

    displayNewFact() {
        const jumbotrone = document.querySelector('.lead');
        let randomIndex;
        let randomFact;
        randomIndex = this.getRnadomInt(0, this.catFacts.length);
        randomFact = this.catFacts[randomIndex].text;

        // now showing maybe change it 
        if (!randomFact) {
            jumbotrone.innerHTML += `
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            `
        }
        jumbotrone.innerHTML = randomFact;
    }

    setInitialPics(newArray) {
        let carousel = document.querySelector('.carousel-inner');
        this.picURLs = newArray;
        this.picURLs.forEach(element => {
            console.log('URL IS', element);
            carousel.innerHTML += `
            <div class="carousel-item">
                <img src="${element}" class="d-block w-100" alt="cat-picture">
            </div>
          `;
        });
        return;
    }

    savePic() {
        this.apiService.fetchCats(
            (data) => {
                this.picURLs.push(data['0'].url);
            //     setTimeout(() => 
            //     { console.log(this.picURLs) }, 5000)
            });
        }

    saveManyPics(limit) {
        this.clearCatURLs();
        while (limit > 0) {
            this.savePic()
            limit -= 1;
        }
        console.log('ARRAY IS', this.picURLs);
        this.fillCarousel()

    }

    fillCarousel() {
        let carousel;
        console.log('fireed fillCarousel', this.picURLs);
        carousel = document.querySelector('.carousel-inner');
        // carousel.parentElement.innerHTML = `
        // <div class="carousel-item active">
        // <img src="cat.jpg" class="d-block w-100" alt="cat-picture">
        // </div>
        // `
        // carousel = document.querySelector('.carousel-inner');
        this.picURLs.forEach(element => {
            console.log('URL IS', element);
            carousel.innerHTML += `
            <div class="carousel-item">
                <img src="${element}" class="d-block w-100" alt="cat-picture">
            </div>
          `;
        });
    }

    clearCatURLs() {
        this.picURLs = [];
    }

}

// fetch facts from API
const catPics = ['cat.jpeg', 'cat1.jpeg', 'cat2.jpeg', 'cat3.jpeg'];
const factLink = 'https://cat-fact.herokuapp.com/facts';
const getCatsFacts = new DataManager(factLink);
getCatsFacts.saveFacts();

//fetch 5 random pics from anotehr API
const picLink = 'https://api.thecatapi.com/v1/images/search';
const getCatPics = new DataManager(picLink);
getCatsFacts.setInitialPics(catPics);


// event listener for clicking jumbotrone
const clickJumbotrone = document.querySelector('#catFacts');
clickJumbotrone.addEventListener('click', () => {
    getCatsFacts.displayNewFact();
});  

// event listener for refreshing random pics
const clickRefreshPic = document.querySelector('#refresh');
clickRefreshPic.addEventListener('click', (event)=> {
    event.preventDefault();
    getCatPics.saveManyPics(5);
});

// add pics to carousel
// let carousel = document.querySelector('.carousel-inner');

// fillCarousel(catPics);

