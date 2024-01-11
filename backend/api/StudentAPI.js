const express = require("express");
const Student = require("../model/Student");
const { Op } = require('sequelize');

const router = express.Router();

router.get('/', async (req, res)=> {
  try{

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    const offset = (page - 1) * pageSize;
    
    const students = await Student.findAndCountAll({
      limit: pageSize,
      offset: offset,
    });
    
    const transformedStudents = students.rows.map(student => ({
      id: student.id,
      fullname: `${student.firstname} ${student.lastname}`,
      age: calculateAge(student.date_of_birth), 
      email: student.email,
    }));

    res.status(200).json({
      data: transformedStudents,
    });

  }
  catch (error) {
    console.error('Error creating Student:', error);
    res.status(500).json({ error: 'Error creating Student:'+error });
  }

})

router.get('/pagination', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    const offset = (page - 1) * pageSize;

    const students = await Student.findAndCountAll({
      limit: pageSize,
      offset: offset,
    });

    const transformedStudents = students.rows.map(student => ({
      id: student.id,
      fullname: `${student.firstname} ${student.lastname}`,
      age: calculateAge(student.date_of_birth), 
      email: student.email,
    }));

    res.status(200).json({
      page: page,
      pageSize: pageSize,
      totalStudents: students.count,
      totalPages: Math.ceil(students.count / pageSize),
      data: transformedStudents,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

function calculateAge(dateOfBirth) {

  const birthYear = new Date(dateOfBirth).getFullYear();
  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
}

router.get('/search', async (req, res) => {
  try {
    const name = req.query.name;

    if (!name) {
      return res.status(400).json({ error: 'Search query parameter name is required.' });
    }

    const students = await Student.findAll({
      where: {
        [Op.or]: [
          {
            firstname: {
              [Op.iLike]: `%${name}%`,
            },
          },
          {
            lastname: {
              [Op.iLike]: `%${name}%`,
            },
          },
        ],
      },
    });

    res.status(200).json(students);
  } catch (error) {
    console.error('Error searching students:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res)=> {
  try{
    const student = await Student.findByPk(req.params.id);
    if(!student){
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json(student);

  }
  catch (error) {
    console.error('Error creating Student:', error);
    res.status(500).json({ error: 'Error creating Student:'+error });
  }

})

router.post('/', async (req, res) => {
  try {
    const { firstname, lastname,date_of_birth, email } = req.body;
    if(!firstname) return res.status(500).json({ error: 'Firstname required' });
    if(!lastname) return res.status(500).json({ error: 'LastName required' });
    if(!date_of_birth) return res.status(500).json({ error: 'Date of birth required' });
    if(!email) return res.status(500).json({ error: 'Email required' });

    const newUser = await Student.create({ firstname, lastname ,date_of_birth, email});
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating Student:', error);
    res.status(500).json({ error: 'Error creating Student:'+error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { firstname, lastname, date_of_birth, email } = req.body;

    if (!firstname) return res.status(500).json({ error: 'Firstname required' });
    if (!lastname) return res.status(500).json({ error: 'LastName required' });
    if (!date_of_birth) return res.status(500).json({ error: 'Date of birth required' });
    if (!email) return res.status(500).json({ error: 'Email required' });


      const updatedStudent = await Student.update(
        { firstname, lastname, date_of_birth, email },
        { where: { id: req.params.id } }
      );

      if (updatedStudent[0] === 0) {
        return res.status(404).json({ error: "Student not found" });
      }

      res.status(200).json({"success":"Student updated successsfully"});
  } catch (error) {
    console.error('Error updating Student:', error);
    res.status(500).json({ error: 'Error updating Student:' + error });
  }
});

router.delete('/:id', async (req, res) => {
  try {

      const updatedStudent = await Student.destroy(
        { where: { id: req.params.id } }
      );

      if (updatedStudent[0] === 0) {
        return res.status(404).json({ error: "Student not found" });
      }

      res.status(200).json({"success":"Student deleted successsfully"});
  } catch (error) {
    console.error('Error updating Student:', error);
    res.status(500).json({ error: 'Error updating Student:' + error });
  }
});



module.exports = router;
