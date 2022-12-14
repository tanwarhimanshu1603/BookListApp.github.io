// Book class: Represents a book
class Book{
    constructor(title,author,isbn){
        this.title=title;
        this.author=author;
        this.isbn=isbn;
    }
}

// UI class: Handle UI Tasks
class UI{
    static displayBooks(){
        const books = Store.getBooks();

        books.forEach((book)=> UI.addBookToList(book));
    }

    static addBookToList(book){
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.isbn}</td>
                    <td><a href="#" class="btn btn-danger btn-sm delete">Delete</a></td>
        `;

        list.appendChild(row);
    }

    static showAlerts(message,className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div,form);
        // Remove after 2 seconds
        setTimeout(()=>document.querySelector('.alert').remove(),2000);
    }

    static deleteBook(targetEle){
        if(targetEle.classList.contains('delete')){
            targetEle.parentElement.parentElement.remove();
            this.showAlerts('Book deleted successfully','success');
        }
    }


    static clearFields(){
     document.querySelector('#title').value='';
     document.querySelector('#author').value='';
     document.querySelector('#isbn').value='';        
    }
}

// Store class: Handles storage
class Store{
    // get Books from storage
    static getBooks(){
        let books;
        if(localStorage.getItem('books')===null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    // Add book storage
    static addBook(book){
        const books = this.getBooks();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));
    }

    // Delete book from storage
    static deleteBook(isbn){
        const books = this.getBooks();
        books.forEach((book,index)=>{
            if(book.isbn===isbn){
                books.splice(index,1);
            }
        });
        localStorage.setItem('books',JSON.stringify(books));
    }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded',UI.displayBooks());

// Event: Add a Book to storage
document.querySelector('#book-form').addEventListener('submit',(e)=>{

    // Prevent actual submit
    e.preventDefault();

    // Get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate empty fields
    if(title === '' || author === '' || isbn===''){
        UI.showAlerts('Please fill out all the fields','danger');
    }else{
        const book = new Book(title,author,isbn);
        // console.log(book);
        UI.addBookToList(book);

        // Add book to store
        Store.addBook(book);
    
        // Clear fields
        UI.clearFields();
        UI.showAlerts('Book Added to the List','success');
    }
});

// Event: Delete a Book
document.querySelector('#book-list').addEventListener('click',(e)=>{
    UI.deleteBook(e.target);

    // Delete book from store
    Store.deleteBook(e.target.parentElement.previousElementSibling.textContent);
});