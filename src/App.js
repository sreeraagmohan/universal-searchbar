import React, { Component } from 'react';
import MOCK_DATA from './data.js';
import './App.css';

class App extends Component {
  state = {
    filter: "",
    cursor: 0,
    filteredData: [],
    data: MOCK_DATA
  };

  handleChange = event => {
    const { filter, data } = this.state;
    const lowercasedFilter = filter.toLowerCase();
    // Limit the number of items in filteredData if mock data is huge, similar to YouTube.
    const filteredData = data.filter(item => {
      return Object.keys(item).some(key => {
        if (Array.isArray(item[key])) {
          return item[key].join('').toLowerCase().includes(lowercasedFilter);
        } else {
          return item[key].toLowerCase().includes(lowercasedFilter);
        }
      }
      );
    });
    this.setState({
      ...this.state,
      cursor: 0,
      filter: event.target.value,
      filteredData
    });
    this.searchHighlighter();
  };

  searchHighlighter = () => {
      let searchedPara = document.querySelectorAll('.col-12');
      let words = this.state.filter;
      // Matching needs to be case-insensitive. Replace the captured block in the function. 
      let regex = RegExp('('+ words + ')', 'gi'); 
      if (searchedPara) {
        for (let i = 0; i < searchedPara.length; i++) {
          let newHTML = searchedPara[i].textContent.replace(regex, '<span class="highlight">$1</span>');
          searchedPara[i].innerHTML = newHTML;
        }
      }
  }


  handleKeyDown = (e) => {
    const { cursor, filteredData } = this.state;
    if (e.keyCode === 38 && cursor > 0) {
      this.setState(prevState => ({
        cursor: prevState.cursor - 1
      }), () => this.scrollIntoView())
    } else if (e.keyCode === 40 && cursor < filteredData.length - 1) {
      this.setState(prevState => ({
        cursor: prevState.cursor + 1
      }), () => this.scrollIntoView())
    }
  }

  scrollIntoView() {
    const { cursor, filteredData } = this.state;
    let x = Array.from(document.getElementsByClassName('answers-item'));
    if (x.length === filteredData.length) {
      x[cursor].scrollIntoView();
      this.handleHoverBackgrounds(cursor, true)
    }
  }

  handleHoverBackgrounds = (index, param) => {

    const { cursor } = this.state;
    let x = document.getElementsByClassName('answers-item');

    if (param) {
      for (let i=0; i < x.length; i++) {
        if (i !== cursor) {
          x[i].classList.remove('active');
        }
      }
    } else {
      for (let i=0; i < x.length; i++) {
        x[i].classList.remove('active');
      }
      x[index].classList.add('active');
      x[index].scrollIntoView();
    }
  }

  render() {

    const { cursor, filteredData, filter } = this.state;

    return (
      <div className="wrapper">
        <h1 className="display-4 text-center mb-4">Universal Searchbar</h1>
        <input onKeyDown={this.handleKeyDown} placeholder="Search users by any field" className="form-control" value={filter} onChange={this.handleChange} />

        {/* Show the list wrapper only if results are found */}
        {filteredData.length > 0 && filter && <ul className="answers-wrapper">
          {filteredData.map((item, index) => {
            return (
              <li
                onMouseEnter={() => this.handleHoverBackgrounds(index, false)}
                className={cursor === index ? 'active answers-item' : 'answers-item'}
                key={item.id}>
                <div className="row">
                  <div className="col-12 font-weight-bold">
                    {item.id.toUpperCase()}
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 font-weight-light font-italic">
                    {item.name}
                  </div>
                </div>
                {item.items.join('').toLowerCase().includes(filter) && <div className="row items-row font-weight-light">
                  <div className="col">
                    <i className="fa fa-circle item-fa"></i> "{filter}" found in items
                  </div>
                </div>}
                <div className="row">
                  <div className="col-12">
                    {item.address} <span className="font-weight-bold">{item.pincode}</span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>}

        {/* Handle the case for no results found */}
        {filteredData.length === 0 && filter && <ul className="answers-wrapper">
          <li className="answers-item no-results-found-item">
            <div className="row">
              <div className="col text-center font-weight-bold">
                No Users found.
              </div>
            </div>
          </li>
        </ul>}
      </div>
    );
  }
}

export default App;