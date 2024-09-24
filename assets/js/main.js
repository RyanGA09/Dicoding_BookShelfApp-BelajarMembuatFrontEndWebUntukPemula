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

// Sinkronkan visual custom checkbox setiap kali custom checkbox diklik
const checkbox = document.getElementById("bookFormIsComplete");
const customCheckbox = document.querySelector(".custom-checkbox");

// Pastikan custom checkbox dan elemen asli sinkron
customCheckbox.addEventListener("click", (event) => {
  checkbox.checked = !checkbox.checked; // Toggle status checkbox asli
  customCheckbox.classList.toggle("checked", checkbox.checked); // Update tampilan visual
});

// Tangani klik pada label agar tidak mengganggu checkbox
const label = document.querySelector("label[for='bookFormIsComplete']");
label.addEventListener("click", (event) => {
  event.preventDefault(); // Menghindari label mengaktifkan checkbox asli
});

// Fungsi untuk menyinkronkan custom checkbox dengan status asli
// function syncCustomCheckbox() {
//   const checkbox = document.getElementById("bookFormIsComplete");
//   const customCheckbox = document.querySelector(".custom-checkbox");

//   // Update tampilan visual custom checkbox
//   if (checkbox.checked) {
//     customCheckbox.classList.add("checked");
//   } else {
//     customCheckbox.classList.remove("checked");
//   }
// }

// Fungsi untuk toggle status checkbox
// function toggleCheckbox() {
//   const checkbox = document.getElementById("bookFormIsComplete");
//   checkbox.checked = !checkbox.checked;
//   syncCustomCheckbox();
// }

// Fungsi untuk menambahkan event listener pada custom checkbox
// function setupCustomCheckbox() {
//   const customCheckbox = document.querySelector(".custom-checkbox");
//   customCheckbox.addEventListener("click", (event) => {
//     event.preventDefault(); // Cegah default behavior
//     toggleCheckbox(); // Ubah status checkbox dan sinkronkan tampilan
//   });
// }

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

// Reset form untuk mode 'Tambah Buku'
// function resetFormToAddBookMode() {
//   const form = document.getElementById("bookForm");
//   const submitButton = document.querySelector("#bookForm button");

//   // Reset form dan sinkronkan custom checkbox
//   form.reset();
//   syncCustomCheckbox();

//   submitButton.innerText = "Tambah Buku ke rak"; // Ubah tombol ke mode 'Tambah'

//   // Set ulang event submit form untuk menambah buku
//   form.onsubmit = function (event) {
//     event.preventDefault();

//     const title = document.getElementById("bookFormTitle").value;
//     const author = document.getElementById("bookFormAuthor").value;
//     const year = document.getElementById("bookFormYear").value;
//     const isComplete = document.getElementById("bookFormIsComplete").checked;

//     if (title && author && year) {
//       // Fungsi untuk menambah buku
//       addBook(title, author, year, isComplete);
//       alert("Buku berhasil ditambahkan!");
//       form.reset();
//       syncCustomCheckbox(); // Sinkronkan checkbox setelah form reset
//     } else {
//       alert("Mohon isi semua data buku!");
//     }
//   };

//   setupCustomCheckbox(); // Pastikan custom checkbox bekerja dengan benar
// }

// Reset form untuk mode 'Tambah Buku'
function resetFormToAddBookMode() {
  const form = document.getElementById("bookForm");
  const submitButton = document.querySelector("#bookForm button");

  // Reset form
  form.reset();

  submitButton.innerText = "Tambah Buku ke rak"; // Ubah tombol ke mode 'Tambah'

  // Set ulang event submit form untuk menambah buku
  form.onsubmit = function (event) {
    event.preventDefault();

    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = document.getElementById("bookFormYear").value;
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    if (title && author && year) {
      // Fungsi untuk menambah buku
      addBook(title, author, year, isComplete);
      alert("Buku berhasil ditambahkan!");
      form.reset();
    } else {
      alert("Mohon isi semua data buku!");
    }
  };
}

