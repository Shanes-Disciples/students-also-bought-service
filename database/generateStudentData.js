const faker = require('faker');
// const courses = require('./courseTitles.js');
// const photos = require('./photoUrls.js');
const fs = require('fs');

var generateStudentData = () => {
  var rand_courses_count = faker.random.number({min: 1, max: 4});
  var rand_reviews_count = faker.random.number({min: 1, max: 4});
  var studentData = `${rand_courses_count}\t${rand_reviews_count}`
  return studentData;
};

const studentDataStream = fs.createWriteStream('tenMillionStudentData.tsv');

writeTenMillionStudentData = (index) => {
  for (var i = 0; i < 10000000; i++) {
    var result = studentDataStream.write(generateStudentData());
    if (!result) {
      studentDataStream.once('drain', () => {
        result = studentDataStream.write(generateStudentData());
      });
    }
  }
}
