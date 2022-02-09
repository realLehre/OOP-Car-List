class Book{
    constructor(title, author, isbn){
        this.title = title,
        this.author = author,
        this.isbn = isbn;
    }
}

class UI{
    addBookToList(book){
        // get book list container 
        const list = document.getElementById('book-list');
        const row = document.createElement('tr');
        row.classList.add('book-item');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `;

        list.appendChild(row);
        
        const deleteBtn = row.querySelector('.delete');
        deleteBtn.addEventListener('click', deleteBook);
    }

    displayAlert(type, text){
        const alert = document.getElementById('alert');
        alert.classList.add(type);
        alert.textContent = `${text}`;
        
        setTimeout(function(){
            alert.classList.remove(type);
            alert.textContent = "";
        }, 500)
    }

    clearInputs(){
        // clear inputs after adding book to UI
        const inputs = document.querySelectorAll('input');
        inputs.forEach(function(input){
            input.value = "";
        })
    }
}

class StoreToLS{
    static getLocalStorage(){
        return localStorage.getItem('Book List Items') ? JSON.parse(localStorage.getItem('Book List Items')) : [];
    }

    static addToLS(book){
        let bookList = book;
        let books = StoreToLS.getLocalStorage();

        books.push(bookList);

        localStorage.setItem('Book List Items', JSON.stringify(books));
    }

    static removeFromLs(isbn){
        const books = StoreToLS.getLocalStorage();

        books.forEach(function(book, index){
            if(book.isbn == isbn){
                books.splice(index, 1)
            }
        })

        localStorage.setItem('Book List Items', JSON.stringify(books));
    }
}

function displayBooks(){
    let books = StoreToLS.getLocalStorage();

    books.forEach(function(book){
        let ui = new UI;
        
        ui.addBookToList(book)
    })    
}

window.addEventListener('DOMContentLoaded', displayBooks)

const form  = document.getElementById('book-form');
form.addEventListener('submit', function(e){
    // get inputs
    const title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value;

    // validate inputs
    if(title == "" || author == "" || isbn == ""){
        const ui = new UI;
        ui.displayAlert('error', 'please fill all fields');
    } else {
        // instantiate new book
        let book = new Book(title, author, isbn);

        // instantiate new UI
        const ui = new UI();

        // ui functions
        ui.addBookToList(book);
        ui.clearInputs();
        StoreToLS.addToLS(book);
        ui.displayAlert('success', 'book added')
    }

    e.preventDefault();
})

// delete book from table
function deleteBook(e){
    const target = e.currentTarget.parentElement.parentElement;
    const bookList = document.getElementById('book-list');
    bookList.removeChild(target);

    const ui = new UI

    ui.displayAlert('error', 'book removed');
    StoreToLS.removeFromLs(e.currentTarget.parentElement.previousElementSibling.textContent);
}

const filterBooks = document.getElementById('filter');
filterBooks.addEventListener('keyup', (e) => {
    const text = e.target.value.toLowerCase();
    const bookLists = document.querySelectorAll('.book-item');
    console.log(bookLists[0].textContent);

    bookLists.forEach((book) => {
        
        const item = book.firstChild.textContent;
        console.log(item);
        if(item.toLowerCase().indexOf(text) >= -1){
            book.style.display = 'initial';
        } else {
            book.style.display = 'none'
        }
    })
})

