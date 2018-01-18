var staticStudents = [{
    degree: 'Bachelors',
    programName: 'BE AUTOMOBILE ENGINEERING',
    rollNumber: '13Z240',
    name: 'PRASANNA',
    dob: '27/3/96',
    age: '21',
    gender: 'male',
    fatherName: 'dady',
    motherTongue: 'Saurastra',
    address: 'aaaaaaaaaaaaaaaaaaaaaaaaa,bbbbbbbbbbbbbbbbb,baaaaaaaaaaaaaaaaaaaaaaaaaaaa,bbbbbbb',
    cgpa: 0,
    gpa: [2, 3, 4, 5],
    skillSet: [{
        skillName: 'java',
        level: 'advanced'
    }, {
        skillName: 'c++',
        level: 'beginner'
    }],
    electives: [],
    areaOfInterest: ['dbms', 'os'],
    projectDetails: [
        {
            projectName: [],
            projectDescription: ''
        }
    ],
    academics: {
        achievements: ['blah blah blah', 'blubluelbu'],
        coCurricular: ['abacus', 'nss'],
        extras: ['a', 'b', 'c']
    },
    hobbies: ['gym', 'reading'],
    educationDetails: {
        pg: { percentage: 7.8 },
        ug: {
            institutionName: 'PSG TECH',
            branchName: 'BE AUTOMOBILE ENGINEERING',
            percentage: 0,
            board: 'Anna University',
            currentSem: 3,
            courseSem: {
                one: [{
                    courseCode: '12A241',
                    branchName: 'abc',
                    examType: 'Regular',
                    attempt: 1,
                    grade: 'D',
                    gradePoints: 6,
                    courseCredits: 3.5,
                    result: 'P',
                    passYear: 'Dec2017',
                },
                {
                    courseCode: '12A251',
                    branchName: 'def',
                    examType: 'Regular',
                    attempt: 1,
                    grade: 'F',
                    gradePoints: 0,
                    courseCredits: 3.5,
                    result: 'F',
                    passYear: 'Dec2017',
                }
                ],
                two: [{
                    courseCode: '12A255',
                    branchName: 'maths',
                    examType: 'Supply',
                    attempt: 2,
                    grade: 'F',
                    gradePoints: 0,
                    courseCredits: 3.5,
                    result: 'F',
                    passYear: 'Dec2018'
                }]
            },
            arrearCount: 1,
            batch: 2013,
            passYear: 2017
        },
        highSchool12: {
            branchName: 'XII',
            institutionName: 'URC',
            board: 'State board',
            passYear: 2013,
            percentage: 94.6,
        },
        highSchool10: {
            branchName: 'X',
            institutionName: 'URC',
            board: 'matric',
            passYear: 2011,
            percentage: 94.6,
        }
    }
},
{
    degree: 'Masters',
    programName: 'MCA',
    rollNumber: '13Z241',
    name: 'Nandalal',
    dob: '27/3/96',
    age: '21',
    gender: 'male',
    fatherName: 'dady',
    motherTongue: 'Saurastra',
    address: 'aaaaaaaaaaaaaaaaaaaaaaaaa,bbbbbbbbbbbbbbbbb,baaaaaaaaaaaaaaaaaaaaaaaaaaaa,bbbbbbb',
    cgpa: 7.5,
    gpa: [1, 1.5, 2, 3, 4, 5],
    batch: 2017,
    educationDetails: {
        pg: {
            branchName: 'MCA',
            institutionName: 'PSG TECH',
            percentage: 7.5,
            board: 'Anna University',
            currentSem: 3,
            courseSem: {
                one: [{
                    courseCode: '12A241',
                    branchName: 'abc',
                    examType: 'Regular',
                    attempt: 1,
                    grade: 'D',
                    gradePoints: 6,
                    courseCredits: 3.5,
                    result: 'P',
                    passYear: 'Dec2017'
                },
                {
                    courseCode: '12A251',
                    branchName: 'def',
                    examType: 'Regular',
                    attempt: 1,
                    grade: 'F',
                    gradePoints: 0,
                    courseCredits: 3.5,
                    result: 'F',
                    passYear: 'Dec2017'
                }
                ],
                two: [{
                    courseCode: '12A255',
                    branchName: 'maths',
                    examType: 'Supply',
                    attempt: 2,
                    grade: 'F',
                    gradePoints: 0,
                    courseCredits: 3.5,
                    result: 'F',
                    passYear: 'Dec2018'
                }]
            },
            arrearCount: 3,
            batch: 2014,
            passYear: 2017
        }, ug: {
            branchName: 'BE CSE',
            institutionName: 'Anna TECH',
            percentage: 7.04,
            board: 'barathiyar',
            batch: 2010,
            passYear: 2014,
            arrearCount: 0
        },
        highSchool12: {
            branchName: 'XII',
            institutionName: 'URC',
            board: 'State board',
            passYear: 2013,
            percentage: 94.6,
        },
        highSchool10: {
            branchName: 'X',
            institutionName: 'URC',
            board: 'matric',
            passYear: 2011,
            percentage: 94.6,
        }

    }
}
];
module.exports = staticStudents;