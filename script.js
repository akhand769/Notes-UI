const saveButton = document.querySelector('#btnSave')
const titleInput= document.querySelector("#title");
const descriptionInput= document.querySelector("#description");
const notesContainer= document.querySelector("#notes_container");
const btnDelete= document.querySelector("#btnDelete");
getAllNotes();

function clearform()
{
    titleInput.value='';
    descriptionInput.value='';
}

function AddNote(title , description)
{
    const body={
        title: title,
        description: description,
        isVisible: true,
    };
    fetch('https://localhost:7260/api/Notes',{
        method: 'POST',
        body: JSON.stringify(body),
        headers:
        {
            "content-type":"application/json"
        }
    }).then(data=>data.json())
    .then(response=> console.log(response)).then(response=>{
        clearform();
        getAllNotes();
    });
}

function getAllNotes(){
    fetch('https://localhost:7260/api/Notes').then(console.log("hello")).then(data=>data.json())
    .then(response=>DisplayNotes(response));
}
function getNotesById(id){
    fetch(`https://localhost:7260/api/Notes/${id}`).then(data=>data.json())
    .then(response=>displayNoteInForm(response));
}
function displayNoteInForm(variable)
{
    titleInput.value=variable.title;
    descriptionInput.value=variable.description;
}
function DisplayNotes(notes)
{
    let allnotes='';
    notes.forEach(element => {
        const appendableString = `
        <div class=note data-id="${element.id}">
            <h3>${element.title}</h3>
            <p>${element.description}<p>
        </div>
        `
    allnotes+=appendableString
    });
    notesContainer.innerHTML=allnotes;

    //addeventlistener
    value = document.querySelectorAll(".note");
    value.forEach(element=>
            element.addEventListener('click',function(){
                btnDelete.style.display='inline';
                btnDelete.value=element.dataset.id;
                getNotesById(element.dataset.id);  
            })
    )
}
saveButton.addEventListener('click', function(){
    AddNote(titleInput.value,descriptionInput.value);
})

function DeleteNote(id)
{
    // fetch(`https://localhost:7260/api/Notes/${id}`).then(data=>data.json())
    // .then(response=>displayNoteInForm(response));
    fetch(`https://localhost:7260/api/Notes/${id}`,{
        method: 'DELETE',}).then(alert("YOUR NOTE HAS BEEN DELETED SUCCESSFULLY")).then(response=> console.log(response)).then(response=>{
        clearform();
        getAllNotes();
    });
}

btnDelete.addEventListener('click',function(){
    DeleteNote(btnDelete.value);
})