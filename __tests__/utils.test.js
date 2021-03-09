const { reFormatTimeStamp } = require('../db/utils/data-manipulation.js');

describe('reFormatTimeStamp', () => {
  it('it returns a string when passed a number ', () => {
    let input = 0;
    let expectedOutput = 'string';
    let actualOutput = reFormatTimeStamp(input);

    expect(typeof actualOutput).toEqual(expectedOutput);
  });

  it('returns date in day/month/year when passed 0', () => {
    let input = 0;
    let expectedOutput = '01/01/1970, 01:00:00';
    let actualOutput = reFormatTimeStamp(input);

    expect(actualOutput).toEqual(expectedOutput);
  });

  it('returns correct date in day/month/year when given unix code', () => {
    let input = 1511354163389;
    let expectedOutput = '22/11/2017, 12:36:03';
    let actualOutput = reFormatTimeStamp(input);

    expect(actualOutput).toEqual(expectedOutput);
  });
});

//formatting utility funct to change format of timestamp

//OBJECT WE HAVE

/*{
    title: 'Living in the shadow of a great man',
    topic: 'mitch',
    author: 'butter_bridge',
    body: 'I find this existence challenging',
    created_at: 1542284514171,
    votes: 100,
  }*/

//TIMESTAMP OUT OF
//TIMESTAMP SYNTAX WE WANT
//'2016-06-22 19:10:25-07'
