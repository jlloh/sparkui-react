const express = require('express');
//const path = require('path')
const app = express();
const port = process.env.PORT || 5000;

//app.use(express.static(path.join(__dirname, '')))

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

var request = require('request');
app.get('/api/v1/applications', (req, res) => {
  //modify the url in any way you want
  var newurl = 'https://jupyter-4040-jialong-loh.svcb.chimera.tis-data.grab.com/api/v1/applications';
  //res.send({ test: 'This is a test' })
  request(newurl).pipe(res);
});

function getApplicationId(inputJson) {
/*
get Latest Job Id
*/
  const firstSparkApplicationObject = inputJson[0]
  const applicationId = firstSparkApplicationObject.id
  return applicationId
}

function getSparkStats(inputJson) {
/*
curl localhost:4040/api/v1/applications/spark-application-1575007442508/jobs?status=running
[ {
  "jobId" : 1,
  "name" : "show at <console>:26",
  "submissionTime" : "2019-11-29T06:06:54.386GMT",
  "stageIds" : [ 1, 2 ],
  "status" : "RUNNING",
  "numTasks" : 161,
  "numActiveTasks" : 1,
  "numCompletedTasks" : 159,
  "numSkippedTasks" : 0,
  "numFailedTasks" : 0,
  "numKilledTasks" : 0,
  "numCompletedIndices" : 159,
  "numActiveStages" : 1,
  "numCompletedStages" : 0,
  "numSkippedStages" : 0,
  "numFailedStages" : 0,
  "killedTasksSummary" : { }
} ]
*/
  const firstJobObject = inputJson[0]
  return firstJobObject
}

app.get('/api/get_job_stats/:domain/:applicationId', (req, res) => {
  const applicationId = req.params.applicationId
  const domain = req.params.domain
  const baseUrl = `https://${domain}/api/v1`;
  const getJobsUrl = `${baseUrl}/applications/${applicationId}/jobs`
  const options = {json: true, timeout: 500};
  request(getJobsUrl, options, (error, reqRes, body) => {
    if (error) {
      res.send([{message: 'Error. Timeout?'}])
    };
    if (!error) {
      if (reqRes.statusCode == 200) {
        const result = body[0]
        res.send(result)  
      }
      else if (reqRes.statusCode == 502)
      {
        res.send([{message: 'Bad Gateway'}])  
      }
      else {
        console.log("other error")
        res.send([{message: 'Other Error'}])  
      }
  }
  ;
  })
});

app.get('/api/get_spark_application/:domain', (req, res) => {
  const domain = req.params.domain
  const baseUrl = `https://${domain}/api/v1`;
  //const baseUrl = 'https://jupyter-4040-jialong-loh.svcb.chimera.tis-data.grab.com/api/v1';
  const getApplicationsUrl = `${baseUrl}/applications`
  const options = {json: true, timeout: 500};
  request(getApplicationsUrl, options, (error, reqRes, body) => {
    if (error) {
      res.send([{message: 'Error. Timeout?'}])
    };
    if (!error) {
      if (reqRes.statusCode == 200) {
        const applicationId = getApplicationId(body)
        const result = {applicationId: applicationId}
        res.send(result)  
      }
      else if (reqRes.statusCode == 502)
      {
        res.send([{message: 'Bad Gateway'}])  
      }
      else {
        console.log("other error")
        res.send([{message: 'Other Error'}])  
      }
  }
  ;
  })
});

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send([{ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }]);
});
