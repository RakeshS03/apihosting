const express = require('express');
const app = express();

app.use(express.json());

// for Render deployment
const PORT = process.env.PORT || 3000;

// In-memory data storage
let students = [];

app.get('/', (req, res) => {
    res.send("Student API is running 🚀");
});

   //GET ALL STUDENTS

app.get('/students', (req, res) => {

    // If request comes from browser → send HTML
    if (req.headers.accept && req.headers.accept.includes('text/html')) {

        let html = `
            <html>
            <head>
                <title>Student List</title>
                <style>
                    table {
                        border-collapse: collapse;
                        width: 60%;
                        margin: 40px auto;
                        font-family: Arial;
                    }
                    th, td {
                        border: 1px solid black;
                        padding: 10px;
                        text-align: center;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    h2 {
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <h2>Student Data</h2>
                <table>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                    </tr>
        `;

        students.forEach(student => {
            html += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.age}</td>
                </tr>
            `;
        });

        html += `
                </table>
            </body>
            </html>
        `;

        res.send(html);

    } else {
        // If request comes from Postman → send JSON
        res.json(students);
    }
});

   //SINGLE INSERT
app.post('/students', (req, res) => {

    const { id, name, age } = req.body;

    if (!id || !name || !age) {
        return res.status(400).json({
            message: "All fields (id, name, age) are required"
        });
    }

    const existing = students.find(s => s.id === id);
    if (existing) {
        return res.status(400).json({ message: "ID already exists" });
    }

    students.push({ id, name, age });

    res.status(201).json({
        message: "Student added successfully",
        data: students
    });
});

   //BULK INSERT
app.post('/students/bulk', (req, res) => {

    const data = req.body;

    if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({
            message: "Send non-empty array of students"
        });
    }

    for (let student of data) {
        if (!student.id || !student.name || !student.age) {
            return res.status(400).json({
                message: "Each student must have id, name, age"
            });
        }
    }

    students.push(...data);

    res.status(201).json({
        message: "Bulk insert successful",
        data: students
    });
});

   //SINGLE UPDATE
app.put('/students/:id', (req, res) => {

    const id = parseInt(req.params.id);
    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({ message: "Student not found" });
    }

    const { name, age } = req.body;

    if (!name && !age) {
        return res.status(400).json({
            message: "Provide at least one field to update"
        });
    }

    if (name) student.name = name;
    if (age) student.age = age;

    res.json({
        message: "Student updated",
        data: student
    });
});

   //BULK UPDATE
app.put('/students/bulk', (req, res) => {

    const updates = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({
            message: "Send non-empty array for bulk update"
        });
    }

    updates.forEach(update => {
        const student = students.find(s => s.id === update.id);
        if (student) {
            if (update.name) student.name = update.name;
            if (update.age) student.age = update.age;
        }
    });

    res.json({
        message: "Bulk update completed",
        data: students
    });
});

   //SINGLE DELETE
app.delete('/students/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Student not found" });
    }

    students.splice(index, 1);

    res.json({
        message: "Student deleted",
        data: students
    });
});

   //BULK DELETE
app.delete('/students/bulk', (req, res) => {

    const ids = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
            message: "Send non-empty array of IDs"
        });
    }

    students = students.filter(student => !ids.includes(student.id));

    res.json({
        message: "Bulk delete completed",
        data: students
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});