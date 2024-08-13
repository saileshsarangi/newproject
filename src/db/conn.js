
const mysql = require('mysql2');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sipu',  
    database: 'demo'  
});


db.connect((err) => {
    if (err) {
        console.error('Could not connect to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database demo .');
});

db.query('SHOW TABLES', (err, results) => {
  if (err) {
      console.error('Error fetching tables:', err);
      return;
  }


  console.log('Tables in the database:');
  console.log(results);
});

const query = 'SELECT email, password FROM userlogin';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data from userLogin table:', err);
            return;
        }

        // Print results
        console.log('Email and Password from userLogin table:');
       console.log(results);
    });

    console.log("audit table");
    const query1 = 'SELECT * FROM audit';

    db.query(query1, (err, results) => {
        if (err) {
            console.error('Error fetching data from userLogin table:', err);
            return;
        }

        // Print results
        console.log(' from audit table:');
       console.log(results);
    });
    const query2 = 'SELECT * FROM revision_audit';

    db.query(query2, (err, results) => {
        if (err) {
            console.error('Error fetching data from userLogin table:', err);
            return;
        }

        // Print results
        console.log(' revision_audit table:');
       console.log(results);
    });
  
   
   

module.exports = db;
