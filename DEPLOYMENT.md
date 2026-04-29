# 🚀 Deployment & Setup Guide (WMS Master)

คู่มือการนำ Web App (React + Vite) นี้ไปติดตั้งใช้งานจริง โดยใช้ **GitHub** สำหรับเก็บโค้ด, **Vercel** สำหรับโฮสต์หน้าเว็บไซต์ และ **Google Sheets** เป็นฐานข้อมูลเชื่อมต่อผ่าน API

---

## 📂 Step 1: เก็บโค้ดลง GitHub

1. สมัครสมาชิกและเข้าสู่ระบบ [GitHub](https://github.com/)
2. กดปุ่ม **New repository** 
   - ตั้งชื่อ Repository (เช่น `wms-master-app`)
   - เลือกเป็น **Private** (แนะนำสำหรับ Web App ภายใน) หรือ **Public**
   - กด **Create repository**
3. เปิด Terminal หรือ Command Prompt ในเครื่องคอมพิวเตอร์ (ที่เปิดโฟลเดอร์โปรเจกต์นี้อยู่)
4. พิมพ์คำสั่งต่อไปนี้เพื่ออัปโหลดโค้ดขึ้น GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for WMS Master"
   git branch -M main
   git remote add origin https://github.com/USERNAME/wms-master-app.git
   git push -u origin main
   ```
   *(หมายเหตุ: เปลี่ยน `USERNAME` ให้เป็นชื่อบัญชี GitHub ของคุณ)*

---

## 📊 Step 2: ตั้งค่าฐานข้อมูลและ API บน Google Sheets

เราจะใช้ Google Sheets และ Google Apps Script (GAS) เพื่อใช้เป็น Backend API และฐานข้อมูล

### 1. สร้าง Spreadsheet ใหม่
1. ไปที่ [Google Sheets](https://sheets.new) เพื่อสร้างไฟล์เอกสารใหม่
2. ตั้งชื่อไฟล์ว่า `WMS Master DB`

### 2. เขียน Script สร้างฐานข้อมูลและ Mock Data อัตโนมัติ
1. ที่แถบเมนูด้านบน เลือก **ส่วนขยาย (Extensions) > Apps Script**
2. ลบโค้ดเก่าใน `Code.gs` ทิ้งให้หมด แล้วนำโค้ดด้านล่างไปวางแทนที่:

```javascript
function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // ==============================================
  // 1. Setup 'ProductionPlan' Sheet
  // ==============================================
  let planSheet = ss.getSheetByName('ProductionPlan');
  if (!planSheet) planSheet = ss.insertSheet('ProductionPlan');
  planSheet.clear();
  planSheet.appendRow(['id', 'sku', 'name', 'qtyKg', 'batterKg', 'status', 'shift', 'progress']);
  
  // ข้อมูล Mock Data สำหรับการวางแผนผลิต
  const mockPlans = [
    ['PLN-101', 'FG-SMC-001', 'Smoked Sausage (Standard) 1kg', 12000, 18000, 'In Progress', 'Morning', 45],
    ['PLN-102', 'FG-CHE-009', 'Cheese Sausage Lava 500g', 8000, 12000, 'Pending', 'Morning', 0],
    ['PLN-103', 'FG-MTB-002', 'Pork Meatball Grade A 1kg', 20000, 30000, 'Pending', 'Afternoon', 0],
    ['PLN-104', 'FG-HAM-005', 'Ham Block Sliced 200g', 5000, 6000, 'Draft', 'Night', 0],
    ['PLN-105', 'FG-FRN-003', 'Chicken Frank 500g', 15000, 18000, 'Completed', 'Morning', 100]
  ];
  planSheet.getRange(2, 1, mockPlans.length, mockPlans[0].length).setValues(mockPlans);

  // ==============================================
  // 2. Setup 'Batches' Sheet (Daily Board)
  // ==============================================
  let batchSheet = ss.getSheetByName('Batches');
  if (!batchSheet) batchSheet = ss.insertSheet('Batches');
  batchSheet.clear();
  batchSheet.appendRow(['id', 'setNo', 'productName', 'step', 'status', 'totalTime', 'timeLeft', 'weight']);
  
  // ข้อมูล Mock Data สำหรับ Batch Execution
  const mockBatches = [
    ['SMC-8821', 1, 'SFG Smoked Sausage (Standard)', 'mixing', 'Processing', 900, 275, 150],
    ['SMC-8822', 1, 'SFG Smoked Sausage (Standard)', 'mixing', 'Processing', 900, 275, 150],
    ['MTB-1102', 5, 'SFG Pork Meatball Grade A', 'mixing', 'Processing', 900, 420, 150],
    ['CHE-9901', 2, 'SFG Cheese Sausage Lava', 'forming', 'Processing', 1200, 820, 150],
    ['CHE-9902', 2, 'SFG Cheese Sausage Lava', 'forming', 'Waiting', 1200, 1200, 150],
    ['STM-1001', 10, 'SFG Pork Meatball', 'steaming', 'Processing', 1800, 450, 150],
    ['COL-2001', 15, 'SFG Vienna Sausage', 'cooling', 'Processing', 2400, 1200, 150],
    ['PEL-3001', 18, 'SFG Chicken Frank', 'peeling', 'Processing', 600, 300, 150],
    ['CUT-4001', 20, 'SFG Ham Block Sliced', 'cutting', 'Processing', 900, 150, 150],
    ['CUT-4002', 20, 'SFG Ham Block Sliced', 'cutting', 'Processing', 900, 150, 150]
  ];
  batchSheet.getRange(2, 1, mockBatches.length, mockBatches[0].length).setValues(mockBatches);

  // ==============================================
  // 3. Setup 'Users' Sheet
  // ==============================================
  let usersSheet = ss.getSheetByName('Users');
  if (!usersSheet) usersSheet = ss.insertSheet('Users');
  usersSheet.clear();
  usersSheet.appendRow(['empId', 'name', 'department', 'role']);
  
  const mockUsers = [
    ['M101', 'สมชาย ใจดี', 'Mixing', 'Operator'],
    ['F201', 'สมหญิง รักษา', 'Forming', 'Operator'],
    ['S301', 'ประสิทธิ์ ถุงทอง', 'Steaming', 'Leader']
  ];
  usersSheet.getRange(2, 1, mockUsers.length, mockUsers[0].length).setValues(mockUsers);
  
  // ลบ Sheet1 ที่ไม่ได้ใช้
  const sheet1 = ss.getSheetByName('Sheet1') || ss.getSheetByName('แผ่นที่ 1');
  if (sheet1) ss.deleteSheet(sheet1);
  
  SpreadsheetApp.getUi().alert('✅ ฐานข้อมูลถูกติดตั้งพร้อม Mock Data เรียบร้อยแล้ว!');
}

