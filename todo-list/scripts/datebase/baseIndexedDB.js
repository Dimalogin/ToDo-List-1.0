export function openDb(dbName, dbMigrations) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbMigrations.length);

    request.addEventListener("error", function () {
      reject(request.error);
    });

    request.addEventListener("success", function () {
      resolve(request.result);
    });

    request.addEventListener("upgradeneeded", function (event) {
      const db = request.result;
      const { oldVersion } = event;

      for (const migration of dbMigrations.slice(oldVersion)) {
        migration(db);
      }
    });
  });
}

export function readFromDB(db, storeName, key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const objectStore = transaction.objectStore(storeName);

    const request = objectStore.get(key);

    request.addEventListener("error", function () {
      reject(request.error);
    });

    request.addEventListener("success", function () {
      resolve(request.result);
    });
  });
}

export function addIntoDB(db, storeName, data, key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const objectStore = transaction.objectStore(storeName);

    const addRequest =
      key === undefined ? objectStore.add(data) : objectStore.add(data, key);

    addRequest.addEventListener("error", function () {
      reject(addRequest.error);
    });

    addRequest.addEventListener("success", function () {
      resolve(addRequest.result);
    });
  });
}

export function updateInDB(db, storeName, data, key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const objectStore = transaction.objectStore(storeName);

    const updateRequest =
      key === undefined ? objectStore.put(data) : objectStore.put(data, key);

    updateRequest.addEventListener("error", function () {
      reject(updateRequest.error);
    });

    updateRequest.addEventListener("success", function () {
      resolve();
    });
  });
}

export function removeFromDB(db, storeName, key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const objectStore = transaction.objectStore(storeName);

    const deleteRequest = objectStore.delete(key);

    deleteRequest.addEventListener("error", function () {
      reject(updateRequest.error);
    });

    deleteRequest.addEventListener("success", function () {
      resolve();
    });
  });
}

export function getAllFromDB(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const objectStore = transaction.objectStore(storeName);

    const all = objectStore.getAll();

    all.addEventListener("error", function () {
      reject(all.error);
    });

    all.addEventListener("success", function () {
      resolve(all.result);
    });
  });
}
