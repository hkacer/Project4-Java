////First, we know that we now have a cookie we need to read to get the logged in user’s Id
//
//  Second, because we have a logged in user and we are keeping track with a cookie, we will need a logout method that clears that cookie
//
//  Third, we know that we have a form that submits new notes
//
//  Fourth, we want to retrieve all the notes that are associated with the user when the page loads, create cards for them, and append them to a container to hold them
//
//  Fifth, we want to be able to update a note which will involve a separate GET request for just that note so we can populate our modal with it
//
//  Sixth, we want to be able to delete a note

const cookieArr= document.cookie.split("=")
const userId= cookieArr[1];





const submitForm= document.getElementById("note-form")
const noteContainer=document.getElementById("note-container")


let noteBody= document.getElementById('note-body')
let updateNoteBtn= document.getElementById('update-note-button')

const headers = {
    'Content-Type' : 'application/json'
}


const baseUrl= "http://localhost:8080/api/v1/notes/"


function handleLogout(){
    let c = document.cookie.split(";");
    for(let i in c){
        document.cookie = /^[^=]+/.exec(c[i])[0]+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
}

const handleSubmit = async (e) => {

    e.preventDefault()

    let bodyObj= {
         body: document.getElementById("note-input").value

    }

    await addNote(bodyObj);
    document.getElementById("note-input").value= ''

}

async function addNote(obj){

     const response= await fetch(`${baseUrl}user/${userId}`, {

        method: "POST",
        body: JSON.stringify(obj),
        headers: headers

     })
     .catch(err=> console.error(err.message))

        if(response.status===200){

            return getNotes(userId)
        }

}

async function getNotes(userId) {
    await fetch(`${baseUrl}user/${userId}`, {
        method: "GET",
        headers: headers
    })
        .then(response => response.json())
        .then(data => createNoteCards(data))
        .catch(err => console.error(err))
}

async function getNoteById(noteId){

    await fetch(baseUrl + noteId, {
        method: "GET",
        headers:headers

    })
    .then(response => res.json())
    .then(data => populateModal(data))
    .catch(err => console.error(err.message))


}

async function handleNoteEdit(noteId){

      let bodyObj = {
        id: noteId,
        body: noteBody.value
      }

      await fetch(baseUrl, {
        method: "PUT",
        body: JSON.stringify(bodyObj),
        headers: headers
      })

      .catch(err => console.error(err))

      return getNotes(userId)

}

async function handleDelete(noteId){

    await fetch(baseUrl + noteId, {
        method: "DELETE",
        headers: headers
    })

    .catch(err=> console.error(err))

    return getNotes(userId)
}

const createNoteCards = (array) => {
    noteContainer.innerHTML = ''
    array= Array.from(array)
    array.forEach(obj => {
        let noteCard = document.createElement("div")
        noteCard.classList.add("m-2")
        noteCard.innerHTML = `
            <div class="card d-flex" style="width: 18rem; height: 18rem;">
                <div class="card-body d-flex flex-column  justify-content-between" style="height: available">
                    <p class="card-text">${obj.body}</p>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-danger" onclick="handleDelete(${obj.id})">Delete</button>
                        <button onclick="getNoteById(${obj.id})" type="button" class="btn btn-primary"
                        data-bs-toggle="modal" data-bs-target="#note-edit-modal">
                        Edit
                        </button>
                    </div>
                </div>
            </div>
        `
        noteContainer.append(noteCard);
    })
}

const populateModal =(obj)=> {

noteBody.innerText= ''
noteBody.innerText = obj.body
updateNoteBtn.setAttribute("data-note-id", obj.id)

}


getNotes(userId);

submitForm.addEventListener("submit", handleSubmit)

updateNoteBtn.addEventListener("click", (e)=>{
    let noteId = e.target.getAttribute('data-note-id')
    handleNoteEdit(noteId)
})


const handleSearch = async (e) => {

  const searchInput = document.getElementById("search-input").value;
  const filteredNotes = await fetch(`${baseUrl}user/${userId}`)
    .then(response => response.json())
    .then(notes => notes.filter(note => note.body.includes(searchInput)))
    .catch(err => console.error(err));
  createNoteCards(filteredNotes);
  console.log(searchInput)
};

//const searchButton = document.getElementById("search-button");
//searchButton.addEventListener("click", handleSearch);


//const searchInput = document.getElementById("search-input");
//const searchButton = document.getElementById("search-button");
//
//const handleSearch = async (e) => {
//    e.preventDefault()
//  const searchTerm = searchInput.value;
//  const searchUrl = `${baseUrl}user/${userId}/search/${searchTerm}`;
//  const response = await fetch(searchUrl, {
//    method: "GET",
//    headers: headers
//  });
//  if (response.status === 200) {
//    const data = await response.json();
//    createNoteCards(data);
//  }
//};
//
//searchButton.addEventListener("click", handleSearch);
