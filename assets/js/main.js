// Flag untuk menentukan apakah sedang dalam mode edit
let isEditing = false;
let editingBookId = null; // Menyimpan ID buku yang sedang di-edit

// Tambahkan buku baru
function addBook(title, author, year, isComplete) {
  const book = {
    id: +new Date(), // Unique ID using timestamp
    title,
    author,
    year,
    isComplete,
  };
  books.push(book); // Add book to books array
  saveData(); // Save the data (ensure saveData is implemented)
  renderBooks(); // Re-render book list after adding new book
}

// Fungsi untuk merender daftar buku
function renderBooks() {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  // Clear current book list
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  for (const book of books) {
    const bookElement = makeBookElement(book);

    if (book.isComplete) {
      completeBookList.append(bookElement); // Append completed book
    } else {
      incompleteBookList.append(bookElement); // Append incomplete book
    }
  }
}

function toggleBookComplete(bookId) {
  const book = books.find((book) => book.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveData();
    renderBooks();
  }
}

// Membuat elemen buku
function makeBookElement({ id, title, author, year, isComplete }) {
  const bookTitle = document.createElement("h3");
  bookTitle.innerText = title;
  bookTitle.setAttribute("data-testid", "bookItemTitle"); // Tambahkan data-testid

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = `Penulis: ${author}`;
  bookAuthor.setAttribute("data-testid", "bookItemAuthor"); // Tambahkan data-testid

  const bookYear = document.createElement("p");
  bookYear.innerText = `Tahun: ${year}`;
  bookYear.setAttribute("data-testid", "bookItemYear"); // Tambahkan data-testid

  const bookItem = document.createElement("div");
  bookItem.classList.add("book-item");
  bookItem.setAttribute("data-bookid", id);
  bookItem.setAttribute("data-testid", "bookItem"); // Tambahkan data-testid
  bookItem.append(bookTitle, bookAuthor, bookYear);

  const bookActions = document.createElement("div");
  bookActions.classList.add("book-actions");

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.innerText = "Hapus Buku";
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton"); // Tambahkan data-testid
  deleteButton.addEventListener("click", function () {
    deleteBook(id);
  });

  const editButton = document.createElement("button");
  editButton.classList.add("edit-button");
  editButton.innerText = "Edit Buku";
  editButton.addEventListener("click", function () {
    editBook(id);
  });

  if (isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("unfinish-button");
    undoButton.innerText = "Belum Selesai";
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton"); // Tambahkan data-testid
    undoButton.addEventListener("click", function () {
      undoBookCompletion(id);
    });
    bookActions.append(undoButton);
  } else {
    const finishButton = document.createElement("button");
    finishButton.classList.add("finish-button");
    finishButton.innerText = "Selesai dibaca";
    finishButton.setAttribute("data-testid", "bookItemIsCompleteButton"); // Tambahkan data-testid
    finishButton.addEventListener("click", function () {
      completeBook(id);
    });
    bookActions.append(finishButton);
  }

  bookActions.append(editButton, deleteButton);
  bookItem.append(bookActions);

  return bookItem;
}

// Handle form submit
const bookForm = document.getElementById("bookForm");
bookForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  if (!title || !author || !year) {
    alert("Mohon isi semua data buku!");
    return;
  }

  if (isEditing && editingBookId !== null) {
    // Update buku
    const book = findBook(editingBookId);
    if (book) {
      book.title = title;
      book.author = author;
      book.year = year;
      book.isComplete = isComplete;

      saveData(); // Simpan perubahan
      renderBooks(); // Render ulang daftar buku
      alert("Buku berhasil diperbarui!");
    }

    resetFormToAddBookMode(); // Kembali ke mode 'Tambah Buku'
  } else {
    // Tambah buku baru
    addBook(title, author, year, isComplete);
    alert("Buku berhasil ditambahkan!");
  }

  bookForm.reset();
});

// Reset form untuk mode 'Tambah Buku'
function resetFormToAddBookMode() {
  const form = document.getElementById("bookForm");
  const submitButton = document.querySelector("#bookForm button");

  // Reset form
  form.reset();

  submitButton.innerText = "Tambah Buku ke rak"; // Ubah tombol ke mode 'Tambah'
  isEditing = false;
  editingBookId = null;
}

// Fungsi untuk menangani edit buku
function editBook(bookId) {
  const book = findBook(bookId);
  if (!book) return;

  const form = document.getElementById("bookForm");
  const submitButton = document.querySelector("#bookForm button");

  // Isi form dengan data buku yang akan diedit
  document.getElementById("bookFormTitle").value = book.title;
  document.getElementById("bookFormAuthor").value = book.author;
  document.getElementById("bookFormYear").value = book.year;
  document.getElementById("bookFormIsComplete").checked = book.isComplete;

  submitButton.innerText = "Update Buku"; // Ubah tombol ke mode 'Update'
  isEditing = true;
  editingBookId = bookId;
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

// Load data saat halaman di-refresh
window.addEventListener("DOMContentLoaded", function () {
  if (isStorageExist()) {
    loadDataFromStorage();
    renderBooks();
    resetFormToAddBookMode(); // Pastikan form diatur ke mode 'Tambah Buku' saat awal load
  }
});
