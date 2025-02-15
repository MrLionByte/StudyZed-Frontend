

export function saveStudentsDataToSession(studentsData) {
    if (Array.isArray(studentsData)) {
        sessionStorage.setItem("studentsData", JSON.stringify(studentsData));
        console.log("Students data saved to session storage.");
    } else {
        console.error("Invalid students data. Please provide an array of students.");
    }
}

export function getStudentByCode() {
    const studentsData = JSON.parse(sessionStorage.getItem("studentsData")) || [];
    // const matchedStudent = studentsData.find(student => student.user_code === studentCode); 
    // return matchedStudent || null;
    return studentsData || null
}