// ==============================================
// 4. API Handler (สำหรับ GET/POST ข้อมูลจาก Frontend)
// ==============================================
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    const sheetName = payload.sheet;
    const data = payload.data;
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return responseJSON(404, {message: 'Sheet not found'});
    
    // ACTION: read
    if (action === 'read') {
      const db = getSheetDataAsJSON(sheet);
      return responseJSON(200, db);
    }
    
    // ACTION: write (Batch Append)
    if (action === 'write') {
      const keys = getHeaders(sheet);
      const newRows = data.map(item => keys.map(k => item[k] || ''));
      sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, keys.length).setValues(newRows);
      return responseJSON(200, {message: 'Success', rowsInserted: newRows.length});
    }

    return responseJSON(400, {message: 'Action not valid'});
  } catch (error) {
    return responseJSON(500, {message: error.toString()});
  } finally {
    lock.releaseLock();
  }
}

// กรณีมีการเผลอยิง GET เข้ามาเช็คสถานะ
function doGet(e) {
  return HtmlService.createHtmlOutput('WMS API is Running... 🚀');
}

// --- Utils Functions ---
function getHeaders(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}
function getSheetDataAsJSON(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const keys = data[0];
  return data.slice(1).map(row => {
    let obj = {};
    keys.forEach((key, colIndex) => { obj[key] = row[colIndex] });
    return obj;
  });
}
function responseJSON(status, data) {
  return ContentService.createTextOutput(JSON.stringify({status, data}))
      .setMimeType(ContentService.MimeType.JSON);
}
```

3. **รันสคริปต์สร้างฐานข้อมูล**: 
   - เลือกรันฟังก์ชัน `setupDatabase` ที่หน้าต่างด้านบนสุด และกดปุ่ม **เรียกใช้ (Run)** 
   - ระบบจะขอสิทธิ์การเข้าถึง กด **ตรวจสอบสิทธิ์** > เลือกบัญชี > **ขั้นสูง** > **ไปที่โปรเจกต์** > **อนุญาต**
   - กลับไปดูหน้า Google Sheets ของคุณ จะพบว่าหน้าชีทและหัวคอลัมน์ รวมถึง Mock Data ทั้งหมดถูกสร้างเสร็จเรียบร้อย

### 3. นำ Web App ขึ้นใช้งานจริง (Deploy Web App)
1. ในหน้า Apps Script คลิกปุ่ม **การทำให้ใช้งานได้ (Deploy) > การทำให้ใช้งานได้รายการใหม่ (New deployment)** ที่มุมบนขวา
2. กดไอคอนรูปเฟือง ⚙️ ทางซ้ายมือ > เลือก **เว็บแอป (Web App)**
3. ข้อมูลคำอธิบาย: พิมพ์ `v1`
4. ตั้งค่าระดับการเข้าถึงตามนี้:
   - **เรียกใช้เป็น (Execute as)**: เลือก `ฉัน (Me/อีเมลของคุณ)`
   - **ผู้ที่มีสิทธิ์เข้าถึง (Who has access)**: เลือก `ทุกคน (Anyone)`
5. กด **การทำให้ใช้งานได้ (Deploy)**
6. กดปุ่ม `คัดลอก` หรือ `Copy` ตรงใตัหัวข้อ **URL ของเว็บแอป (Web App URL)** เก็บเอาไว้ก่อน (เราจะนำไปกรอกใน Vercel)

---

## 🌐 Step 3: Deploy Frontend ด้วย Vercel

1. สมัครสมาชิกและเข้าสู่ระบบ [Vercel](https://vercel.com/) ด้วยปุ่ม **Continue with GitHub**
2. กดปุ่ม **Add New...** ที่มุมบนขวา > เลือก **Project**
3. ค้นหาเพื่อเลือก Repository ที่ชื่อ `wms-master-app` (ที่คุณสร้างไว้ใน Step 1) แล้วกดปุ่ม **Import**
4. ในส่วนของการกำหนดค่า Project:
   - **Framework Preset**: Vercel จะค้นหาให้เป็น `Vite` อัตโนมัติ (ไม่ต้องเปลี่ยน)
   - **Root Directory**: ปล่อยว่างไว้
5. กางเมนู **Environment Variables** (ตัวแปรสภาพแวดล้อม):
   - **Key**: ให้กรอก `VITE_GAS_URL`
   - **Value**: ให้วางลิงก์ Web App URL ที่ Copy มาจาก Google Apps Script (ที่ลงท้ายด้วย `/exec`)
   - กดปุ่ม **Add**
6. สุดท้ายกดปุ่ม **Deploy** ✨
7. รอประมาณ 1-2 นาที เมื่อหน้าจอแสดงกลีบดอกไม้ฉลอง ถือว่าเว็บไซต์ของคุณออนไลน์เรียบร้อยแล้ว! 

คุณสามารถเข้าใช้งาน Web Application ด้วย URL ที่ Vercel สุ่มมาให้ หรือสามารถปรับแต่งโดเมนให้สวยงามได้ตามต้องการในเมนู Settings > Domains ของโปรเจกต์บน Vercel ได้เลย
