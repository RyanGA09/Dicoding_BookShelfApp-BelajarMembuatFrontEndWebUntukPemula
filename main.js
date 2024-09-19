const books = [];
const STORAGE_KEY = "BOOKSHELF_APP";

// Cek apakah browser mendukung localStorage
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser tidak mendukung localStorage");
    return false;
  }
  return true;
}

// Simpan data buku ke localStorage
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}

// Muat data buku dari localStorage
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData !== null) {
    const data = JSON.parse(serializedData);
    books.push(...data);
  }
}

// Tambahkan buku baru
function addBook(title, author, year, isComplete) {
  const book = {
    id: +new Date(),
    title,
    author,
    year,
    isComplete,
  };
  books.push(book);
  saveData();
  renderBooks();
}

function toggleBookComplete(bookId) {
  const book = books.find((book) => book.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveData();
    renderBooks();
  }
}

function deleteBook(bookId) {
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    saveData();
    renderBooks();
  }
}

function renderBooks() {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  for (const book of books) {
    const bookElement = makeBookElement(book);

    if (book.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  }
}

function makeBookElement(book) {
  const bookElement = document.createElement("div");
  bookElement.setAttribute("data-bookid", book.id);
  bookElement.setAttribute("data-testid", "bookItem");

  bookElement.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div>
          <button data-testid="bookItemIsCompleteButton">
            ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
          </button>
          <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        </div>
      `;

  const deleteButton = bookElement.querySelector(
    '[data-testid="bookItemDeleteButton"]'
  );
  deleteButton.addEventListener("click", () => deleteBook(book.id));

  const toggleCompleteButton = bookElement.querySelector(
    '[data-testid="bookItemIsCompleteButton"]'
  );
  toggleCompleteButton.addEventListener("click", () =>
    toggleBookComplete(book.id)
  );

  return bookElement;
}

// Handle form submit
const bookForm = document.getElementById("bookForm");
bookForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  addBook(title, author, year, isComplete);

  bookForm.reset();
});

// Muat data dari localStorage ketika halaman di-load
document.addEventListener("DOMContentLoaded", function () {
  if (isStorageExist()) {
    loadDataFromStorage();
  }
  renderBooks();
});
