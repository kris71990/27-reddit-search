import React from 'react';
import { render as reactDomRender } from 'react-dom'; 
import superagent from 'superagent';

import './style/main.scss';

class SearchForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      subreddit: '',
      threads: '',
    }

    this.handleChangeSubreddit = this.handleChangeSubreddit.bind(this);
    this.handleChangeNumber = this.handleChangeNumber.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeSubreddit(e) {
    this.setState({
      subreddit: e.target.value
    })
  }

  handleChangeNumber(e) {
    this.setState({
      threads: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault();

    return superagent.get(`https://www.reddit.com/r/${this.state.subreddit}.json?limit=${this.state.threads}`)
      .then((response) => {
        this.props.subredditSelect(response.body, this.state.subreddit, this.state.threads);
      })
      .catch(console.error);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input 
          type="text" 
          name="subreddit"
          placeholder="Search a subreddit"
          value={this.state.subreddit}
          onChange={this.handleChangeSubreddit}
        />
        <input
          type="number"
          name="search-items"
          placeholder="Number of threads (0-100)"
          value={this.state.threads}
          onChange={this.handleChangeNumber}
        />
        <button>Search</button>
      </form>
    );
  }
}

class SearchResultList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return
      (
        <div>
        {
          !this.state.results ? 
          <h1>error</h1> :
          <ul>
            { this.state.results.map((item, index) => {
              return (
                <li key={index}>
                  <p>{item}</p>
                </li>
              )
            })}
          </ul>
        }
        </div>
      );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      subredditSelected: null,
      results: null,
      threadCount: null,
      subredditError: null,
    }
    this.subredditSelect = this.subredditSelect.bind(this);
  }

  subredditSelect(response, subreddit, thread) {
    this.setState({
      subredditSelected: subreddit,
      threadCount: thread,
      results: response.data.children,
      subredditError: null,
    })
  }

  renderResults() {

  }

  render() {
    return (
      <section>
        <h1>Search Reddit</h1>
        <SearchForm
          subredditSelect={this.subredditSelect}
        />
        <h3>Results</h3>
      </section>
    );
  }
}

const element = document.createElement('div');
document.body.appendChild(element);
reactDomRender(<App/>, element);