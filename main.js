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

// Fungsi untuk merender daftar buku
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

// Menangani klik pada span untuk toggle checkbox
const checkbox = document.getElementById("bookFormIsComplete");
const customCheckbox = document.querySelector(".custom-checkbox");

customCheckbox.addEventListener("click", () => {
  checkbox.checked = !checkbox.checked; // Toggle status checkbox
  customCheckbox.classList.toggle("checked", checkbox.checked); // Update tampilan
});

// Membuat elemen buku
function makeBookElement({ id, title, author, year, isComplete }) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = title;
  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = `Penulis: ${author}`;
  const bookYear = document.createElement("p");
  bookYear.innerText = `Tahun: ${year}`;

  const bookItem = document.createElement("div");
  bookItem.classList.add("book-item");
  bookItem.setAttribute("data-bookid", id);
  bookItem.append(bookTitle, bookAuthor, bookYear);

  const bookActions = document.createElement("div");
  bookActions.classList.add("book-actions");

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.innerText = "Hapus Buku";
  deleteButton.addEventListener("click", function () {
    deleteBook(id);
  });

  if (isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("unfinish-button");
    undoButton.innerText = "Belum Selesai";
    undoButton.addEventListener("click", function () {
      undoBookCompletion(id);
    });
    bookActions.append(undoButton);
  } else {
    const finishButton = document.createElement("button");
    finishButton.classList.add("finish-button");
    finishButton.innerText = "Selesai dibaca";
    finishButton.addEventListener("click", function () {
      completeBook(id);
    });
    bookActions.append(finishButton);
  }

  bookActions.append(deleteButton);
  bookItem.append(bookActions);

  return bookItem;
}

// Tandai buku sebagai selesai dibaca
function completeBook(bookId) {
  const book = findBook(bookId);

  if (book) {
    book.isComplete = true;
    saveData();
    renderBooks();
  }
}

// Batalkan selesai baca buku
function undoBookCompletion(bookId) {
  const book = findBook(bookId);

  if (book) {
    book.isComplete = false;
    saveData();
    renderBooks();
  }
}

// Hapus buku
function deleteBook(bookId) {
  const bookIndex = findBookIndex(bookId);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    saveData();
    renderBooks();
  }
}

// Cari buku berdasarkan ID
function findBook(bookId) {
  return books.find((book) => book.id === bookId);
}

// Cari indeks buku berdasarkan ID
function findBookIndex(bookId) {
  return books.findIndex((book) => book.id === bookId);
}

// Tambah buku melalui form
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

// Cari buku melalui form
const searchForm = document.getElementById("searchBook");
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const searchTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTitle)
  );

  renderSearchResults(filteredBooks);
});

// Menampilkan hasil pencarian
function renderSearchResults(filteredBooks) {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  for (const book of filteredBooks) {
    const bookElement = makeBookElement(book);
    if (book.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  }
}

// Muat data saat halaman di-refresh
window.addEventListener("DOMContentLoaded", function () {
  if (isStorageExist()) {
    loadDataFromStorage();
    renderBooks();
  }
});
