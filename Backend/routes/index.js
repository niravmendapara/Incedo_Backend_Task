var express = require('express');
var router = express.Router();

var path = require('path');
const ObjectsToCsv = require('objects-to-csv')

const api_key = require('../Config/config').api_key
const instance = require("../Config/config").instance;


//  This API will save data in CSV file is there is any data for given artist Name------------------ also i have give 3 dummy data if there are no any data for given artist name ----------------------------------------------

// if you want to run this API please call http://localhost:8000/searchartistbyname in POSTMAN. and you will get CSV file in Public/CSVs Folder.

router.post("/searchartistbyname", async (req, res, next) => {
  // const artistname = req.body.artistname     // if we want to give name from frontend side and assign to the variable.
  const artistname = "cher"                     // manually given artistname

  const response = await instance.post("/2.0/?method=artist.search&artist="+artistname+"&api_key="+api_key+"&format=json&page=1")     // this API i found by artist.search link which was in PDF Task

  const name = ""
  const artistcsvname = []

  // console.log(response.data?.results?.artistmatches?.artist.length)

  // this works if we found any data for given artist name.

  if(response.data?.results?.artistmatches?.artist.length!=0){
    name = artistname+'.csv'  // CSV file name will be artist name.

    response.data?.results?.artistmatches?.artist.forEach(x => {
      artistcsvname.push({
        name : x?.name,
        mbid : x?.mbid,
        url : x?.url,
        image_small : x?.image[0]?.["#text"],
        image : x?.image[1]?.["#text"]
      })
    });
  }

  // this works if we don't found any data for given artist name.

  else{
    const dummyartistname = ["nirav", "ravi", "deep"]                                 // three dummy artistname which i gave for the task
    name = dummyartistname[0]+"-"+dummyartistname[1]+"-"+dummyartistname[2]+'.csv'    // CSV file have this name for this case

    await dummyartistname.reduce(async (x, dummyname) => {
      return x.then(async () => {
        const dummy_response = await instance.post("/2.0/?method=artist.search&artist="+dummyname+"&api_key="+api_key+"&format=json&page=1")
        // console.log(dummy_response.data?.results?.artistmatches?.artist.length)
        await dummy_response.data?.results?.artistmatches?.artist.forEach(y => {
          artistcsvname.push({
            name : y?.name,
            mbid : y?.mbid,
            url : y?.url,
            image_small : y?.image[0]?.["#text"],
            image : y?.image[1]?.["#text"]
          })
        });
      })

    }, Promise.resolve());
  }
  
  // console.log(artistcsvname.length)

// ---------------------------------------this is the simple part to save CSV in our system with the name of artist.------------------------------------------------------
  const csv = new ObjectsToCsv(artistcsvname);
  await csv.toDisk(path.join(__dirname, '../public/CSVs/'+ name) );
  console.log('generating')

  res.status(200).send({message: "CSV file is generated and saved in Public/CSVs Folder...!!!!"})
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


module.exports = router;
