const eventForm = document.querySelector("#event-form");
const eventTable = document.querySelector("#event-table-body");

eventForm.addEventListener("submit", addEvent);

async function fetchEvents(){
    try {
        let res = await fetch("https://rn-101-mock2.onrender.com/events");
        let data = await res.json();
        console.log(data)
        return data
        
    } catch (error) {
        console.log(error)
    }
}

async function addEvent(e){
    e.preventDefault();

    const eventPoster = document.querySelector("#poster").value;
    const eventName = document.querySelector("#name").value;
    const eventDate = document.querySelector("#eventDate").value;
    const location = document.querySelector("#eventLocation").value;
    const category = document.querySelector("#eventCategory").value;
    const price = document.querySelector("#eventPrice").value;
    const desc = document.querySelector("#desc").value;

    
    const newEvent = {
        poster : eventPoster,
        name : eventName,
        description : desc,
        date : eventDate,
        location : location,
        category : category,
        price : price
    };

    try {
        let res = await fetch("https://rn-101-mock2.onrender.com/events",{
            method : "POST",
            headers : {
                "Content-type":"application/json",
                },
            body : JSON.stringify(newEvent)
            });
        
            if(res.ok){
                alert("New Event added");
                refreshTable()
            }else{
                alert("Error while adding event")
                }
        } catch (error) {
            console.log(error)
        }
}

async function refreshTable(){
    const events = await fetchEvents();

    eventTable.innerHTML="";
 
    events.forEach((el) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${el.name}</td>
            <td>${el.date}</td>
            <td>${el.location}</td>
            <td>${el.category}</td>
            <td>${el.price}</td>
            <td><button class="edit-btn" data-id="${el.id}">Edit</button></td>
            <td><button class="del-btn" data-id="${el.id}">Delete</button></td>
            `;

            eventTable.append(row)
    });

    // Add event listeners to Edit and Delete Button
    const editBtn = document.querySelectorAll(".edit-btn");
    editBtn.forEach(btn => {
        btn.addEventListener("click",editEvent);
    })

    const delBtn = document.querySelectorAll(".del-btn");
    delBtn.forEach(btn => {
        btn.addEventListener("click",deleteEvent);
    })
}

let currentEditEventId = null;
// Edit Event
async function editEvent(e) {
    const eventId = e.target.getAttribute('data-id');
    currentEditEventId = eventId
    openEditDialog(eventId);
}

// Delete Event
async function deleteEvent(e){
    const eventID = e.target.getAttribute('data-id');
    try {
        const res = await fetch(`https://rn-101-mock2.onrender.com/events/${eventID}`,{
            method : "DELETE"
        })

        if(res.ok){
            alert("Event's Data Deleted Successfully")
            refreshTable()
        }else{
            alert("Error in deleting Event")
        }
    } catch (error) {
        console.log({"error":error})
    }
}

window.onload = () =>{
    refreshTable()
}


// Editing through dialog box

const editDialog = document.querySelector("#edit-dialog");
const editForm = document.querySelector("#edit-form");
const closeDialog = document.querySelector("#close-dialog");



function openEditDialog(eventID) {
    console.log(eventID)
    fetch(`https://rn-101-mock2.onrender.com/events/${eventID}`) 
        .then(response => response.json())
        .then(data => {
            if (data) {
                // Populate dialog fields with event details
                document.getElementById('editPoster').value = data.poster;
                document.getElementById('editName').value = data.name;
                document.getElementById('editDesc').value = data.description;
                document.getElementById('editEventDate').value = data.date;
                document.getElementById('editEventLocation').value = data.location;
                document.getElementById('editEventCategory').value = data.category;
                document.getElementById('editEventPrice').value = data.price;

                editDialog.showModal();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const eventId = currentEditEventId;
    
    const updatedPoster = document.getElementById('editPoster').value;
    const updatedEventName = document.getElementById('editName').value;
    const updatedEventDescription = document.getElementById('editDesc').value;
    const updatedEventDate = document.getElementById('editEventDate').value;
    const updatedEventLocation = document.getElementById('editEventLocation').value;
    const updatedEventCategory = document.getElementById('editEventCategory').value;
    const updatedEventPrice = parseFloat(document.getElementById('editEventPrice').value);

    const updatedEvent = {
        poster: updatedPoster,
        name: updatedEventName,
        description: updatedEventDescription,
        date: updatedEventDate,
        location: updatedEventLocation,
        category: updatedEventCategory,
        price: updatedEventPrice,
    };

    try {
        const response = await fetch(`https://rn-101-mock2.onrender.com/events/${eventId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEvent),
        });

        if (response.ok) {
            editDialog.close();
            alert("Event's Data Updated")
            refreshTable();
        } else {
            alert("Error in updating data")
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

closeDialog.addEventListener('click', () => {
    editDialog.close();
});
