// backend/controllers/studentController.js

const XLSX = require('xlsx');
const path = require('path');

const workbookPath = path.join(__dirname, '..', 'list.xlsx');

function formatExcelDate(value) {
  if (typeof value === 'number') {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const date = new Date(excelEpoch.getTime() + value * 86400000);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }
  if (value instanceof Date) {
    const day = String(value.getDate()).padStart(2, '0');
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const year = value.getFullYear();
    return `${day}-${month}-${year}`;
  }
  return String(value).trim();
}

function getSheetData() {
  const workbook = XLSX.readFile(workbookPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  let data = XLSX.utils.sheet_to_json(sheet);
  return data.map(row => {
    if (row['DOB']) {
      row['DOB'] = formatExcelDate(row['DOB']);
    }
    return row;
  });
}

function writeSheetData(data) {
  const newSheet = XLSX.utils.json_to_sheet(data);
  const newWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Sheet1');
  XLSX.writeFile(newWorkbook, workbookPath);
}

function verifyStudent(req, res) {
  const { applicationId, dob } = req.body;
  const students = getSheetData();

  const student = students.find(s =>
    String(s['Application ID']).trim() === applicationId.trim() &&
    String(s['DOB']).trim() === dob.trim()
  );

  if (student) {
    res.status(200).json({ success: true, message: 'Verified' });
  } else {
    res.status(404).json({ success: false, message: 'Student not found' });
  }
}

function submitPreferences(req, res) {
  const { applicationId, preferences } = req.body;
  const students = getSheetData();

  const index = students.findIndex(s => String(s['Application ID']).trim() === applicationId.trim());
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  students[index] = { ...students[index], ...preferences };
  writeSheetData(students);

  res.status(200).json({ success: true, message: 'Preferences saved' });
}


module.exports = {
  verifyStudent,
  submitPreferences
};