const XLSX = require("xlsx");
const mysql = require("mysql2/promise"); // Import the mysql2 package

// Function to create the 'companies' table if it doesn't exist
// async function createTable() {
//   const connection = await mysql.createConnection({
//     host: "localhost", // Replace with the host of your MySQL server
//     user: "test", // Replace with your MySQL username
//     password: "test", // Replace with your MySQL password
//     database: "test", // Replace with your MySQL database name
//   });

//   try {
//     // Define the SQL statement to create the 'companies' table
//     const createTableSQL = `
//     CREATE TABLE IF NOT EXISTS companies (
//       id INT AUTO_INCREMENT PRIMARY KEY,
//       name VARCHAR(255) DEFAULT NULL, -- Allow NULL for 'name'
//       firm_link VARCHAR(255) DEFAULT NULL, -- Allow NULL for 'firm_link'
//       description TEXT DEFAULT NULL, -- Allow NULL for 'description'
//       linked_in VARCHAR(255) DEFAULT NULL, -- Allow NULL for 'linked_in'
//       founder VARCHAR(255) DEFAULT NULL, -- Allow NULL for 'founder'
//       mail VARCHAR(255) DEFAULT NULL -- Allow 'mail' to be NULL
//       )
//   `;

//     // Execute the SQL statement to create the table
//     await connection.query(createTableSQL);
//     console.log("Table 'companies' created successfully.");
//   } catch (error) {
//     console.error("Error creating table:", error);
//   } finally {
//     await connection.end();
//   }
// }
// Function to insert data from CSV into the 'companies' table
async function insertDataIntoDB() {
  const workbook = XLSX.readFile("./input-algo.xlsx");
  const sheetName = workbook.SheetNames[6];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  const connection = await mysql.createConnection({
    host: "localhost", // Replace with the host of your MySQL server
    user: "test", // Replace with your MySQL username
    password: "test", // Replace with your MySQL password
    database: "test", // Replace with your MySQL database name
  });
  let name = "";
  let firm_link = "";
  let description = "";
  let founder = "";
  let linked_in = "";
  let mail = "";
  let i = 0;
  let x = 1;
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
      try {
        const insertQuery = `
          INSERT INTO school_system_eman (name, firm_link, description, linked_in, founder, mail)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        await connection.query(insertQuery, [
          name,
          firm_link,
          description,
          linked_in,
          founder,
          mail,
        ]);
      } catch (error) {
        console.error("Error:", error);
      }

      x = 0;
    }
    x++;
    i++;
  }
  await connection.end(); // Close the MySQL connection
}

// Main function
async function main() {
  await insertDataIntoDB(); // Insert data into the 'companies' table
}

main().catch((error) => {
  console.error("Error:", error);
});
