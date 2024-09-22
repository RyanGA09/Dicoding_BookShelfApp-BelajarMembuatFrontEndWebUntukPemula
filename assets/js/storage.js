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
