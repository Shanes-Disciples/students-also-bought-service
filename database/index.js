const _ = require('underscore');
const dbConfig = require('.psqlConfig.js');
const port = 3000;

//setup postgreSQL connection
const {Client} = require('pg')
const client = new Client({
  host: dbConfig.host,
  user: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  port: port
});
client.connect();

connection = require('bluebird').promisifyAll(connection);

// not necessary if query is used;
// connection.connect();

// constructor creates new mySQL connection with the given configuration


const getStudentsPurchasesByCourseId = function(courseId) {
  return connection.queryAsync('SELECT student_id from Purchases where course_id = ?', [courseId]);
};

// const getSimilarCourseInfoFromCourseID = function(courseId) {
//   return connection.queryAsync('SELECT * from Courses where id = ?', [courseId]);
// }

const getPurchasesForStudent = function(studentId) {
  return connection.queryAsync('SELECT Courses.id, Courses.name, Courses.average_rating, Courses.regular_price, Courses.sales_price, Courses.purchase_count, Courses.lecture_time, Courses.last_update_month, Courses.last_update_year, Courses.image_url from Purchases INNER JOIN Courses ON Purchases.course_id = Courses.id where student_id = ?', [studentId]);
}

const arrayOfPurchasesForStudents = function(courseId, callback) {
  return getStudentsPurchasesByCourseId(courseId)
  .then(function(courseId) {
    // console.log('this is courseID', courseId)
    return courseId.map(
      function(studentObj) {
      // console.log('purchases for students ', getPurchasesForStudent(studentObj.student_id), studentObj.student_id)
        return getPurchasesForStudent(studentObj.student_id)
      })
    })
  .then(function(val) {
    // console.log('this is the promises ', val);
    // return val;
    var results = {};
    // console.log("HERE", val)
    Promise.all(val)
      .then(function(rows) {
        // console.log(rows);
        // console.log('this is the array of course_id objects ', rows);
        results.rows = rows;
        // console.log('this is results ', rows);
        // console.log({ rows })
        return rows.map(
        function(courseObj) {
          var output = [];
          // console.log(courseObj[0].course_id);
          for (var i = 0; i < courseObj.length; i++) {
              output.push(courseObj[i]);
              // console.log('check if interpreter reads this line')
          }
          return output
        })
      })
      .then(function(data) {
        var flattenData = _.flatten(data);
        // console.log('this is the flattened data', flattenData);
        var uniqCourses = _.uniq(flattenData, function(x) {return x.id});
        // console.log('this is the list of uniq courses ', uniqCourses);
        callback(null, uniqCourses);
      })
      .catch(err => { 
        callback(err);
      })
  })
  .catch(error => {
    callback(error);
  })
}

// arrayOfPurchasesForStudents();


let inputCourseInfo = function(name, average_rating, regular_price, sales_price, purchase_count, lecture_time, last_update_month, last_update_year, image_url, callback) {
  var query = 'INSERT into Courses (name, average_rating, regular_price, sales_price, purchase_count, lecture_time, last_update_month, last_update_year, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [name, average_rating, regular_price, sales_price, purchase_count, lecture_time, last_update_month, last_update_year, image_url], function (error, results) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
};

let inputStudentInfo = function(courses_count, reviews_count, callback) {

  var query = 'INSERT into Students (courses_count, reviews_count) VALUES (?, ?)';
  connection.query(query, [courses_count, reviews_count], function (error, results) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
};

let inputPurchaseInfo = function(course_id, student_id, callback) {

  var query = 'INSERT into Purchases (course_id, student_id) VALUES (?, ?)';
  connection.query(query, [course_id, student_id], function (error, results) {
    if (error) {
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
};


module.exports = {
  inputCourseInfo: inputCourseInfo,
  inputStudentInfo: inputStudentInfo,
  inputPurchaseInfo: inputPurchaseInfo,
  arrayOfPurchasesForStudents: arrayOfPurchasesForStudents
};
