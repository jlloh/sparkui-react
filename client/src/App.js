import React from "react";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import ProgressBar from "react-bootstrap/ProgressBar"
import Table from "react-bootstrap/Table"
import InputGroup from "react-bootstrap/InputGroup"
import FormControl from "react-bootstrap/FormControl"

import "./App.css";

function SparkJobSummaryTable(props) {
  return <Table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>sparkApplicationId</td>
            <td>{props.sparkApplicationId}</td>
          </tr>
          <tr>
            <td>submissionTime</td>
            <td>{props.submissionTime}</td>
          </tr>
          <tr>
            <td>numTasks</td>
            <td>{props.numTasks}</td>
          </tr>
          <tr>
            <td>numCompletedTasks</td>
            <td>{props.numCompletedTasks}</td>
          </tr>
          <tr>
            <td>numSkippedTasks</td>
            <td>{props.numSkippedTasks}</td>
          </tr>

        </tbody>
  </Table>
}

function InputItem(props) {
  return (
    <div>
    <InputGroup className="mb-3">
    <InputGroup.Prepend>
      <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
    </InputGroup.Prepend>
    <FormControl
      placeholder="jupyter-4040-username.svcb.chimera.tis-data.grab.com"
      aria-label="Spark UI Url"
      aria-describedby="basic-addon1"
      value={props.domain}
      onChange={props.onChange}
    />
  </InputGroup>
  </div>
  )
}

function SparkProgressBar(props) {
  const value = props.current/props.total * 100
  if (value === 100) {
    return (
      <ProgressBar now={value} label={`${props.current} out of ${props.total}`}/>
    )
  }
  else {
    return (
        <ProgressBar animated now={value} label={`${props.current} out of ${props.total}`}/>
    )
  }
}

function cleanSparkWebUrl(fullUrl) {
  return fullUrl.replace("https://", "").replace("/", "")
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numCompletedTasks: 0,
      numTasks: 100,
      numSkippedTasks: 0,
      sparkApplicationId: "",
      submissionTime: null,
      domain: ""
    };
    this.domainUpdated = this.domainUpdated.bind(this)
  }

  componentDidMount() {
    this.pollerID = setInterval(
      () => this.tick(), 1000
    )
  }

  componentWillUnmount() {

  }
  domainUpdated(event) {
    this.setState({domain: cleanSparkWebUrl(event.target.value)})
  }
  tick() {
    //const domain = "jupyter-4040-jialong-loh.svcb.chimera.tis-data.grab.com"
    let domain = this.state.domain
    //const fullUrl = `/api/get_spark_application/${domain}`
    const getSparkApplicationUrl = `/api/get_spark_application/${domain}`
    fetch(getSparkApplicationUrl, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'credentials': "include"
      }
    }).then(response => response.json())
    .then(json => this.setState({sparkApplicationId: json.applicationId}))
    .catch(error => console.log(error))

    const applicationId = this.state.sparkApplicationId
    const getSparkJobStatsUrl = `/api/get_job_stats/${domain}/${applicationId}`
    //const fullUrl = "http://localhost:4040" + "/api/v1/applications"

    fetch(getSparkJobStatsUrl, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'credentials': "include"
      }
    }).then(response => response.json())
    //.then(json => console.log(json))
    .then(json => this.setState({
      numCompletedTasks: json.numCompletedTasks,
      numTasks: json.numTasks,
      numSkippedTasks: json.numSkippedTasks,
      submissionTime: json.submissionTime
    }))
    .catch(error => console.log(error))
    //this.setState({numCompletedTasks: Math.trunc((Math.random() * 100))})
  }

  render() {
  return (
  <Container className="p-3">
    <Jumbotron>
      <h1 className="header">Spark Job Progress</h1>
    </Jumbotron> 
    <InputItem onChange={this.domainUpdated} domain={this.state.domain}/>
    <SparkJobSummaryTable
      sparkApplicationId={this.state.sparkApplicationId}
      submissionTime={this.state.submissionTime}
      numTasks={this.state.numTasks}
      numCompletedTasks={this.state.numCompletedTasks}
      numSkippedTasks={this.state.numSkippedTasks}
    />
    <SparkProgressBar 
      current={this.state.numCompletedTasks + this.state.numSkippedTasks}
      total={this.state.numTasks}
    />
  </Container>
  )}
};

export default App;
