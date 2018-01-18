const dbUtil = require('../daos/MongodDbUtil');
var appLogger = require('../logging/appLogger');
const authService = require('../services/authService');
const studentService = require('../services/studentService');

dbUtil.connect(function (err, db) {
    if (err) {
        console.error("Not able to connect to MongoDB");
    } else {
        deleteUserAccounts(db);
    }
});

function deleteUserAccounts(db) {
    var coll = db.collection("students");

    studentService.filterStudents({}, ["rollNumber"], function(err, students) {
        authService.deleteUsers("ies", students, function(authErr, authResponse) {
            if (!authErr) {
                console.log("Deleted user accounts");
            } else {
                console.log("Error while deleting user accounts " + JSON.stringify(authErr));
            }
            process.exit();
        });
    });
};

