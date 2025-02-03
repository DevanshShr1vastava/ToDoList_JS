// once the html gets loaded this will execute
document.addEventListener("DOMContentLoaded",function(){
    const inputTodo = document.getElementById('input-todo');
    const buttonTodo = document.getElementById('button-todo');
    const listTodo = document.getElementById('list-todo');
    const deleteAllTodo = document.getElementById('deleteAll-todo');
    const changeThemebutton = document.getElementById('changeTheme');
    
    const confirmDeleteModal = new bootstrap.Modal(document.getElementById('staticBackdrop')); // found this in the bootstrap modal documentation when scroll down including the hide and show methods which come along with it
    
    
    let deleteElement = [];
    let editElement = null;    
    let editMode = false;
    // console.log(inputTodo,buttonTodo,listTodo);
    
    //changing the theme upon clicking the button

    changeThemebutton.addEventListener('click',(e)=>{
        e.preventDefault();
        document.querySelector('html').getAttribute('data-bs-theme') === 'dark' ? document.querySelector('html').setAttribute('data-bs-theme','light'): document.querySelector('html').setAttribute('data-bs-theme','dark');
    })

    //update or add a task button function thingy
    buttonTodo.addEventListener('click',function(){
    const text = inputTodo.value;
    if(editMode){
        editElement.querySelector('.text-todo').textContent = text;
        editMode = false;
        editElement = null;
        buttonTodo.textContent = "Add";
    }
    else{
        createTodo(text)
    }
    inputTodo.value = '';
    saveAllTodo();
        
    })

    // creating a new list item for the todo list
    const createTodo=(task)=>{
        const li = document.createElement('li');
        li.className = "list-group-item d-flex justify-content-between align-items-start";
        li.innerHTML = `<span class='text-todo'>${task}</span>
        <div class="btn-group" role="group" aria-label="Basic mixed styles example">
            <button type="button" class="btn btn-danger">✏️</button>
            <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#staticBackdrop">🗑️</button>
        </div>`
        listTodo.appendChild(li);
    }

    //confirm delete in the popup modal
    // adding event listener to the modal confirm button
    document.querySelector('#staticBackdrop .btn-danger').addEventListener('click',()=>{
        console.log(typeof deleteElement);
        if(deleteElement) {
            deleteElement.forEach((task)=>task.remove());
        }
        deleteElement = []; // clear the reference to the row thingy
        saveAllTodo();
        confirmDeleteModal.hide(); // to close the modal after confirmation
    })

    // another button to delete the entire thing

    deleteAllTodo.addEventListener('click',()=>{
        // console.log(document.querySelectorAll('.list-group-item'));
        confirmDeleteModal.show();
        deleteElement = [...document.querySelectorAll('.list-group-item')];

        // document.querySelectorAll('.list-group-item').forEach((lis)=>lis.remove());
        // saveAllTodo();
    })

    // to delete we select the nearest class name to identify which task we need to remove 

    listTodo.addEventListener('click',(e)=>{
        // console.log(e.target.classList);
        if(e.target.classList.contains('btn-warning')){
            deleteElement =[e.target.closest('.list-group-item')];
            confirmDeleteModal.show();
            // e.target.closest(".list-group-item").remove();
            // saveAllTodo();
        }

        if(e.target.classList.contains('btn-danger')){
            const li = e.target.closest(".list-group-item");
            const textSpan = li.querySelector('.text-todo'); //saving original elements to replace later
            const buttonGroup = li.querySelector('.btn-group');
            const taskText = li.querySelector('.text-todo').textContent;

            const editInput = document.createElement('input');
            const saveEdit = document.createElement('button')
            // console.dir(li);
            editInput.classList.add('form-control')
            editInput.value = taskText;
            saveEdit.textContent = "Save"
            saveEdit.className ='btn btn-outline-danger';
            
            saveEdit.addEventListener('click',()=>{
                textSpan.textContent = editInput.value;
                li.replaceChild(textSpan,editInput)
                li.replaceChild(buttonGroup,saveEdit)
                saveAllTodo();
            })            

            li.replaceChild(editInput,li.firstChild);
            li.replaceChild(saveEdit, li.lastChild)

            
            // inputTodo.value = taskText;
            // buttonTodo.textContent = "Update";
            // editMode = true;
            // editElement = li;

        }

    })

    // persistent storage solutions
    // we can use the localstorage, cookies, sessions, indexedDB etc 
    // cookies can only be read by the js not modified

    // we will be implementing a local storage

    const saveAllTodo=()=>{
        const allTodos = [...document.querySelectorAll(".text-todo")].map((task)=>task.textContent);

        // document.querySelectorAll(".text-todo").forEach((task)=>{
        //     allTodos.push(task.textContent)
        // });

        localStorage.setItem("allTodos",JSON.stringify(allTodos));
    }

    const loadAllTodo=()=>{
        const allTodos = JSON.parse(localStorage.getItem('allTodos'))  || [];
        allTodos.forEach((task)=>createTodo(task))
    }
    loadAllTodo();
});

// write a function to reset the counter in the closure function count example
