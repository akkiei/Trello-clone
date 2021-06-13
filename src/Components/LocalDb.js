// import idb from "./indexedDB";
let db;

const idb = {
  InitDB(dbName, ver) {
    const dbObject =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB;

    return new Promise(function (resolve, reject) {
      let version = ver;
      if (localStorage.getItem("dbVer") != null) {
        version = localStorage.getItem("dbVer");
      }
      const request = dbObject.open(dbName, parseInt(version, 10));
      request.onerror = (e) => {
        console.log(`Error opening database:${e}`);
        reject(e);
      };
      request.onsuccess = (e) => {
        db = request.result;
        localStorage.setItem("dbVer", version);
        console.log(`Database successfully opened : ${e}`);
        resolve();
      };
    });
  },
  createListStore(dbName, ObjectStoreName, isAutoIncrement = true) {
    const dbObject =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB;
    const curVer = localStorage.getItem("dbVer");
    return new Promise(function (resolve, reject) {
      if (db) db.close();
      const request = dbObject.open(dbName, parseInt(curVer, 10) + 1);
      request.onerror = (e) => {
        localStorage.setItem("dbVer", db.version);
        console.log(e);
      };
      request.onsuccess = (e) => {
        db = request.result;
        localStorage.setItem("dbVer", db.version);
        resolve(true);
      };
      request.onupgradeneeded = (e) => {
        db = e.target.result;
        if (isAutoIncrement === true) {
          db.createObjectStore(ObjectStoreName, { autoIncrement: true });
        } else {
          db.createObjectStore(ObjectStoreName, { keyPath: "id" });
        }

        localStorage.setItem("dbVer", db.version);
        resolve();
      };
    });
  },
  deleteList(dbName, ObjectStoreName) {
    const dbObject =
      window.indexedDB ||
      window.mozIndexedDB ||
      window.webkitIndexedDB ||
      window.msIndexedDB;
    const curVer = localStorage.getItem("dbVer");
    return new Promise(function (resolve, reject) {
      if (db.objectStoreNames.contains(ObjectStoreName) === false)
        reject(new Error("ObjectStoreName not found."));
      db.close();
      const request = dbObject.open(dbName, parseInt(curVer, 10) + 1);
      request.onerror = (e) => {
        localStorage.setItem("dbVer", parseInt(curVer, 10) + 1);
        reject(new Error(e));
        console.log(e);
      };
      request.onsuccess = (e) => {
        db = request.result;
        localStorage.setItem("dbVer", parseInt(curVer, 10) + 1);
        resolve(true);
      };
      request.onupgradeneeded = (e) => {
        console.log("inside onupgrade");
        db = e.target.result;
        //   localStorage.setItem("dbVer", parseInt(curVer) + 1);
        db.deleteObjectStore(ObjectStoreName);
        resolve();
      };
    });
  },
  addCard(ObjectStoreName, dataObject, primaryKey = "", valueKey = "data") {
    return new Promise(function (resolve, reject) {
      if (db.objectStoreNames.contains(ObjectStoreName)) {
        try {
          const tx = db.transaction(ObjectStoreName, "readwrite");
          const store = tx.objectStore(ObjectStoreName);
          if (primaryKey === "") {
            store.add({ [valueKey]: dataObject });
          } else {
            store.add({ id: primaryKey, [valueKey]: dataObject });
          }
          tx.oncomplete = () => {
            console.log("Insert operation completed !");
            resolve();
          };
        } catch (error) {
          console.log(" error in insert operation " + error);
          reject(error);
        }
      } else {
        console.log("ObjectStoreName not found");
        reject("ObjectStoreName not found");
      }
    });
  },
  updateCard(ObjectStoreName, primaryKey, appendObj, appendKey = "") {
    return new Promise(function (resolve, reject) {
      const transaction = db.transaction(ObjectStoreName, "readwrite");
      const objectStore = transaction.objectStore(ObjectStoreName);
      const req = objectStore.get(primaryKey);
      req.onsuccess = function (event) {
        try {
          const data = event.target.result;
          let finalData = {};
          let KeyForAppendObj;
          if (appendKey == "") {
            // KeyForAppendObj = Object.keys(appendObj)[0];
            let temp = Object.assign(data.data, appendObj);
            finalData.id = data.id;
            finalData.data = temp;
            // data[KeyForAppendObj] = appendObj[KeyForAppendObj];
          } else {
            KeyForAppendObj = appendKey;
            data[KeyForAppendObj] = appendObj;
          }
          const requestUpdate = objectStore.put(finalData);
          requestUpdate.onsuccess = (e) => {
            console.log(` success in update ${e}`);
            resolve();
          };
          requestUpdate.onerror = (e) => {
            console.log(`error in update ${e}`);
            reject(e);
          };
        } catch (error) {
          console.log("error in update operation: " + error);
          reject(error);
        }
      };
      req.onerror = function (e) {
        console.log("error in update operation: " + e);
      };
    });
  },
  getAllCards(ObjectStoreName) {
    return new Promise(function (resolve, reject) {
      const tx = db.transaction(ObjectStoreName);
      const currentObjectStore = tx.objectStore(ObjectStoreName);
      const req = currentObjectStore.getAll();
      req.onsuccess = function (event) {
        try {
          const data = event.target.result;
          resolve(data);
        } catch (error) {
          console.log("error in read operation: " + error);
        }
      };
    });
  },
  deleteCard(ObjectStoreName, primaryKey) {
    return new Promise(function (resolve) {
      const tx = db.transaction(ObjectStoreName, "readwrite");
      const store = tx.objectStore(ObjectStoreName).delete(primaryKey); // 1 is "keyPathId" here for row no. in the store
      tx.oncomplete = (e) => {
        console.log(`deleted successfully ${e}`);
        resolve();
      };
    });
  },
  readAllLists(init, dbName, ver) {
    return new Promise(async function (resolve, reject) {
      await init(dbName, ver);
      resolve(db.objectStoreNames);
    });
  },
};
export default idb;
