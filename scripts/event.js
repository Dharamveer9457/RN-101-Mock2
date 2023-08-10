const categoryFilter = document.querySelector("#event-category-filter");
const priceSort = document.querySelector("#price-sort");
const eventBox = document.querySelector("#eventCardsBox");

categoryFilter.addEventListener('change',filterEvents);
priceSort.addEventListener('change', sortEvents);

// Fetching data from api
async function fetchEvents(){
    try {
        let res = await fetch("https://rn-101-mock2.onrender.com/events");
        let data = await res.json();
        console.log(data)
        // renderEvents(data)
            return data;
    } catch (error) {
        console.log(error)
    }
}

function renderEvents(data){
    
    eventBox.innerHTML = "";

    data.forEach((el)=>{
        const card = document.createElement("div");
        card.classList.add('eventCard');

        card.innerHTML = `
        <img src="${el.poster}" alt="${el.name}">
        <h2>${el.name}</h2>
        <p>${el.description}</p>
        <p>Date : ${el.date}</p>
        <p>Location : ${el.location}</p>
        <p>Category : ${el.category}</p>
        <h3>Price : ${el.price}</h3>`;

        eventBox.append(card);
    })
}

// Filter events
async function filterEvents(){
    const selectedCategory = categoryFilter.value;
    const events = await fetchEvents();
    const filteredEvents = selectedCategory ? events.filter(el => el.category===selectedCategory) : events;
    renderEvents(filteredEvents);

}

// Sort Events
async function sortEvents(){
    const sortPrice = priceSort.value;
    const events = await fetchEvents();

    const sortedPriceEvents = events.slice().sort((a,b)=>{
        if(sortPrice === 'asc'){
            return a.price - b.price;
        }else if(sortPrice === 'desc'){
            return b.price - a.price;
        }else{
            return events;
        }
    });

    renderEvents(sortedPriceEvents);
}


window.onload = () =>{
    filterEvents()
}