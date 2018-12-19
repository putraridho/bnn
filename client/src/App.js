import React, { Component } from 'react'
import KNN from 'ml-knn/lib'
// import train from './train-data.json'

class Form extends Component{
  render() {
    return (
      this.props.questions ? this.props.questions.map((q,j) => (
        <div key={"question-"+(j+1)} id={"question-"+(j+1)}>
          <strong>{q}</strong>
          <Questioner index={j} handleChange={this.props.handleChange} predictKNN={this.props.predictKNN} m={this.props.m}/>
        </div>
      )) : ''
    )
  }
}

class Questioner extends Component {
  render() {
    return (
      <div>
        <Radio val="0" index={this.props.index} checked="true" handleChange={this.props.handleChange} predictKNN={this.props.predictKNN} m={this.props.m}/>
        <Radio val="1" index={this.props.index} checked="false" handleChange={this.props.handleChange} predictKNN={this.props.predictKNN} m={this.props.m}/>
      </div>
    )
  }
}

class Radio extends Component {
  render() {
    return (
      <div style={{display:'inline-block'}}>
        <input
          type="radio"
          name={'q-'+this.props.index}
          value={this.props.val}
          id={
            parseInt(this.props.val) ?
            'radio-yes-'+this.props.index :
            'radio-no-'+this.props.index
          }
          onClick={e => {
            this.props.handleChange(e, this.props.index)
            setTimeout(()=>this.props.predictKNN(this.props.m),0)
            
          }}
          defaultChecked={(this.props.checked==='true')?true:false}
        />
        <label htmlFor={
            parseInt(this.props.val) ?
            'radio-yes-'+this.props.index :
            'radio-no-'+this.props.index
          }
        >
          {
            parseInt(this.props.val) ?
            'YES' :
            'NO'
          }
        </label>
      </div>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      questions: [],
      train: {},
      knn: null,
      m: Array(18).fill(0),
      result: ''
    }
    // this.predictKNN = this.predictKNN.bind(this)
    // this.handleChange = this.handleChange.bind(this)
  }

  trainKNN(d, p) {
    this.setState({
      dataset: d,
      predictions: p,
      knn: new KNN(d, p, {k: 1})
    },
    // function() {
    //   console.log(this.state.knn)
    // })
    )
  }

  componentDidMount() {
    let temp = {
      questions: [],
      dataset: [],
      predictions: []
    }

    fetch('/api/data_train')
      .then(res => res.json())
      .then(
        train => {
          train.map((m,i) => {
            temp.dataset.push(m.dataset.split(',').map(x => parseInt(x)))
            temp.predictions.push(m.prediction)
            temp.questions.push(i)
            return true
          })
          this.setState({train: temp})
          this.trainKNN(this.state.train.dataset, this.state.train.predictions)
        },
        () => console.log('Data fetched...', this.state.train)
      )

    fetch('/api/questions')
      .then(res => res.json())
      .then(
        res => {
          let questions = []
          res.map(q => questions.push(q.question))
          this.setState({questions})
        }
      )
  }

  predictKNN(m) {
    let a = this.state.knn.predict(m)

    this.setState({
      result: a
    })
  }
  
  handleChange(e,i) {
    let m = []
    this.state.m.slice(0,i).map((l) => m.push(l))
    m.push(parseInt(e.target.value))
    this.state.m.slice(i+1).map((l) => m.push(l))
    this.setState({
      m: m
    },
    // function() {
    //   console.log(this.state.m)
    // }
    )
  }

  render() {
    return (
      <div>
        <h1>KNN TEST</h1>
        {this.state.result !== '' ? 
          <p>Hasilnya <strong>{this.state.result}</strong></p> :
          <p>Klik survey</p>
        }
        <Form
          m={this.state.m}
          questions={this.state.questions}
          train={this.state.train}
          handleChange={this.handleChange.bind(this)}
          predictKNN={this.predictKNN.bind(this)}
        />
      </div>
    );
  }
}

export default App;
