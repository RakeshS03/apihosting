const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let students = [
    { id: 1, name: "Rakesh", course: "CS" },
    { id: 2, name: "Mohan", course: "IT" }
];


//GET all students
app.get('/students', (req, res) => {
    res.json(students);
});


// add single or multiple Students
app.post('/students', (req, res) => {

    // Bulk Insert
    if (Array.isArray(req.body)) {
        const newStudents = req.body.map((student, index) => ({
            id: students.length + index + 1,
            name: student.name,
            course: student.course
        }));

        students.push(...newStudents);
        return res.status(201).json({
            message: "insert successful",
            data: newStudents
        });
    }

    // Single Insert
    const newStudent = {
        id: students.length + 1,
        name: req.body.name,
        course: req.body.course
    };

    students.push(newStudent);
    res.status(201).json({
        message: "insert successful",
        data: newStudent
    });
});


// UPDATE 
app.put('/students', (req, res) => {

    // Bulk Update
    if (Array.isArray(req.body)) {

        const updatedStudents = [];

        req.body.forEach(updateData => {
            const student = students.find(s => s.id == updateData.id);
            if (student) {
                student.name = updateData.name || student.name;
                student.course = updateData.course || student.course;
                updatedStudents.push(student);
            }
        });

        return res.json({
            message: "update successful",
            data: updatedStudents
        });
    }

    // Single Update
    const student = students.find(s => s.id == req.body.id);

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    student.name = req.body.name || student.name;
    student.course = req.body.course || student.course;

    res.json({
        message: "update successful",
        data: student
    });
});


// DELETE Single or Multiple Students
app.delete('/students', (req, res) => {

    // Bulk Delete
    if (Array.isArray(req.body)) {

        const idsToDelete = req.body.map(item => item.id);
        students = students.filter(student => !idsToDelete.includes(student.id));

        return res.json({
            message: "delete successful",
            deletedIds: idsToDelete
        });
    }

    // Single Delete
    const id = req.body.id;

    students = students.filter(student => student.id != id);

    res.json({
        message: "delete successful",
        deletedId: id
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});