const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const db = require('./db/conn');
const { log } = require("console");
const { isString } = require("util");
const port = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../public");
const view_path = path.join(__dirname, "../views")





app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("views", view_path);
app.use(express.static(static_path));
app.set("view engine", "hbs");
const hbs = require('hbs');
hbs.registerHelper('incrementedIndex', function (index) {
    return index + 1;
});
hbs.registerHelper('json', function (context) {
    return JSON.stringify(context, null, 2);
});



app.get("/", (req, res) => {

    res.render("signup");
});


app.get("/riskmanagement", (req, res) => {

    console.log("here");
    const query = 'SELECT * FROM audit';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data: ' + err.stack);
            return res.status(500).send('Server Error');
        }
        res.render("newriskmanagement", { data: results })
        console.log(results);
    });
});




app.get("/auditnew", (req, res) => {
    res.render("auditnew");
});


app.post("/signup", async (req, res) => {
    console.log(req.body);
    try {

        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).send('Email and password are required.');
        }


        const query = 'SELECT email, password FROM userlogin WHERE email = ?';
        db.query(query, [email], (error, results) => {
            if (error) {
                console.error('Error querying the database:', error);
                return res.status(500).send('Server error.');
            }


            if (results.length === 0) {
                return res.status(401).send('Invalid email or password.');
            }


            const storedPassword = results[0].password;


            if (password === storedPassword) {
                res.redirect("/auditnew");
                console.log("went to nextpage");
            } else {
                res.status(401).send('Invalid email or password.');
            }
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('Server error.');
    }


});

//old audit code


// app.post("/auditnew", async (req, res) => {

//     console.log(req.body);
//     const now = new Date();
//     //console.log(now.toISOString()); // Example: "2024-08-02T18:30:00.000Z"

//     const y = Array.isArray(req.body.potentialFailureMode);
//     const z = Array.isArray(req.body.currentProcessControlsprevention);
//     console.log(y);
//     console.log(z);

//      if (y !== z) {
//          console.log("y and z are not equal, sending invalid response.");
//          return res.status(400).send('Invalid');
//      } 
//     if (y&&(!z)) {     // getting array for first container
//         console.log("inside if 1");

//         console.log(req.body.potentialFailureMode.length + " insertions for first container");

//         const  x = req.body.potentialFailureMode.length;


//         try {

//             for (let i = 0; i < x; i++) {
//                 const query = `
//                     INSERT INTO audit (
//                         contact_person, core_team, created_date, process_function, requirements, 
//                         potentialFailureMode, potentialEffectsofFailure, severity, potentialCauses, occurrence, 
//                         currentProcessControlsprevention, recommendedImprovement, Detect, RPN, AVGRPN, actionTaken, 
//                         contingencyPlan, status, action_sav, action_Occur, action_Detect, action_RPN, date
//                     )
//                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//                 `;
//                 const values = [
//                     req.body.contact_person, 
//                     req.body.core_team, 
//                     req.body.created_date, 
//                     req.body.process_function, 
//                     req.body.requirements,
//                     req.body.potentialFailureMode[i],
//                     req.body.potentialEffectsofFailure[i],
//                     req.body.severity[i],
//                     req.body.potentialCauses[i],
//                     req.body.occurrence[i],
//                     req.body.currentProcessControlsprevention,
//                     req.body.recommendedImprovement,
//                     req.body.Detect,
//                     req.body.RPN,
//                     req.body.AVGRPN,
//                     req.body.actionTaken,
//                     req.body.contingencyPlan,
//                     req.body.status,
//                     req.body.action_sav,
//                     req.body.action_Occur,
//                     req.body.action_Detect,
//                     req.body.action_RPN,
//                     req.body.created_date
//                 ];

//                 db.query(query, values, (error, results) => {
//                     if (error) {
//                         console.error('Error inserting data:', error);
//                         return res.status(500).send('Error saving data to database.');
//                     }

//                 });
//             }


//         } catch (error) {
//             console.error('Error processing request:', error);
//             res.status(500).send('Server error.');
//         }

//     } 

//     else if(z&&(!y)) //getting array for 2nd container
//     {
//         console.log("inside if 2");


