'use strict';

let adminClient = require('../kc-admin-client/kc-admin-client');
var appLogger = require('../logging/appLogger');
var config = require('../config/config.' + process.env.NODE_ENV);
let settings = config.authServerConfig.settings;
var realmName = config.authServerConfig.realmName;
var STUDENT_GROUP = config.authServerConfig.studentUserGroup;

//reference to Keycloak REST API client
var kcApiClient;
var studentGroupId;

//initialize client
adminClient(settings)
    .then((client) => {
        appLogger.info("Connected successfully to Keycloak server");

        kcApiClient = client;

        client.groups.find(realmName).then((groups) => {
            if (groups.length > 0) {
                groups.forEach(function (g) {
                    if (g.name == STUDENT_GROUP) {
                        studentGroupId = g.id;
                    }
                });
            }
        });
    }) //end adminClient
    .catch((err) => {
        appLogger.error(err, "Error while trying to connect to KeyCloak server");
    });

function createUser(userRecord, callback) {
    var authUser = createAuthUser(userRecord);

    adminClient(settings)
        .then((client) => {

            // STEP 1: createUser
            client.users.create(realmName, authUser)
                .then((createdUser) => {
                    appLogger.info(`Created user account for ${authUser.rollNumber} with id ${createdUser.id}`);

                    //STEP 2: set password
                    var passwdVal = { temporary: true, value: userRecord.rollNumber };
                    var passwdPromise = client.users.resetPassword(realmName, createdUser.id, passwdVal);

                    //STEP 3: join student group to get the required roles in the system
                    passwdPromise.then(function () {
                        appLogger.info(`Password is set for user account ${authUser.rollNumber}`);

                        client.users.joinGroup(realmName, createdUser.id, studentGroupId).then((updatedUser) => {
                            appLogger.info(`Updated user ${authUser.rollNumber} with student group successfully`);
                            callback(null, createdUser);

                        }).catch((err) => {
                            appLogger.error(err, "Error while trying to associate user to the Student group");
                            callback(err, createdUser);
                        });;//end groups update promise

                    }).catch((err) => {
                        appLogger.error(err, "Error while trying to set password in KeyCloak server");
                        callback(err, createdUser);
                    });;//end passwd promise

                });//end create promise
        });
}

function deleteUser(realm, userRecord, callback) {
    adminClient(settings)
        .then((client) => {
            //STEP 1:  find user record to fetch User Id from it
            client.users.find(realm, { username: userRecord.rollNumber.toLowerCase() })
                .then((foundUser) => {

                    if ((foundUser) && (foundUser.length == 1)) {
                        foundUser = foundUser[0];
                    } else {
                        var foundErr = new Error("No user records found for " + userRecord.rollNumber);
                        appLogger.error(foundErr, foundErr.message);
                        callback(foundErr, userRecord);
                        return;
                    }

                    // STEP 2: deleteUser
                    client.users.remove(realm, foundUser.id)
                        .then((deletedUser) => {
                            appLogger.info(`Deleted user account ${userRecord.rollNumber}`);
                            callback(null, userRecord);
                        }).catch((err) => {
                            appLogger.error(err, "Error while trying to remove user " + userRecord.rollNumber + " in KeyCloak server");
                            callback(err, userRecord);
                        });//end remove promise

                }).catch((findErr) => {
                    appLogger.error(findErr, "Error while trying to find user before removing " + userRecord.rollNumber + " in KeyCloak server");
                    callback(findErr, userRecord);

                });

        });
}

function createUsers(users, callback) {
    var processedUsers = [];
    var errorUsers = [];

    createItr(users, 0, processedUsers, errorUsers, callback);

    function createItr(records, index, processedRecords, errorRecords, callback) {
        if (index >= records.length) {
            callback(((errorRecords.length == 0) ? null : errorRecords), processedRecords);
            return;
        }

        var user = records[index];
        createUser(user, function (err, createdUser) {
            if (err) {
                errorRecords.push(user);
            }
            processedUsers.push(createdUser);

            createItr(records, index + 1, processedRecords, errorRecords, callback);
        });
    }
}

function deleteUsers(realm, users, callback) {
    var processedUsers = [];
    var errorUsers = [];

    deleteItr(realm, users, 0, processedUsers, errorUsers, callback);

    function deleteItr(realm, records, index, processedRecords, errorRecords, callback) {
        if (index >= records.length) {
            callback(((errorRecords.length == 0) ? null : errorRecords), processedRecords);
            return;
        }

        var user = records[index];
        deleteUser(realm, user, function (err, deletedUser) {
            if (err) {
                errorRecords.push(user);
            }
            processedUsers.push(deletedUser);

            deleteItr(realm, records, index + 1, processedRecords, errorRecords, callback);
        });
    }
}

function createAuthUser(userRecord) {
    var authUser = {};

    authUser.firstName = userRecord.studentName;
    authUser.username = userRecord.rollNumber;
    authUser.enabled = true;

    //TODO get the list of attributes from the function itself
    authUser.attributes = {
        programName: userRecord.programName,
        branchName: userRecord.branchName,
        degreeName: userRecord.degreeName,
        currentSem: userRecord.currentSem
    };

    if (userRecord.email) {
        authUser.email = userRecord.email;
    }

    return authUser;
}

module.exports.createUser = createUser;
module.exports.createUsers = createUsers;
module.exports.deleteUser = deleteUser;
module.exports.deleteUsers = deleteUsers;
