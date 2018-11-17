const faker = require('faker');
const fs = require('fs');

const generatePurchaseData = () => {
  var rand_course_id = faker.random.number({min: 1, max: 10000000});
  var rand_student_id = faker.random.number({min: 1, max: 5000000});
  var purchaseData = `${rand_course_id}\t${rand_student_id}\n`;
  return purchaseData;
};

const stream = fs.createWriteStream('tenMillionPurchaseData.tsv');
// const writeTenMillionPurchaseData = (index) => {
//   for (var i = index; i < 10000000; i++) {
//     status = stream.write(generatePurchaseData());
//     if (!status) {
//       stream.once('drain', () => {
//         writeTenMillionPurchaseData(i+1)
//         console.log('draining', i);
//       });
//     }
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
        data = generatePurchaseData()
        writer.write(data);
      } else {
        // see if we should continue, or wait
        // don't pass the callback, because we're not done yet.
        data = generatePurchaseData()
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