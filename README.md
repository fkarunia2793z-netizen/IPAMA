# Pendaftaran IPAMA - Setup Guide

## 1. Setup Google Spreadsheet (Database)
1. Buka Google Sheets baru di https://sheets.new
2. Beri nama Sheet, misal "Database IPAMA".
3. Ubah nama tab (sheet) di bawah dari "Sheet1" menjadi **"Anggota"**.
4. Di baris pertama (Header), buat kolom berikut:
   - Kolom A: `id`
   - Kolom B: `name`
   - Kolom C: `phone`
   - Kolom D: `studyProgram`
   - Kolom E: `classGrade`
   - Kolom F: `address`
   - Kolom G: `reason`
   - Kolom H: `timestamp`

## 2. Setup Google Apps Script (Backend)
1. Di Google Sheets, klik menu **Extensions** > **Apps Script**.
2. Hapus semua kode yang ada, copy-paste kode berikut:

```javascript
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    // PENTING: Nama sheet harus sama dengan nama tab di bawah
    const sheet = doc.getSheetByName('Anggota');
    
    // Handle GET (Read Data)
    if (!e.postData) {
      const data = sheet.getDataRange().getValues();
      const headers = data.shift(); // Remove headers
      const members = data.map(row => ({
        id: row[0],
        name: row[1],
        phone: row[2],
        studyProgram: row[3],
        classGrade: row[4],
        address: row[5],
        reason: row[6],
        timestamp: Number(row[7])
      })).filter(m => m.id !== ''); // Filter empty rows
      
      return responseJSON(members);
    }

    // Handle POST (Write/Delete)
    const params = JSON.parse(e.postData.contents);
    
    if (params.action === 'add') {
      const m = params.data;
      sheet.appendRow([m.id, m.name, m.phone, m.studyProgram, m.classGrade, m.address, m.reason, m.timestamp]);
      return responseJSON({ status: 'success', message: 'Data added' });
    }
    
    if (params.action === 'delete') {
      const idToDelete = params.id;
      const data = sheet.getDataRange().getValues();
      // Loop backwards to delete safely
      for (let i = data.length - 1; i >= 1; i--) {
        if (data[i][0] == idToDelete) {
          sheet.deleteRow(i + 1);
          return responseJSON({ status: 'success', message: 'Data deleted' });
        }
      }
      return responseJSON({ status: 'error', message: 'ID not found' });
    }

  } catch (e) {
    return responseJSON({ status: 'error', message: e.toString() });
  } finally {
    lock.releaseLock();
  }
}

function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Klik tombol **Deploy** (kanan atas) > **New deployment**.
4. Pilih type: **Web app**.
5. Description: "IPAMA API".
6. Execute as: **Me**.
7. Who has access: **Anyone** (Ini penting agar aplikasi bisa mengirim data).
8. Klik **Deploy**.
9. **Copy URL** yang muncul (Web app URL). Simpan ini.

## 3. Menghubungkan ke Aplikasi
1. Buka aplikasi web IPAMA.
2. Klik tombol **Login Admin** (password: `barudakwell`).
3. Di dalam menu Admin, akan ada input untuk **Google Script URL**.
4. Paste URL dari langkah no 2 di sana dan klik Simpan.
5. Aplikasi sekarang terhubung ke Spreadsheet!

## 4. Deploy ke Netlify
1. Drag & drop folder project ini ke dashboard Netlify.
2. Selesai.