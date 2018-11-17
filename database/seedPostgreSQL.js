const faker = require('faker');
const courses = require('./courseTitles.js');
const photos = require('./photoUrls.js');
const fs = require('fs');

const randomNumGenerator = function(min, max, decimalPlaces) {
  var rand = (Math.random() * (max - min)) + min;
  var power = Math.pow(10, decimalPlaces);
  return Math.floor(rand * power) / power;
}

// upload course, student and purchase data to the DB
const generateCourseData = () => {
  var randName = courses[randomNumGenerator(0, 101, 0)];
  var rand_average_rating = randomNumGenerator(1, 5, 1);
  var rand_regular_price = faker.random.number({min: 50, max: 200});
  var rand_sales_price = faker.random.number({min: 10, max: 20});
  var rand_purchase_count = faker.random.number({min: 30, max: 500});
  var rand_lecture_time = randomNumGenerator(5, 30, 1);
  var rand_update_month = faker.random.number({min: 1, max: 12});
  var rand_update_year = faker.random.number({min: 2016, max: 2018});
  var rand_image_url = photos[randomNumGenerator(0, photos.length, 0)];
  var courseData = `${randName}\t${rand_average_rating}\t${rand_regular_price}\t${rand_sales_price}\t${rand_purchase_count}\t${rand_lecture_time}\t${rand_update_month}\t${rand_update_year}\t${rand_image_url}\n`
  return courseData;
}
const stream = fs.createWriteStream('tenMillionData.tsv');
// const writeData = () => {
//   var result = stream.write(generateCourseData());
// }


// for (var i = 0; i < 10000000; i++) {
//   var result = stream.write(generateCourseData());
//   if (!result) {
//     stream.once('drain', () => {
//       var result = stream.write(generateCourseData());
//     });
//   }
// }
function writeTenMillionTimes(writer) {
  let i = 10000000;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        // last time!
        data = generateCourseData()
        writer.write(data);
      } else {
        // see if we should continue, or wait
        // don't pass the callback, because we're not done yet.
        data = generateCourseData()
        ok = writer.write(data);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // had to stop early!
      // write some more once it drains
      writer.once('drain', write);
    }
  }
}
writeTenMillionTimes(stream);


var generateStudentData = () => {
  var rand_courses_count = faker.random.number({min: 1, max: 4});
  var rand_reviews_count = faker.random.number({min: 1, max: 4});
  var studentData = `${rand_courses_count}\t${rand_reviews_count}`
  return studentData;
};
const studentDataStream = fs.createWriteStream('tenMillionStudentData.tsv');



var generatePurchaseDatatoDB = () => {
  var rand_course_id = faker.random.number({min: 1, max: 100});
  var rand_student_id = faker.random.number({min: 1, max: 200});
  var purchaseData = `${rand_course_id}\t${rand_student_id}`;
  return purchaseData;
};




// // data generation functions (comment back in to invoke the funcs above)
// loadStudentDatatoDB();
// loadCourseDatatoDB();
// loadPurchaseDatatoDB();