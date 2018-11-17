// var mysql = require('mysql');
var load = require('./index.js');
var faker = require('faker');
var courses = require('./courseTitles.js');
var photos = require('./photoUrls.js');

const randomNumGenerator = function(min, max, decimalPlaces) {
  var rand = (Math.random() * (max - min)) + min;
  var power = Math.pow(10, decimalPlaces);
  return Math.floor(rand * power) / power;
}

// upload course, student and purchase data to the DB

var loadCourseDatatoDB = function() {
  for (var i = 0; i < courses.length; i++) {
    var randName = courses[i];
    var rand_average_rating = randomNumGenerator(1, 5, 1);
    var rand_regular_price = faker.random.number({min: 50, max: 200});
    var rand_sales_price = faker.random.number({min: 10, max: 20});
    var rand_purchase_count = faker.random.number({min: 30, max: 500});
    var rand_lecture_time = randomNumGenerator(5, 30, 1);
    var rand_update_month = faker.random.number({min: 1, max: 12});
    var rand_update_year = faker.random.number({min: 2016, max: 2018});
    var rand_image_url = photos[randomNumGenerator(0, photos.length, 0)];
    load.inputCourseInfo(randName, rand_average_rating, rand_regular_price, rand_sales_price, rand_purchase_count, rand_lecture_time, rand_update_month, rand_update_year, rand_image_url, (error, results) => { console.log(error, results); });
  }
};

var loadStudentDatatoDB = function() {
  for (var i = 0; i < courses.length * 3; i++) {
    var rand_courses_count = faker.random.number({min: 1, max: 4});
    var rand_reviews_count = faker.random.number({min: 1, max: 4});
    load.inputStudentInfo(rand_courses_count, rand_reviews_count, (error, results) => { console.log(error, results); });
  }
};

var loadPurchaseDatatoDB = function() {
  for (var i = 0; i < courses.length * 8; i++) {
    var rand_course_id = faker.random.number({min: 1, max: 100});
    var rand_student_id = faker.random.number({min: 1, max: 200});
    load.inputPurchaseInfo(rand_course_id, rand_student_id, (error, results) => { console.log(error, results); });
  }
};

// data generation functions (comment back in to invoke the funcs above)
loadStudentDatatoDB();
loadCourseDatatoDB();
loadPurchaseDatatoDB();