// Fungsi untuk menangani edit buku
// function editBook(bookId) {
//   const book = findBook(bookId);
//   if (!book) return;

//   const form = document.getElementById("bookForm");
//   const submitButton = document.querySelector("#bookForm button");

//   // Isi form dengan data buku yang akan diedit
//   document.getElementById("bookFormTitle").value = book.title;
//   document.getElementById("bookFormAuthor").value = book.author;
//   document.getElementById("bookFormYear").value = book.year;
//   document.getElementById("bookFormIsComplete").checked = book.isComplete;

//   syncCustomCheckbox(); // Sinkronkan custom checkbox dengan status checkbox asli
//   submitButton.innerText = "Update Buku"; // Ubah tombol ke mode 'Update'

//   // Ubah event submit form ke mode 'Update'
//   form.onsubmit = function (event) {
//     event.preventDefault();

//     const updatedTitle = document.getElementById("bookFormTitle").value;
//     const updatedAuthor = document.getElementById("bookFormAuthor").value;
//     const updatedYear = document.getElementById("bookFormYear").value;
//     const updatedIsComplete =
//       document.getElementById("bookFormIsComplete").checked;

//     if (updatedTitle && updatedAuthor && updatedYear) {
//       // Update data buku
//       book.title = updatedTitle;
//       book.author = updatedAuthor;
//       book.year = updatedYear;
//       book.isComplete = updatedIsComplete;

//       saveData(); // Simpan perubahan
//       renderBooks(); // Render ulang daftar buku

//       alert("Buku berhasil diperbarui!");
//       resetFormToAddBookMode(); // Kembali ke mode 'Tambah Buku' setelah update
//     } else {
//       alert("Mohon isi semua data buku!");
//     }
//   };

//   setupCustomCheckbox(); // Pastikan custom checkbox bekerja di mode edit
// }

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

  // Ubah event submit form ke mode 'Update'
  form.onsubmit = function (event) {
    event.preventDefault();

    const updatedTitle = document.getElementById("bookFormTitle").value;
    const updatedAuthor = document.getElementById("bookFormAuthor").value;
    const updatedYear = document.getElementById("bookFormYear").value;
    const updatedIsComplete =
      document.getElementById("bookFormIsComplete").checked;

    if (updatedTitle && updatedAuthor && updatedYear) {
      // Update data buku
      book.title = updatedTitle;
      book.author = updatedAuthor;
      book.year = updatedYear;
      book.isComplete = updatedIsComplete;

      saveData(); // Simpan perubahan
      renderBooks(); // Render ulang daftar buku

      alert("Buku berhasil diperbarui!");
      resetFormToAddBookMode(); // Kembali ke mode 'Tambah Buku' setelah update
    } else {
      alert("Mohon isi semua data buku!");
    }
  };
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
// window.addEventListener("DOMContentLoaded", function () {
//   if (isStorageExist()) {
//     loadDataFromStorage();
//     renderBooks();
//     addSubmitListenerToAddBook(); // Menambahkan listener default saat load
//     resetFormToAddBookMode(); // Pastikan form diatur ke mode 'Tambah Buku' saat awal load
//   }
// });

// Fungsi untuk load data ketika halaman di-refresh
// window.addEventListener("DOMContentLoaded", function () {
//   if (isStorageExist()) {
//     loadDataFromStorage();
//     renderBooks();
//     resetFormToAddBookMode(); // Pastikan form diatur ke mode 'Tambah Buku' saat awal load
//   }
// });

// Fungsi untuk load data ketika halaman di-refresh
window.addEventListener("DOMContentLoaded", function () {
  if (isStorageExist()) {
    loadDataFromStorage();
    renderBooks();
    resetFormToAddBookMode(); // Pastikan form diatur ke mode 'Tambah Buku' saat awal load
  }
});
