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
// const checkbox = document.getElementById("bookFormIsComplete");
// const customCheckbox = document.querySelector(".custom-checkbox");

// // Tambahkan event listener pada custom checkbox
// customCheckbox.addEventListener("click", () => {
//   checkbox.checked = !checkbox.checked; // Toggle status checkbox
//   customCheckbox.classList.toggle("checked", checkbox.checked); // Update tampilan
// });

// document.addEventListener("DOMContentLoaded", () => {
//   const checkbox = document.getElementById("bookFormIsComplete");
//   const customCheckbox = document.querySelector(".custom-checkbox");

//   customCheckbox.addEventListener("click", () => {
//     checkbox.checked = !checkbox.checked; // Toggle status checkbox
//     customCheckbox.classList.toggle("checked", checkbox.checked); // Update tampilan
//   });

//   // Tambahkan event listener untuk mengubah tampilan saat checkbox diklik
//   checkbox.addEventListener("change", () => {
//     customCheckbox.classList.toggle("checked", checkbox.checked);
//   });
// });

// const checkbox = document.getElementById("bookFormIsComplete");
// const customCheckbox = document.querySelector(".custom-checkbox");

// // Tambahkan event listener pada custom checkbox
// customCheckbox.addEventListener("click", () => {
//   checkbox.checked = !checkbox.checked; // Toggle status checkbox
//   customCheckbox.classList.toggle("checked", checkbox.checked); // Update tampilan
// });

// // Pastikan label juga berfungsi untuk mengklik
// document
//   .querySelector('label[for="bookFormIsComplete"]')
//   .addEventListener("click", () => {
//     checkbox.checked = !checkbox.checked; // Toggle status checkbox
//     customCheckbox.classList.toggle("checked", checkbox.checked); // Update tampilan
//   });

document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("bookFormIsComplete");
  const customCheckbox = document.querySelector(".custom-checkbox");

  // Fungsi untuk toggle checkbox
  function toggleCheckbox() {
    checkbox.checked = !checkbox.checked; // Toggle status checkbox
    customCheckbox.classList.toggle("checked", checkbox.checked); // Update tampilan
  }

  // Menghubungkan click event ke checkbox asli
  checkbox.addEventListener("click", () => {
    customCheckbox.classList.toggle("checked", checkbox.checked); // Update tampilan
  });

  // Menambahkan event listener untuk custom checkbox
  customCheckbox.addEventListener("click", toggleCheckbox);
});

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

// Fungsi untuk mengatur ulang form ke mode 'Tambah Buku'
function resetFormToAddBookMode() {
  const submitButton = document.querySelector("#bookForm button");
  submitButton.innerText = "Tambah Buku";

  // Tambah event listener untuk menambah buku
  const form = document.getElementById("bookForm");

  // Pastikan untuk menghapus semua event listener lama sebelum menambahkan event listener baru
  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);

  newForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = document.getElementById("bookFormYear").value;
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    addBook(title, author, year, isComplete);

    alert("Buku berhasil ditambahkan!");
    newForm.reset();
    submitButton.innerText = "Tambah Buku"; // Pastikan kembali ke mode 'Tambah Buku'
  });
}

// Fungsi Edit Buku
function editBook(bookId) {
  const book = findBook(bookId);
  if (!book) return;

  // Mengisi form dengan data buku yang akan diedit
  document.getElementById("bookFormTitle").value = book.title;
  document.getElementById("bookFormAuthor").value = book.author;
  document.getElementById("bookFormYear").value = book.year;
  document.getElementById("bookFormIsComplete").checked = book.isComplete;

  const submitButton = document.querySelector("#bookForm button");
  submitButton.innerText = "Update Buku";

  // Hapus event listener lama
  const oldForm = document.getElementById("bookForm");
  const newForm = oldForm.cloneNode(true);
  oldForm.parentNode.replaceChild(newForm, oldForm);

  // Event listener baru untuk update buku
  newForm.addEventListener("submit", function (event) {
    event.preventDefault();

    book.title = document.getElementById("bookFormTitle").value;
    book.author = document.getElementById("bookFormAuthor").value;
    book.year = document.getElementById("bookFormYear").value;
    book.isComplete = document.getElementById("bookFormIsComplete").checked;

    saveData();
    renderBooks();

    // Reset form dan kembalikan submit button ke kondisi awal
    newForm.reset();
    resetFormToAddBookMode(); // Ubah form kembali ke mode 'Tambah Buku'
  });
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

function validateForm(title, author, year) {
  if (title === "" || author === "" || year === "") {
    alert("Semua field harus diisi!");
    return false;
  }
  return true;
}

// Tambah buku melalui form dengan validasi
bookForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;

  if (!validateForm(title, author, year)) {
    return;
  }

  const isComplete = document.getElementById("bookFormIsComplete").checked;
  addBook(title, author, year, isComplete);

  alert("Buku berhasil ditambahkan!");
  bookForm.reset();
});

function addSubmitListenerToAddBook() {
  const submitButton = document.querySelector("#bookForm button");
  const form = document.getElementById("bookForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = document.getElementById("bookFormYear").value;
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    addBook(title, author, year, isComplete);
    form.reset();
    submitButton.innerText = "Tambah Buku"; // Memastikan teks tombol kembali ke default
  });
}

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
    addSubmitListenerToAddBook(); // Menambahkan listener default saat load
    resetFormToAddBookMode(); // Pastikan form diatur ke mode 'Tambah Buku' saat awal load
  }
});