//         console.log(req.body.currentProcessControlsprevention.length + " insertions for second container");
//         const  x = req.body.currentProcessControlsprevention.length ;


//         try {

//             for (let i = 0; i < x; i++) {
//                 const query = `
//                     INSERT INTO audit (
//                         contact_person, core_team, created_date, process_function, requirements, 
//                         potentialFailureMode, potentialEffectsofFailure, severity, potentialCauses, occurrence, 
//                         currentProcessControlsprevention, recommendedImprovement, Detect, RPN, AVGRPN, actionTaken, 
//                         contingencyPlan, status, action_sav, action_Occur, action_Detect, action_RPN, date
//                     )
//                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//                 `;
//                 const values = [
//                     req.body.contact_person, 
//                     req.body.core_team, 
//                     req.body.created_date, 
//                     req.body.process_function, 
//                     req.body.requirements,
//                     req.body.potentialFailureMode,
//                     req.body.potentialEffectsofFailure,
//                     req.body.severity,
//                     req.body.potentialCauses,
//                     req.body.occurrence,
//                     req.body.currentProcessControlsprevention[i],
//                     req.body.recommendedImprovement[i],
//                     req.body.Detect[i],
//                     req.body.RPN[i],
//                     req.body.AVGRPN[i],
//                     req.body.actionTaken[i],
//                     req.body.contingencyPlan,
//                     req.body.status,
//                     req.body.action_sav,
//                     req.body.action_Occur,
//                     req.body.action_Detect,
//                     req.body.action_RPN,
//                     req.body.created_date
//                 ];

//                 db.query(query, values, (error, results) => {
//                     if (error) {
//                         console.error('Error inserting data:', error);
//                         return res.status(500).send('Error saving data to database.');
//                     }

//                 });
//             }


//         } catch (error) {
//             console.error('Error processing request:', error);
//             res.status(500).send('Server error.');
//         }  

//     }
//     else if(y&&z)//for both
//     {   
//          if (y !== z) {
//                   console.log("y and z are not equal, sending invalid response.");
//                   return res.status(400).send('Invalid');
//              } 
//         console.log("inside third if");
//         console.log(req.body.potentialFailureMode.length + " insertions for first container");
//         console.log(req.body.currentProcessControlsprevention.length + " insertions for second container");

//         x = Math.max(req.body.potentialFailureMode.length, req.body.currentProcessControlsprevention.length);
//         console.log("no of rows insertion"+x);

//         try {
//             // Loop through the maximum length and insert data
//             for (let i = 0; i < x; i++) {
//                 const query = `
//                     INSERT INTO audit (
//                         contact_person, core_team, created_date, process_function, requirements, 
//                         potentialFailureMode, potentialEffectsofFailure, severity, potentialCauses, occurrence, 
//                         currentProcessControlsprevention, recommendedImprovement, Detect, RPN, AVGRPN, actionTaken, 
//                         contingencyPlan, status, action_sav, action_Occur, action_Detect, action_RPN, date
//                     )
//                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//                 `;
//                 const values = [
//                     req.body.contact_person, 
//                     req.body.core_team, 
//                     req.body.created_date, 
//                     req.body.process_function, 
//                     req.body.requirements,
//                     req.body.potentialFailureMode[i]||null,
//                     req.body.potentialEffectsofFailure[i]||null,
//                     req.body.severity[i]||null,
//                     req.body.potentialCauses[i]||null,
//                     req.body.occurrence[i]||null,
//                     req.body.currentProcessControlsprevention[i]||null,
//                     req.body.recommendedImprovement[i]||null,
//                     req.body.Detect[i]||null,
//                     req.body.RPN[i]||null,
//                     req.body.AVGRPN[i]||null,
//                     req.body.actionTaken[i]||null,
//                     req.body.contingencyPlan,
//                     req.body.status,
//                     req.body.action_sav,
//                     req.body.action_Occur,
//                     req.body.action_Detect,
//                     req.body.action_RPN,
//                     req.body.date
//                 ];

