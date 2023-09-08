const XLSX = require("xlsx");
const mysql = require("mysql2/promise"); // Import the mysql2 package

// Function to create the 'companies' table if it doesn't exist
async function createTable() {
  const connection = await mysql.createConnection({
    host: "localhost", // Replace with the host of your MySQL server
    user: "test", // Replace with your MySQL username
    password: "test", // Replace with your MySQL password
    database: "test", // Replace with your MySQL database name
  });

  try {
    // Define the SQL statement to create the 'companies' table
    const createTableSQL = `
    CREATE TABLE IF NOT EXISTS companies (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) DEFAULT NULL, -- Allow NULL for 'name'
      firm_link VARCHAR(255) DEFAULT NULL, -- Allow NULL for 'firm_link'
      description TEXT DEFAULT NULL, -- Allow NULL for 'description'
      linked_in VARCHAR(255) DEFAULT NULL, -- Allow NULL for 'linked_in'
      founder VARCHAR(255) DEFAULT NULL, -- Allow NULL for 'founder'
      mail VARCHAR(255) DEFAULT NULL -- Allow 'mail' to be NULL
      )
  `;
  
    // Execute the SQL statement to create the table
    await connection.query(createTableSQL);
    console.log("Table 'companies' created successfully.");
  } catch (error) {
    console.error("Error creating table:", error);
  } finally {
    await connection.end();
  }
}
// Function to insert data from CSV into the 'companies' table
async function insertDataIntoDB() {
  const workbook = XLSX.readFile("./input-algo.csv");
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const connection = await mysql.createConnection({
    host: "localhost", // Replace with the host of your MySQL server
    user: "test", // Replace with your MySQL username
    password: "test", // Replace with your MySQL password
    database: "test", // Replace with your MySQL database name
  });

  for (let i = 0; i < jsonData.length; i++) {
    const row = jsonData[i];

    let name = row[0];
    let firm_link = row[1];
    let description = row[2];
    let linked_in = row[3];
    let founder = row[4];
    let mail = row[5];

    // Check maximum allowed lengths and skip/truncate values if needed
    const maxNameLength = 255;
    const maxFirmLinkLength = 255;
    const maxDescriptionLength = 1000;

    if (name && name.length > maxNameLength) {
      console.log(`Skipping row ${i + 1} due to 'name' length exceeded.`);
      continue; // Skip this row
    }

    if (firm_link && firm_link.length > maxFirmLinkLength) {
      console.log(`Skipping row ${i + 1} due to 'firm_link' length exceeded.`);
      continue; // Skip this row
    }

    if (description && description.length > maxDescriptionLength) {
      console.log(`Truncating 'description' for row ${i + 1}.`);
      description = description.substring(0, maxDescriptionLength);
    }

    try {
      const insertQuery = `
        INSERT INTO companies (name, firm_link, description, linked_in, founder, mail)
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
      console.log("Company added successfully.");
    } catch (error) {
      console.error("Error:", error);
    }
  }

  await connection.end(); // Close the MySQL connection
}

// Main function
async function main() {
  await createTable(); // Create the 'companies' table if it doesn't exist
  await insertDataIntoDB(); // Insert data into the 'companies' table
}

main().catch((error) => {
  console.error("Error:", error);
});