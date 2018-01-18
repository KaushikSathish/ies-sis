(function () {
    'use strict';
    var App = angular.module('app');

    App.controller('StudentProfileViewController', StudentProfileViewController);
    StudentProfileViewController.$inject = ['$scope', '$timeout', '$window', '$rootScope', '$state', '$stateParams', 'studentService', 'lookupService', 'gridfsService'];

    function StudentProfileViewController($scope, $timeout, $window, $rootScope, $state, $stateParams, studentService, lookupService, gridfsService) {
        var rollNumber = $stateParams.rollNumber;
        $scope.dirtyItems = {};
        $scope.notToggle = true;
        //if the current logged in user is having only student role make him view only his own profile
        if ($rootScope.Auth.principal.userRoles && $rootScope.Auth.principal.userRoles['STUDENT']) {
            $state.go('studentprofileview', { rollNumber: $rootScope.Auth.principal.preferred_username });
            return;
        }

        loadLookups();
        loadRulesAndMessagesForValidation();
        getStudentRecord();
        $scope.changeMobileSection = false;
        $scope.changeEmailSection = false;
        $scope.showSaveSectionLoader = false;
        $scope.showVerificationLoader = false;
        $scope.verifyEmail = false;
        $scope.verifyMobile = false;
        $scope.emailConfCodeMatched = true;
        $scope.mobileOTPMatched = true;
        $scope.dupeStudentRecord = {};
        $scope.userConfCode = {};
        addIndianPhoneValidation();
        $scope.showUploadDP = false;
        $scope.isDisplayPicture = false;
        $scope.showDpLoader = false;
        $scope.showLoader = false;
        $scope.studentRecord = {};
        $scope.recordToUpdate = {};
        $scope.unsavedAttachments = [];
        $scope.deleteAttachmentsOnSave = [];
        $scope.saveSuccess=false;   
        $scope.saveFailure = false;     

        $scope.editable = {};
        $scope.defaultState = -2;

        $scope.edit = function edit(sectionName, editable, index, formId) {
            var context = this;

            $scope.sectionState = "EDIT_MODE";
            $scope.currentSection = sectionName;
            context.editable[sectionName] = editable;
            if (!editable) {
                $scope.sectionState = "READ_MODE";
                $scope.deleteAttachmentsOnSave.splice(0);
                //dont have to do anything if the changes are discarded
                removeUnsavedAttachments();
                removeUnsavedDirtyItemsForlookup.call(context);
                return;
            }

            //if current student record already has value for this section, clone it inside recordToUpdate
            if (context.isArray) {
                var sectionDetails = JSON.parse(JSON.stringify($scope.studentRecord[sectionName]));
                var itemDetails;
                for (var i = 0; i < sectionDetails.length; i++) {
                    if (sectionDetails[i].itemIndex == index) {
                        itemDetails = sectionDetails[i];
                        break;
                    }
                }
                if (itemDetails) {
                    $scope.recordToUpdate[sectionName] = itemDetails;
                }
                if (context.holdersForDropzone) {
                    context.holdersForDropzone.forEach(function (h) {
                        context[h.name] = {};
                        context[h.name]["dupeMaxFiles"] = h.maxFiles - $scope.recordToUpdate[sectionName][h.name].length;
                        if (context[h.name]["dupeMaxFiles"]) {
                            loadDropzoneOptionsForSection.call(context, h.name, context[h.name]);
                        }
                    });
                }
            }
            else {
                if (!$scope.studentRecord[sectionName]) {
                    if (context.isSingleArray) {
                        $scope.studentRecord[sectionName] = [];
                    }
                    else {
                        $scope.studentRecord[sectionName] = {};
                    }
                }
                $scope.recordToUpdate[sectionName] = JSON.parse(JSON.stringify($scope.studentRecord[sectionName]));
                if (context.holders) {
                    context.holders.forEach(function (h) {
                        if (!$scope.recordToUpdate[sectionName][h]) {
                            $scope.recordToUpdate[sectionName][h] = [];
                        }
                    });
                }

                if (context.holdersForDropzone) {
                    context.holdersForDropzone.forEach(function (h) {
                        //init empty holders in the subsection
                        if (!$scope.recordToUpdate[sectionName][h.name]) {
                            $scope.recordToUpdate[sectionName][h.name] = [];
                            context[h.name] = {};
                            context[h.name]["dupeMaxFiles"] = h.maxFiles;
                            loadDropzoneOptionsForSection.call(context, h.name, context[h.name]);
                        }
                        else {
                            context[h.name] = {};
                            context[h.name]["dupeMaxFiles"] = h.maxFiles - $scope.recordToUpdate[sectionName][h.name].length;
                            if (context[h.name]["dupeMaxFiles"]) {
                                loadDropzoneOptionsForSection.call(context, h.name, context[h.name]);
                            }
                        }
                    });
                }
            }

            if (formId) {
                var rules = getValidationRules(sectionName);
                var messages = getValidationMessages(sectionName);
                validationOfProfileSection.call(context, true, sectionName, formId, rules, messages, null);
            }
        };

        function removeUnsavedDirtyItemsForlookup() {
            var context = this;
            if (!context.dirtyItems) {
                return;
            }
            var lookupKeyNames = Object.keys(context.dirtyItems);
            if (!lookupKeyNames.length) {
                return;
            }
            context.holdersForNewSelectItem.forEach(function (h) {
                var foundDirty = lookupKeyNames.find(function (key) {
                    return (h == key);
                });
                if (foundDirty) {
                    delete context.dirtyItems[h];
                }
            });
        }

        function removeUnsavedAttachments() {
            //check if any file attachment is done and remove it from grid fs.                    
            if (($scope.unsavedAttachments) && ($scope.unsavedAttachments.length > 0)) {
                gridfsService.removeDirtyAttachmentsForStudent($scope.unsavedAttachments, function (err, response) {
                    if (!err) {
                        $scope.unsavedAttachments.splice(0);
                    }
                });
            }
        }

        function checkForDirtyFields() {
            var context = this;
            if (!context.dirtyItems) {
                return;
            }
            var lookupKeyNames = Object.keys(context.dirtyItems);
            if (!lookupKeyNames.length) {
                return;
            }
            lookupKeyNames.forEach(function (keyName) {
                var foundInHolders = context.holdersForNewSelectItem.find(function (key) {
                    return (key == keyName);
                });

                if (foundInHolders) {
                    var values = convertToUpperCase(context.dirtyItems[keyName]);
                    if (!values) {
                        return;
                    }
                    lookupService.addNewItemsIntoLookup(keyName, values, function (err, res) {
                        if (!err) {
                            values.forEach(function (v) {
                                $scope[keyName].push(v);
                            });
                            delete context.dirtyItems[keyName];
                        }
                    });
                }
            });

            function convertToUpperCase(arrayOfValues) {
                if (arrayOfValues.length <= 0) {
                    return;
                }
                var upperCaseArray = [];
                arrayOfValues.forEach(function (item) {
                    upperCaseArray.push(item.toUpperCase());
                });
                return upperCaseArray;
            }
        }

        // To add one section item 
        $scope.addSectionItem = function addSectionItem(sectionName) {
            var context = this;
            $scope.recordToUpdate[sectionName] = {};
            if (context.holders) {
                //contains holders (array subsection) within this section
                context.holders.forEach(function (h) {
                    //init empty holders in the subsection
                    if (!$scope.recordToUpdate[sectionName][h]) {
                        $scope.recordToUpdate[sectionName][h] = [];
                    }
                }
                );
            }
            if (context.holdersForDropzone) {
                context.holdersForDropzone.forEach(function (h) {
                    //init empty holders in the subsection
                    if (!$scope.recordToUpdate[sectionName][h.name]) {
                        $scope.recordToUpdate[sectionName][h.name] = [];
                    }
                    context[h.name] = {};
                    context[h.name]["dupeMaxFiles"] = h.maxFiles;
                    loadDropzoneOptionsForSection.call(context, h.name, context[h.name]);
                });
            }
            $scope.currentSection = sectionName;
            context.editable[sectionName] = true;
            $scope.sectionState = "ADD_MODE";
        };

        $scope.deleteSectionItem = function (sectionName, itemIndex) {
            var context = this;
            //TODO get confirmation from user before deleting
            studentService.deleteSectionItem($scope.studentRecord.rollNumber, sectionName, itemIndex, function (err, response) {
                if (!err) {
                    var itemToBeDeleted = {};
                    var indexToDelete = -1;
                    for (var i = 0; i < $scope.studentRecord[sectionName].length; i++) {
                        if ($scope.studentRecord[sectionName][i].itemIndex == itemIndex) {
                            indexToDelete = i;
                            itemToBeDeleted = $scope.studentRecord[sectionName][i];
                        }
                    }

                    if (itemToBeDeleted) {
                        if ((context.holdersForDropzone) && (context.holdersForDropzone.length > 0)) {
                            context.holdersForDropzone.forEach(function (h) {
                                if ((itemToBeDeleted[h.name]) && (itemToBeDeleted[h.name].length > 0)) {
                                    gridfsService.removeDirtyAttachmentsForStudent(itemToBeDeleted[h.name], function (err, response) {
                                        if (!err) {
                                        }
                                    });
                                }
                            });
                        }
                    }
                    $scope.studentRecord[sectionName].splice(indexToDelete, 1);
                    $scope.showLoader = false;
                    showSuccessNotification();
                }
                else {
                    showFailureNotification();
                }
            });
        };

        $scope.saveSectionItem = function saveSectionItem(sectionName, formId) {
            var context = this;
            checkForDirtyFields.call(context);
            if (context.preSave) {
                context.preSave();
            }

            if (formId != 0) {
                var rules = getValidationRules(sectionName);
                var messages = getValidationMessages(sectionName);
                validationOfProfileSection.call(context, false, sectionName, formId, rules, messages, function (err, res) {
                    if (!err) {
                        $scope.showLoader = true;
                        if (context.isArray) {
                            if ($scope.sectionState == "ADD_MODE") {
                                //add new item to the section
                                addStudentRecordSectionArray(sectionName);
                            } else {
                                updateStudentRecordSection(sectionName);
                            }
                        }
                        else {
                            updateStudentRecordSection(sectionName);
                        }

                    }
                });
            }
            else {
                $scope.showLoader = true;
                if (context.isArray) {
                    if ($scope.sectionState == "ADD_MODE") {
                        //add new item to the section
                        addStudentRecordSectionArray(sectionName);
                    } else {
                        updateStudentRecordSection(sectionName);
                    }
                }
                else {
                    updateStudentRecordSection(sectionName);
                }

            }
        };

        function removePreservedDeletedItem() {
            if (($scope.deleteAttachmentsOnSave) && ($scope.deleteAttachmentsOnSave.length > 0)) {
                gridfsService.removeDirtyAttachmentsForStudent($scope.deleteAttachmentsOnSave, function (err, response) {
                    if (!err) {
                        $scope.deleteAttachmentsOnSave.splice(0);
                    }
                });
            }
            else {
                return;
            }
        }

        function updateStudentRecordSection(sectionName) {
            var editableSectionIndex = $scope.recordToUpdate[sectionName].itemIndex;

            studentService.updateStudentSectionItem($scope.studentRecord.rollNumber, sectionName, editableSectionIndex, $scope.recordToUpdate[sectionName], function (err, response) {
                if (!err) {
                    $scope.showLoader = false;
                    showSuccessNotification();
                    removePreservedDeletedItem();
                    if (editableSectionIndex >= 0) {
                        //the updated section is an array, overwrite the section item in the given index
                        var indexToUpdate = -1;
                        for (var i = 0; i < $scope.studentRecord[sectionName].length; i++) {
                            if ($scope.studentRecord[sectionName][i].itemIndex == editableSectionIndex) {
                                indexToUpdate = i;
                            }
                        }
                        $scope.studentRecord[sectionName][indexToUpdate] = $scope.recordToUpdate[sectionName];
                    } else {
                        //the updated section is not an array, overwrite the section details
                        $scope.studentRecord[sectionName] = $scope.recordToUpdate[sectionName];
                    }
                    $scope.unsavedAttachments.splice(0);
                    delete $scope.recordToUpdate[sectionName];
                    $scope.edit(sectionName, false);
                }
                else {
                    showFailureNotification();
                }
            });
        }

        function addStudentRecordSectionArray(sectionName) {
            //include the item index
            var sectionDetails = $scope.studentRecord[sectionName];
            var lastGeneratedItemIndex = 0;
            if (sectionDetails) {
                var secLen = sectionDetails.length;
                if (secLen) {
                    //increment max generated item index by 1 and assign for newly added item
                    lastGeneratedItemIndex = sectionDetails[secLen - 1].itemIndex + 1;
                }
            }
            $scope.recordToUpdate[sectionName].itemIndex = lastGeneratedItemIndex;

            studentService.addStudentSectionItem($scope.studentRecord.rollNumber, sectionName, $scope.recordToUpdate[sectionName], function (err, response) {
                if (!err) {
                    $scope.showLoader = false;
                    showSuccessNotification();

                    if (!$scope.studentRecord[sectionName]) {
                        //the updated section is not an array, overwrite the section details
                        $scope.studentRecord[sectionName] = [];
                    }
                    $scope.studentRecord[sectionName].push($scope.recordToUpdate[sectionName]);

                    $scope.unsavedAttachments.splice(0);
                    delete $scope.recordToUpdate[sectionName];
                    $scope.edit(sectionName, false);
                }
                else {
                    showFailureNotification();
                }
            });
        }

        //"Reading Books","Writing Poems","Playing Cricket"
        var profileWeight = ["courseCode", "religion", "nativity", "fatherOccupation", "sportsPerson", "differentlyAbled", "defencePerson", "andamanNicobar", "state", "age", "dob", "community", "fatherName", "city", "schoolName", "caste", "foccupation", "fphone", "motherName", "moccupation", "mphone", "addressLine1", "pincode", "auditTrail", "dobStr", "section", "tcNo", "tcDate", "addressLine2", "addressLine3", "rollNumber", "branchName", "programName", "shortBio", "doj", "semesterNo", "bloodGroup", "status", "remarks", "identity1", "identity2", "quota", "specialQuota", "hosteler", "dota", "height", "weight", "studentName", "studentContactNo", "studentGender", "studentNationality", "studentNameAdhaar", "studentNamePassport", "studentSecContactNo", "studentAdhaarNo", "studentPassportNo", "languagesKnown","digitalIdentities"];
        $scope.profilePercentage;
        var profileAccount = 0;
        //load student

        function getStudentRecord() {
            studentService.getStudentById(rollNumber, function (err, response) {
                if (!err) {
                    $scope.studentRecord = response;
                    $scope.displayPicture.dzOptions.params = $scope.studentRecord;
                    if ($scope.studentRecord.displayPicture) {
                        loadDisplayPicture($scope.studentRecord.displayPicture);
                    }
                    else {
                        $scope.dpSource = "/img/avatars/noimage.png";
                    }

                    if (!$scope.studentRecord.languagesKnown || !$scope.studentRecord.languagesKnown.length) {
                        $scope.studentRecord.languagesKnown = [];
                        $scope.studentRecord.languagesKnown.push({  name: "", read: false, write: false, speak: false })
                    }

                    if (!$scope.studentRecord.digitalIdentity || !$scope.studentRecord.digitalIdentity.length) {
                        $scope.studentRecord.digitalIdentity = [];
                        $scope.studentRecord.digitalIdentity.push({name: "",nameOther:"", urlOther:"", url:"" })
                    }
                    if (!$scope.studentRecord.basic || !$scope.studentRecord.basic.nationality) {
                        $scope.studentRecord.basic = {};
                        $scope.studentRecord.basic.nationality = 'India';
                    }

                    profileWeight.forEach(function (profileWeightItem) {
                        if ($scope.studentRecord[profileWeightItem]) {
                            profileAccount++;
                        }
                    }, this);

                    $scope.profilePercentage = Math.round((profileAccount / profileWeight.length) * 100);
                }
            });
        }


        $scope.addLanguage = function () {
            $scope.recordToUpdate.languagesKnown.push({ name: "", read: false, write: false, speak: false });
        }

        $scope.removeLanguage = function (index) {
            $scope.recordToUpdate.languagesKnown.splice(index, 1);
        }

        $scope.addDigitalIdentity = function () {
            $scope.recordToUpdate.digitalIdentity.push({name: "",nameOther:"",urlOther:"", url:"" });
        }

        $scope.removeDigitalIdentity = function (index) {
            $scope.recordToUpdate.digitalIdentity.splice(index, 1);
        }

        function addIndianPhoneValidation() {
            jQuery.validator.addMethod('phoneUS', function (phone_number, element) {
                phone_number = phone_number.replace(/\s+/g, '');
                return this.optional(element) || phone_number.length > 9 &&
                    phone_number.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
            }, 'Please enter a valid phone number.');
        }

        var validAddMobileNumber = function (callback) {
            var mobileValidator = $("#addMobileForm").validate({
                ignore: [],
                errorClass: 'help-block animated fadeInDown',
                errorElement: 'div',
                errorPlacement: function (error, e) {
                    jQuery(e).parents('.form-group > div').append(error);
                },
                highlight: function (e) {
                    var elem = jQuery(e);
                    callback('not_valid', mobileValidator);
                    elem.closest('.form-group').removeClass('has-error').addClass('has-error');
                    elem.closest('.help-block').remove();
                },
                success: function (e) {
                    var elem = jQuery(e);
                    callback(null, mobileValidator);
                    elem.closest('.form-group').removeClass('has-error');
                    elem.closest('.help-block').remove();
                },
                rules: {
                    'val-studentMobile': {
                        required: true,
                        phoneUS: true
                    }
                },
                messages: {
                    'val-studentMobile': "Enter a vaild mobile number"
                }
            });
        }

        $scope.userTypesMobileNumber = function () {
            $(".mobileForm").closest('.form-group').removeClass('has-error');
            $(".mobileForm").closest('.help-block').remove();
        }

        var validAddEmail = function (callback) {
            var emailValidator = $("#addEmailForm").validate({
                ignore: [],
                errorClass: 'help-block animated fadeInDown',
                errorElement: 'div',
                errorPlacement: function (error, e) {
                    jQuery(e).parents('.form-group > div').append(error);
                },
                highlight: function (e) {
                    var elem = jQuery(e);
                    callback('not_valid', emailValidator);

                    elem.closest('.form-group').removeClass('has-error').addClass('has-error');
                    elem.closest('.help-block').remove();
                },
                success: function (e) {
                    var elem = jQuery(e);
                    callback(null, emailValidator);
                    elem.closest('.form-group').removeClass('has-error');
                    elem.closest('.help-block').remove();
                },
                rules: {
                    'val-studentEmail': {
                        required: true,
                        email: true
                    }
                },
                messages: {
                    'val-studentEmail': "Enter a valid email-address"
                }
            });
        };

        //Sweet alert for Confirmation before Delete

        $scope.deleteOnConfirmation = function (sectionName, index) {
            var context = this;
            //Confirm alert on button click            
            swal({
                title: 'Delete Section Item?',
                text: 'You will not be able to recover this Section Item!',
                showCancelButton: true,
                confirmButtonColor: '#d26a5c',
                confirmButtonText: 'Yes, delete it!',
                html: false,
                preConfirm: function () {
                    return new Promise(function (resolve) {
                        $scope.deleteSectionItem.call(context, sectionName, index);
                        setTimeout(function () {
                            resolve();
                        }, 50);
                    });
                }
            }).then(
                function (result) {
                    swal('Deleted!', 'Section Item has been deleted.', 'success');
                }, function (dismiss) {
                    // dismiss can be 'cancel', 'overlay', 'esc' or 'timer'
                }
                );
        };

        $scope.openChangeMobile = function (OPTag) {
            $scope.mobileOPTag = OPTag;
            $scope.changeMobileSection = true;
            $scope.dupeStudentRecord = JSON.parse(JSON.stringify($scope.studentRecord));
        };

        $scope.cancelSaveMobile = function () {
            $scope.changeMobileSection = false;
        };

        $scope.openChangeEmail = function (OPTag) {
            $scope.emailOPTag = OPTag;
            $scope.changeEmailSection = true;
            $scope.dupeStudentRecord = JSON.parse(JSON.stringify($scope.studentRecord));
        };

        $scope.cancelSaveEmail = function () {
            $scope.changeEmailSection = false;
        };

        $scope.saveEmail = function () {
            validAddEmail(function (err, res) {
                if (!err) {
                    var dataToBeUpdated = {};
                    dataToBeUpdated["studentEmail"] = $scope.dupeStudentRecord.studentEmail;
                    dataToBeUpdated["emailVerification"] = false;
                    $scope.showSaveSectionLoader = true;
                    studentService.updateStudentCoreDetails(rollNumber, dataToBeUpdated, function (err, response) {
                        if (!err) {
                            $scope.studentRecord.studentEmail = $scope.dupeStudentRecord.studentEmail;
                            $scope.studentRecord.emailVerification = false;
                            $scope.showSaveSectionLoader = false;
                            $scope.changeEmailSection = false;
                        }
                        else {
                            document.body.scrollTop = document.documentElement.scrollTop = 0;
                        }
                    });
                }
                else {
                    res.destroy();
                }
            });
        };

        $scope.saveMobileNumber = function () {
            validAddMobileNumber(function (err, res) {
                if (!err) {
                    var dataToBeUpdated = {};
                    dataToBeUpdated["studentContactNo"] = $scope.dupeStudentRecord.studentContactNo;
                    dataToBeUpdated["mobileVerification"] = false;
                    $scope.showSaveSectionLoader = true;
                    studentService.updateStudentCoreDetails(rollNumber, dataToBeUpdated, function (err, response) {
                        if (!err) {
                            $scope.studentRecord.studentContactNo = $scope.dupeStudentRecord.studentContactNo;
                            $scope.studentRecord.mobileVerification = false;
                            $scope.showSaveSectionLoader = false;
                            $scope.changeMobileSection = false;
                        }
                        else {
                            document.body.scrollTop = document.documentElement.scrollTop = 0;
                        }
                    });
                }
                else {
                    res.destroy();
                }
            });
        };

        $scope.openVerifyEmail = function () {
            //clear error tags around html
            $scope.userTypesEmailConfCode();
            $scope.userConfCode = {};
            $scope.showVerificationLoader = true;
            $scope.emailConfCode = generateConfCode();
            studentService.sendConfCodeToEmail($scope.studentRecord.studentEmail, $scope.emailConfCode, function (err, res) {
                if (!err) {
                    $scope.showVerificationLoader = false;
                    $scope.verifyEmail = true;
                }
            })
        };

        $scope.userTypesEmailConfCode = function () {
            $(".emailCode").closest('.form-group').removeClass('has-error');
            $(".emailCode").closest('.help-block').remove();
            $scope.emailConfCodeMatched = true;
        };

        $scope.userTypesMobileConfCode = function () {
            $(".mobileCode").closest('.form-group').removeClass('has-error');
            $(".mobileCode").closest('.help-block').remove();
            $scope.mobileOTPMatched = true;
        };

        $scope.checkEmailConfCode = function () {
            if ($scope.userConfCode.email == $scope.emailConfCode) {
                $scope.emailConfCodeMatched = true;
                var dataToBeUpdated = {};
                dataToBeUpdated["emailVerification"] = true;
                $scope.showVerificationLoader = true;
                studentService.updateStudentCoreDetails(rollNumber, dataToBeUpdated, function (err, response) {
                    if (!err) {
                        $scope.studentRecord.emailVerification = true;
                        $scope.showVerificationLoader = false;
                        $scope.verifyEmail = false;
                    }
                    else {
                        document.body.scrollTop = document.documentElement.scrollTop = 0;
                    }
                });
            }
            else {
                $(".emailCode").closest('.form-group').removeClass('has-error').addClass('has-error');
                $(".emailCode").closest('.help-block').remove();
                $scope.emailConfCodeMatched = false;
            }
        };

        function generateConfCode() {
            var code = Math.floor(1000 + Math.random() * 9000);
            return code;
        }

        $scope.openVerifyMobile = function () {
            //clear error tags around html
            $scope.userTypesMobileConfCode();
            $scope.userConfCode = {};
            $scope.showVerificationLoader = true;
            $scope.mobileConfCode = generateConfCode();
            studentService.sendOTPtoMobile($scope.studentRecord.studentContactNo, $scope.mobileConfCode, function (err, res) {
                if (!err) {
                    $scope.showVerificationLoader = false;
                    $scope.verifyMobile = true;
                }
            })
        };

        $scope.checkMobileOTP = function () {
            if ($scope.userConfCode.mobile == $scope.mobileConfCode) {
                $scope.mobileOTPMatched = true;
                var dataToBeUpdated = {};
                dataToBeUpdated["mobileVerification"] = true;
                $scope.showVerificationLoader = true;
                studentService.updateStudentCoreDetails(rollNumber, dataToBeUpdated, function (err, response) {
                    if (!err) {
                        $scope.studentRecord.mobileVerification = true;
                        $scope.showVerificationLoader = false;
                        $scope.verifyMobile = false;
                    }
                    else {
                        document.body.scrollTop = document.documentElement.scrollTop = 0;
                    }
                });
            }
            else {
                $(".mobileCode").closest('.form-group').removeClass('has-error').addClass('has-error');
                $(".mobileCode").closest('.help-block').remove();
                $scope.mobileOTPMatched = false;
            }
        }

        $scope.openDropzoneUploadDP = function () {
            $scope.showUploadDP = true;
        };

        $scope.closeDropzoneUploadDP = function () {
            if ($scope.isDisplayPicture) {
                $scope.displayPicture.dzMethods.removeFile($scope.lastAddedFile);
            }
            $scope.showUploadDP = false;
        };

        $scope.saveDisplayPicture = function () {
            $scope.showDpLoader = true;
            $scope.displayPicture.dzMethods.processQueue();
        };

        function loadDisplayPicture(attachmentDetails) {
            $scope.dpSource = "/students/" + rollNumber + "/displayPicture/" + attachmentDetails.originalname;
        }

        $scope.openAttachedFile = function (sectionName, index, fieldName, fileName) {
            var landingUrl = encodeURI("/students/" + rollNumber + "/open/" + sectionName + "/" + index + "/" + fieldName + "/" + fileName);

            $window.open(landingUrl, "_blank");
            return false;
        }

        // function removeAttachedDisplayPicture(filename) {
        //     studentService.removeAttachment(rollNumber, filename, function (err, res) {
        //         if (!err) {
        //             $scope.isDisplayPicture = false;
        //             console.log("File removed successfully");
        //         }
        //     });
        // }

        $scope.displayPicture = {
            dzOptions: {
                dictDefaultMessage: "Drop your Profile Picture here",
                url: "/students/displayPicture/upload",
                method: "put",
                parallelUploads: 1,
                acceptedFiles: 'image/jpeg, images/jpg, image/png',
                autoProcessQueue: false,
                uploadMultiple: false,
                addRemoveLinks: true,
                maxFileSize: 5120,
                paramName: function () {
                    return "displayPicture";
                },
                maxFiles: 1,
                createImageThumbnails: true,
                params: $scope.studentRecord,
                renameFile: function (file) {
                    file.upload.filename = file.name;
                }
            },
            dzCallbacks: {
                init: function () {
                    this.on("addedfile", function (file) {
                        alert("Added file.");
                    });
                },
                "sending": function (file, xhr, formData) {
                    formData.append("rollNumber", rollNumber);
                },
                "addedfile": function (file) {
                    $scope.isDisplayPicture = true;
                    $scope.lastAddedFile = file;
                },
                "success": function (file, xhr) {
                    $scope.showDpLoader = false;
                    $scope.showUploadDP = false;
                    loadDisplayPicture({ originalname: file.name });
                },
                "removedfile": function (file) {
                    $scope.isDisplayPicture = false;
                    // removeAttachedDisplayPicture(file.name);
                }
            },
            dzMethods: {

            }
        };

        function loadDropzoneOptionsForSection(fieldName, dynamicOptions) {
            var context = this;
            if (!$scope.fileAttachment) {
                $scope.fileAttachment = {};
            }
            $scope.fileAttachment[fieldName] = {
                dzOptions: {
                    url: "/students/file/upload",
                    method: "put",
                    parallelUploads: 1,
                    acceptedFiles: 'image/*, application/pdf',
                    autoProcessQueue: true,
                    maxFileSize: 5120,
                    paramName: function () {
                        return "fileAttachment";
                    },
                    maxFiles: dynamicOptions.dupeMaxFiles,
                    createImageThumbnails: false,
                    previewsContainer: false,
                    params: $scope.studentRecord,
                    renameFile: function (file) {
                        file.upload.filename = file.name;
                    }
                },
                dzCallbacks: {
                    init: function () {
                        this.on("addedfile", function (file) {
                        });
                    },
                    "sending": function (file, xhr, formData) {
                        formData.append("rollNumber", rollNumber);
                    },
                    "addedfile": function (file) {
                    },
                    "success": function (file, xhr) {
                        var files = xhr;
                        processUploadedFiles.call(context, files);
                    },
                    "removedfile": function (file) {
                        // userRemovedAttachedFile(file);
                    },
                    "complete": function (file) {
                    }
                },
                dzMethods: {

                }
            };
        }

        $scope.removeAttachment = function userRemovedAttachedFile(unprocessedFile, removedFromField) {
            var context = this;
            var removedFileArray = [];
            $scope.notToggle = false;

            if (unprocessedFile.xhr) {
                removedFileArray = JSON.parse(unprocessedFile.xhr.response);
            }
            else {
                removedFileArray.push(unprocessedFile);
            }
            if ($scope.sectionState = "EDIT_MODE") {
                if (!($scope.deleteAttachmentsOnSave) && ($scope.deleteAttachmentsOnSave.length > 0)) {
                    $scope.deleteAttachmentsOnSave = [];
                }
                removedFileArray.forEach(function (file) {
                    $scope.deleteAttachmentsOnSave.push(file);
                });
                removeFileFromRecordToUpdate(removedFileArray, removedFromField);
                reinitializeDropzoneDOM();
            }
            else {
                gridfsService.removeDirtyAttachmentsForStudent(removedFileArray, function (err, response) {
                    if (!err) {
                        reinitializeDropzoneDOM();
                        // to remove the record from cloned array for student record
                        removeFileFromRecordToUpdate(removedFileArray, removedFromField);
                        // to check whether the removed file is unsaved, if so remove from unsaved, since it is already removed just above
                        checkIfRemovedFileUnsaved(removedFileArray);
                    }
                });
            }
            function reinitializeDropzoneDOM() {
                // to increment the dupeMaxFile since onefile  is removed
                context[removedFromField].dupeMaxFiles = context[removedFromField].dupeMaxFiles + 1;
                var currentIndex = context['holdersForDropzone'].findIndex(function (h) {
                    return (h.name == removedFromField);
                });
                context['holdersForDropzone'][currentIndex].maxFiles = context[removedFromField].dupeMaxFiles;
                loadDropzoneOptionsForSection.call(context, removedFromField, context[removedFromField])
                // toggle between true and false happens because to re initiate the dom element of dropzone.
                $scope.notToggle = true;
            }
        }

        function checkIfRemovedFileUnsaved(toBeRemoved) {
            if (!(($scope.unsavedAttachments) && ($scope.unsavedAttachments.length > 0))) {
                return;
            }
            toBeRemoved.forEach(function (rFile) {
                var index = $scope.unsavedAttachments.findIndex(function (attachment) {
                    return (attachment.id == rFile.id);
                });
                if (index != -1) {
                    $scope.unsavedAttachments.splice(index, 1);
                }
            })
        }

        function removeFileFromRecordToUpdate(toBeRemoved, removedFromField) {
            toBeRemoved.forEach(function (rFile) {
                var index = $scope.recordToUpdate[$scope.currentSection][removedFromField].findIndex(function (attachment) {
                    return (attachment.id == rFile.id);
                });
                if (index != -1) {
                    $scope.recordToUpdate[$scope.currentSection][removedFromField].splice(index, 1);
                }
            });
        }

        function processUploadedFiles(files) {
            var context = this;
            var fileDetails = {};
            if (!$scope.recordToUpdate[$scope.currentSection][context.attachmentField])
                $scope.recordToUpdate[$scope.currentSection][context.attachmentField] = [];

            if (!(($scope.unsavedAttachments) && ($scope.unsavedAttachments.length > 0))) {
                $scope.unsavedAttachments = [];
            }

            files.forEach(function (uploadedFile) {
                fileDetails = {
                    id: uploadedFile.id.toString(),
                    contentType: uploadedFile.contentType,
                    filename: uploadedFile.filename,
                    originalname: uploadedFile.originalname,
                    size: uploadedFile.size
                };
                $scope.unsavedAttachments.push(fileDetails);
                $scope.recordToUpdate[$scope.currentSection][context.attachmentField].push(fileDetails);
                context[context.attachmentField].dupeMaxFiles = context[context.attachmentField].dupeMaxFiles - 1;
            });
        }

        $scope.checkIfOthersPressed = function (modalID, value) {
            if (value == 0) {
                $(modalID).modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $(modalID).modal('show');
            }
        };

        $scope.onCancellingAddNewFieldToBasicDetails = function (editScopeVariable) {
            $scope.recordToUpdate.basic[editScopeVariable] = '';
        }

        $scope.setCustomValueToBasicDetails = function (editScopeVariable, lookupArray, value) {
            lookupService.addFieldToLookup(lookupArray, value, function (err, res) {
                if (!err) {
                    if (res[0] != 0) {
                        $scope.recordToUpdate.basic[editScopeVariable] = value;
                        $scope[lookupArray].push(value);
                    }
                    else {
                        $scope.recordToUpdate.basic[editScopeVariable] = res[1];
                    }
                }
            });
        }

        function loadLookups() {
            var lookupFields = ["nationalities", "publishedSources", "boards", "eventTypes", "eventCategories", "eventPrizes", "eventRoles", "organizingBody", "qualificationTypes", "technicalSkills", "interests", "itSkillsLanguages", "itSkillsOs", "itSkillsTechnologies", "itSkillsTools", "eventOf", "worldLanguages", "roles", "indianStates", "indianCities", "motherTongues", "communities", "castes", "religions", "govtScholarship", "associations", "clubs", "awards", "cities", "hobbies", "coCurriculumCategory", "extraCurriculumCategory","digitalIdentities"];
            var lookupFieldsNotToSort = ["qualificationTypes","digitalIdentity"];

            lookupFields.forEach(function (fieldName) {
                lookupService.loadDataFields(fieldName, function (err, res) {
                    if (lookupFieldsNotToSort.indexOf(fieldName) == -1) {
                        //sort the current lookup values
                        res.sort(function (a, b) {
                            if (a < b) return -1;
                            else if (a > b) return 1;
                            return 0;
                        });
                    }
                    $scope[fieldName] = [];
                    $scope[fieldName] = res;
                });
            });
        }

        var validationOfProfileSection = function (onLoad, sectionName, formId, rules, messages, callback) {
            var contextScope = this;
            contextScope.onLoad = onLoad;
            var validator = $(formId).validate({
                ignore: [],
                errorClass: 'help-block animated fadeInDown',
                errorElement: 'div',
                errorPlacement: function (error, e) {
                    if (!contextScope.onLoad) {
                        jQuery(e).parents('.form-group > div').append(error);
                    }
                },
                highlight: function (e) {
                    var elem = jQuery(e);
                    if (!contextScope.onLoad) {
                        elem.closest('.form-group').removeClass('has-error').addClass('has-error');
                        elem.closest('.help-block').remove();
                    }
                },
                success: function (e) {
                    var elem = jQuery(e);
                    elem.closest('.form-group').removeClass('has-error');
                    elem.closest('.help-block').remove();
                },
                rules: rules,
                messages: messages
            });
            if (contextScope.onLoad) {
                $(formId).valid();
            }
            else if ($(formId).valid()) {
                callback(null, validator);
            }
        };

        var getValidationRules = function (sectionName) {
            var rules = {};
            rules = $scope.rulesAndMessages[sectionName].rules;
            return rules;
        }

        var getValidationMessages = function (sectionName) {
            var messages = {};
            messages = $scope.rulesAndMessages[sectionName].messages;
            return messages;
        }

        function loadRulesAndMessagesForValidation() {
            lookupService.loadValidationRulesForAllForms(function (err, res) {
                if (!err) {
                    $scope.rulesAndMessages = {};
                    $scope.rulesAndMessages = res;
                }
            })
        }

        // Date validation half baked TODO
        // var validDate = function (callback) {
        //     var dateValidator = $("#editClubsInfo").validate({
        //         rules: {
        //             'startDate': {
        //                 dpCompareDate: "notAfter #endDate"
        //             },
        //             'endDate': {
        //                 dpCompareDate: "notAfter #startdDate"
        //             }
        //         },
        //         messages: {
        //             'startDate': "Check Dates",
        //             'endDate': "Check Dates"
        //         }

        //     });
        // };

        function showSuccessNotification() {
           $scope.saveSuccess = true;
           $timeout(function() {
            $scope.saveSuccess = false;
           }, 5000);
        }

        function showFailureNotification() {
            $scope.saveFailure = true;
            $timeout(function() {
             $scope.saveFailure = false;
            }, 5000);
        };

        $scope.addNewItemToLookup = function (keyName, value, isMultiple) {
            if (!this.dirtyItems) {
                this.dirtyItems = {};
            }

            if (!this.dirtyItems[keyName]) {
                var foundInLookups = checkForDupeInLookups(keyName, value);
                if (!foundInLookups) {
                    this.dirtyItems[keyName] = [];
                    this.dirtyItems[keyName].push(value);
                }
                return;
            }

            if (isMultiple) {
                // push into array, since multple values can be selected
                var found = checkForDupeInExistingDirty.call(this, keyName, value);
                if (!found) {
                    this.dirtyItems[keyName].push(value);
                }
            }
            else { // if not, then overwrite the old value with latest value
                this.dirtyItems[keyName] = [];
                this.dirtyItems[keyName].push(value);
            }

            function checkForDupeInLookups(keyName, value) {
                value = value.toUpperCase();
                var found = $scope[keyName].find(function (item) {
                    item = item.toUpperCase();
                    return (value == item);
                })
                if (found) {
                    return true;
                }
                else {
                    return false;
                }
            }

            function checkForDupeInExistingDirty(keyName, value) {
                value = value.toUpperCase();
                var found = this.dirtyItems[keyName].find(function (item) {
                    item = item.toUpperCase();
                    return (value == item);
                })
                if (found) {
                    return true;
                }
                else {
                    return false;
                }
            }
        };
    }
})();