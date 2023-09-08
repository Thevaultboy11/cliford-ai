const XLSX = require("xlsx");
const workbook = XLSX.readFile("./input-algo.csv");

// Assuming you have one sheet in the Excel file
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Parse the sheet into JSON data
const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// jsonData now contains the Excel data in a JSON format

// async function addCompany(
//   name,
//   firm_link,
//   description,
//   linked_in,
//   founder,
//   mail
// ) {
//   try {
//     const insertQuery = `
//       INSERT INTO companies (name, firm_link, description, linked_in, founder, mail)
//       VALUES ($1, $2, $3, $4, $5, $6)
//     `;

//     await db.none(insertQuery, [
//       name,
//       firm_link,
//       description,
//       linked_in,
//       founder,
//       mail,
//     ]);

//     console.log("Company added successfully.");
//   } catch (error) {
//     console.error("Error:", error);
//   } finally {
//     db.$pool.end();
//   }
// }

// // Example usage:
// addCompany(
//   "Company Name",
//   "http://company-link.com",
//   "Company Description",
//   "http://linkedin.com/company",
//   "Founder Name",
//   "contact@email.com"
// );
const rows = jsonData;
let name = "";
let firm_link = "";
let description = "";
let founder = "";
let linked_in = "";
let mail = "";

let i = 0;
let x = 1;
console.log(rows.length);

while (rows.length - 1 >= i) {
  if (x == 1) {
    name = rows[i][0];
    firm_link = rows[i][1];
  } else if (x == 2) {
    description = rows[i][0];
  } else if (x == 3) {
    linked_in = rows[i][1];
  } else if (x == 4) {
    founder = rows[i][0];
  } else if (x == 5) {
    mail = rows[i][0];
    x = 0;
    // imas sve da doda kompaniju  console.log(i, name, firm_link, description, linked_in, founder, mail);
  }
  x++;
  i++;
}
