import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

var createReactClass = require('create-react-class');


var Header = createReactClass({

handleSubmit : function (e) {
  e.preventDefault();
  const input = ReactDOM.findDOMNode(this.refs.search);

  this.props.localSubmit(input.value);

  input.value = '';

},

render : function () {

  return (

    <header className="library">
      <h1>Google Book Search using React</h1>

      <div>
        <form className="form-inline" style={{marginTop: 30 + 'px'}} onSubmit={this.handleSubmit}>
          <div className="form-group">
                  <input className="form-control" placeholder="Book Title ..." ref="search"/>
                        <button className="btn btn-default"><span className="glyphicon glyphicon-search"></span></button>
          </div>
        </form>
      </div>

    </header>

  );
}
});

var Footer = createReactClass({

render : function () {

  return(

    <div className="related">

        <img src="img/bookpreview.png" />

        <h3>Book Preview</h3>

      <a href="http://facebook.github.io/react/" target="_blank">
        <img src="img/react.png" />
        <h3>React JS</h3>
      </a>
      <a href="https://developers.google.com/books/?hl=en" target="_blank">
        <img src="img/googlebooks.png" />
        <h3>Google Books API</h3>
      </a>

    </div>

  );

}

});

var Books = createReactClass({

getInitialState : function () {
  return ({});
},
componentDidMount : function () {

  if (this.props.item != null) {
    this.setState(this.props.item);
  }

},
render : function () {

  var authors = "";

  if (this.state.authors != null) {
    for (var i = 0; i < this.state.authors.length; i++) {

      if (i > 1) {
        authors = ", " + this.state.authors[i];
      } else {
        authors = this.state.authors[i];
      }
    }
  }

  var descrip = "...";

  if (this.state.description != null) {
    descrip = this.state.description.substring(0, 360) + "...";
  }

var id = "";

  if (this.props.identifier != null) {
    id = "book-" + this.props.identifier;
  }
var thumbnail = "";

  if (this.props.item.imageLinks !=null) {
    thumbnail = this.props.item.imageLinks.thumbnail;
  }
console.log("asdf", this.props)
  return (

    <figure>
      <div className="book" id={id}></div>
      <div className="buttons"><a href={this.state.previewLink} target="_blank">Preview</a><a href="#">Details</a></div>
      <figcaption><h2>{this.state.title}<span>{authors}</span></h2></figcaption>
      <div className="details">
        <ul>
          <img src={thumbnail}></img>
          <li>{descrip}</li>
          <li>{this.state.publishedDate}</li>
          <li>{this.state.publisher}</li>
          <li>{this.state.pageCount} pages</li>
        </ul>
      </div>
    </figure>

  );
}

});

var Main = createReactClass({

getInitialState : function () {
  return ({items: []});
},

localSubmit : function (search) {

  this.setState({items: []});
  const component = this;

    console.log("we're in local submit");
  fetch("https://www.googleapis.com/books/v1/volumes?q=intitle:" + encodeURIComponent(search) + "&printType=books&orderBy=newest&maxResults=39")
  .then(function (data) { return data.json();})
  .then(function(data) {
    console.log(data)


    console.log("we're in the fetch call back");
    component.setState(data);




    for (var i = 0; i < component.state.items.length; i++) {
      if (component.state.items[i].volumeInfo.imageLinks != null) {

        //fetch("#book-" + component.state.items[i].id).find(".front").css("background", "url("+ component.state.items[i].volumeInfo.imageLinks.thumbnail +")");
      }
    }



  });

},

render : function () {

  var books = [];

  books = this.state.items.map(function(book) {
    return <Books key={book.id} item={book.volumeInfo} identifier={book.id} />;
  });
console.log(books)
  if (books.length > 0) {
    var content = books;
  } else {
   content = <div className="search-icon"><span className="glyphicon glyphicon-search"></span></div>
  }

  return (
    <div>
    <Header localSubmit={this.localSubmit}/>
      <div className="main">
        <div id="bookshelf" className="bookshelf">
          {content}
        </div>
      </div>

      <Footer />
    </div>
  );
}
});

ReactDOM.render(<Main/>, document.getElementById("scrollwrap"));