//                 db.query(query, values, (error, results) => {
//                     if (error) {
//                         console.error('Error inserting data:', error);
//                         return res.status(500).send('Error saving data to database.');
//                     }

//                 });
//             }


//         } catch (error) {
//             console.error('Error processing request:', error);
//             res.status(500).send('Server error.');
//         }

//     } 

//     else {
//         // Handle single row insertion
//         console.log("inside else");
//         const query = `
//             INSERT INTO audit (
//                 contact_person, core_team, created_date, process_function, requirements, 
//                 potentialFailureMode, potentialEffectsofFailure, severity, potentialCauses, occurrence, 
//                 currentProcessControlsprevention, recommendedImprovement, Detect, RPN, AVGRPN, actionTaken, 
//                 contingencyPlan, status, action_sav, action_Occur, action_Detect, action_RPN, date
//             )
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `;
//         const values = [
//             req.body.contact_person, 
//             req.body.core_team, 
//             req.body.created_date, 
//             req.body.process_function, 
//             req.body.requirements,
//             req.body.potentialFailureMode,
//             req.body.potentialEffectsofFailure ,
//             req.body.severity,
//             req.body.potentialCauses,
//             req.body.occurrence,
//             req.body.currentProcessControlsprevention,
//             req.body.recommendedImprovement,
//             req.body.Detect,
//             req.body.RPN,
//             req.body.AVGRPN,
//             req.body.actionTaken,
//             req.body.contingencyPlan,
//             req.body.status,
//             req.body.action_sav,
//             req.body.action_Occur,
//             req.body.action_Detect,
//             req.body.action_RPN,
//             req.body.created_date
//         ];

//         db.query(query, values, (error, results) => {
//             if (error) {
//                 console.error('Error inserting data:', error);
//                 return res.status(500).send('Error saving data to database.');
//             }

//         });


//      }
//     //   res.render("newriskmanagement");
//     res.redirect("/riskmanagement");
// });




app.post("/auditnew", async (req, res) => {
    console.log(req.body);
    const {
        contact_person,
        core_team,
        created_date,
        process_function,
        requirements,
        potentialFailureMode,
        potentialEffectsofFailure,
        severity,
        potentialCauses,
        occurrence,
        currentProcessControlsprevention,
        recommendedImprovement,
        Detect,
        RPN,
        AVGRPN,
        actionTaken,
        contingencyPlan,
        status,
        action_sav,
        action_Occur,
        action_Detect,
        action_RPN
    } = req.body;

    if (
        contact_person && core_team && created_date && process_function &&
        requirements && potentialFailureMode && potentialEffectsofFailure &&
        severity && potentialCauses && occurrence &&
        currentProcessControlsprevention && recommendedImprovement &&
        Detect && RPN && AVGRPN && actionTaken &&
        contingencyPlan && status && action_sav &&
        action_Occur && action_Detect && action_RPN
    ) {
        console.log(req.body);

        const y = Array.isArray(req.body.potentialFailureMode);
        const z = Array.isArray(req.body.currentProcessControlsprevention);
        console.log(y);
        console.log(z);

        try {

            if (y && z)//for both
            {
                console.log(req.body.potentialFailureMode.length + " insertions for first container");
                console.log(req.body.currentProcessControlsprevention.length + " insertions for second container");
                a = req.body.potentialFailureMode.length;
                b = req.body.currentProcessControlsprevention.length;
                //giving condition for  same no of containers
                if (!(a === b)) {
                    console.log(" sending invalid response.");
                    return res.status(400).send('Invalid');
                }

                console.log(" if");


                console.log("no of rows insertion" + a);


                for (let i = 0; i < a; i++) {
                    const query = `
                                INSERT INTO audit (
                                    contact_person, core_team, created_date, process_function, requirements, 
                                    potentialFailureMode, potentialEffectsofFailure, severity, potentialCauses, occurrence, 
                                    currentProcessControlsprevention, recommendedImprovement, Detect, RPN, AVGRPN, actionTaken, 
                                    contingencyPlan, status, action_sav, action_Occur, action_Detect, action_RPN, date
                                )
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            `;
                    const values = [
                        req.body.contact_person,
                        req.body.core_team,
                        req.body.created_date,
                        req.body.process_function,
                        req.body.requirements,
                        req.body.potentialFailureMode[i],
                        req.body.potentialEffectsofFailure[i],
                        req.body.severity[i],
                        req.body.potentialCauses[i],
                        req.body.occurrence[i],
                        req.body.currentProcessControlsprevention[i],
                        req.body.recommendedImprovement[i],
                        req.body.Detect[i],
                        req.body.RPN[i],
                        req.body.AVGRPN[i],
                        req.body.actionTaken[i],
                        req.body.contingencyPlan,
                        req.body.status,
                        req.body.action_sav,
                        req.body.action_Occur,
                        req.body.action_Detect,
                        req.body.action_RPN,
                        req.body.created_date
                    ];

                    db.query(query, values, (error, results) => {
                        if (error) {
                            console.error('Error inserting data:', error);
                            return res.status(500).send('Error saving data to database.');
                        }

                    });
                }




            }


            else {
                // Handle single row insertion
                console.log("inside else");
                const query = `
                    INSERT INTO audit (
                        contact_person, core_team, created_date, process_function, requirements, 
                        potentialFailureMode, potentialEffectsofFailure, severity, potentialCauses, occurrence, 
                        currentProcessControlsprevention, recommendedImprovement, Detect, RPN, AVGRPN, actionTaken, 
                        contingencyPlan, status, action_sav, action_Occur, action_Detect, action_RPN, date
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                const values = [
                    req.body.contact_person,
                    req.body.core_team,
                    req.body.created_date,
                    req.body.process_function,
                    req.body.requirements,
                    req.body.potentialFailureMode,
                    req.body.potentialEffectsofFailure,
                    req.body.severity,
                    req.body.potentialCauses,
                    req.body.occurrence,
                    req.body.currentProcessControlsprevention,
                    req.body.recommendedImprovement,
                    req.body.Detect,
                    req.body.RPN,
                    req.body.AVGRPN,
                    req.body.actionTaken,
                    req.body.contingencyPlan,
                    req.body.status,
                    req.body.action_sav,
                    req.body.action_Occur,
                    req.body.action_Detect,
                    req.body.action_RPN,
                    req.body.created_date
                ];

                db.query(query, values, (error, results) => {
                    if (error) {
                        console.error('Error inserting data:', error);
                        return res.status(500).send('Error saving data to database.');
                    }

                });


            }

            res.redirect("/riskmanagement");



        }
        catch (error) {

            console.error('Error processing request:', error);
            res.status(500).send('Server error.');
        }



    }
    else {
        console.log("Some fields are missing or empty.");

        res.status(400).send("Some fields are missing or empty.");
    }

});




app.post("/update", async (req, res) => {

    console.log("updation");
    // console.log(req.body);
    // console.log(req.body.risk_pk_id);
    // console.log(req.body.date);
    // console.log(req.body.created_date);
    const risk_pk_id = req.body.risk_pk_id;
    const contact_person = req.body.contact_person;
    const core_team = req.body.core_team;
    const created_date = req.body.created_date;
    const process_function = req.body.process_function;
    const requirements = req.body.requirements;
    const potentialFailureMode = req.body.potentialFailureMode;
    const potentialEffectsofFailure = req.body.potentialEffectsofFailure;
    const severity = req.body.severity;
    const potentialCauses = req.body.potentialCauses;
    const occurrence = req.body.occurrence;
    const currentProcessControlsprevention = req.body.currentProcessControlsprevention;
    const recommendedImprovement = req.body.recommendedImprovement;
    const Detect = req.body.Detect;
    const RPN = req.body.RPN;
    const AVGRPN = req.body.AVGRPN;
    const actionTaken = req.body.actionTaken;
    const contingencyPlan = req.body.contingencyPlan;
    const status = req.body.status;
    const action_sav = req.body.action_sav;
    const action_Occur = req.body.action_Occur;
    const action_Detect = req.body.action_Detect;
    const action_RPN = req.body.action_RPN;
    const date = req.body.date;
    console.log('risk_pk_id:', risk_pk_id);
    console.log('contact_person:', contact_person);
    console.log('core_team:', core_team);
    console.log('created_date:', created_date);
    console.log('process_function:', process_function);
    console.log('requirements:', requirements);
    console.log('potentialFailureMode:', potentialFailureMode);
    console.log('potentialEffectsofFailure:', potentialEffectsofFailure);
    console.log('severity:', severity);
    console.log('potentialCauses:', potentialCauses);
    console.log('occurrence:', occurrence);
    console.log('currentProcessControlsprevention:', currentProcessControlsprevention);
    console.log('recommendedImprovement:', recommendedImprovement);
    console.log('Detect:', Detect);
    console.log('RPN:', RPN);
    console.log('AVGRPN:', AVGRPN);
    console.log('actionTaken:', actionTaken);
    console.log('contingencyPlan:', contingencyPlan);
    console.log('status:', status);
    console.log('action_sav:', action_sav);
    console.log('action_Occur:', action_Occur);
    console.log('action_Detect:', action_Detect);
    console.log('action_RPN:', action_RPN);
    console.log('date:', date);


    try {
        if (
            risk_pk_id && contact_person && core_team && created_date &&
            process_function && requirements && potentialFailureMode &&
            potentialEffectsofFailure && severity && potentialCauses &&
            occurrence && currentProcessControlsprevention &&
            recommendedImprovement && Detect && RPN && AVGRPN &&
            actionTaken && contingencyPlan && status && action_sav &&
            action_Occur && action_Detect && action_RPN && date
        ) {


            // SQL query for updating the record
            const updateQuery = `
            UPDATE audit SET
                contact_person = ?,
                core_team = ?,
                created_date = ?,
                process_function = ?,
                requirements = ?,
                potentialFailureMode = ?,
                potentialEffectsofFailure = ?,
                severity = ?,
                potentialCauses = ?,
                occurrence = ?,
                currentProcessControlsprevention = ?,
                recommendedImprovement = ?,
                Detect = ?,
                RPN = ?,
                AVGRPN = ?,
                actionTaken = ?,
                contingencyPlan = ?,
                status = ?,
                action_sav = ?,
                action_Occur = ?,
                action_Detect = ?,
                action_RPN = ?,
                date = ?
            WHERE risk_pk_id = ?
        `;

            const values = [
                contact_person,
                core_team,
                created_date,
                process_function,
                requirements,
                potentialFailureMode,
                potentialEffectsofFailure,
                severity,
                potentialCauses,
                occurrence,
                currentProcessControlsprevention,
                recommendedImprovement,
                Detect,
                RPN,
                AVGRPN,
                actionTaken,
                contingencyPlan,
                status,
                action_sav,
                action_Occur,
                action_Detect,
                action_RPN,
                date,
                risk_pk_id
            ];


            db.execute(updateQuery, values, (err, results) => {
                if (err) {
                    console.error('Error updating record:', err);
                    return;
                }

                if (results.affectedRows > 0) {
                    console.log('Record updated successfully');
                } else {
                    console.log('No record found with the specified primary key');
                }
            });
        }

        else {
            res.status(400).send("Error: All fields are required and cannot be null or empty.");
        }

    } catch (error) { 
        res.status(400).send("Error:"+error);
    }
    res.redirect("/riskmanagement");
});



app.post("/revision", async (req, res) => {
    try {
        console.log(req.body);
        const { updatedactionplan, revisedtimeline, remarks } = req.body;

        // SQL query to insert data into revision_audit table
        const sql = `INSERT INTO revision_audit (updatedactionplan,revisedtimeline, remarks) VALUES (?, ?, ?)`;

        // Execute the query
        db.query(sql, [updatedactionplan, revisedtimeline, remarks], (error, results) => {
            if (error) {
                console.error('Error inserting data into revision_audit:', error);
                res.status(500).send('Database Error');
            } else {
                console.log('Data inserted successfully:', results);
                res.redirect('/riskmanagement');
            }
        });
    }
    catch (error) {
        console.error('Error in /revision route:', error);
        res.status(500).send('Server Error');

    }


});



app.listen(port, () => {
    console.log(`server is running at port no ${port}`);

});

