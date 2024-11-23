import '../styles/JoinGame.css';
import 'react-calendar/dist/Calendar.css';
import "../styles/Calendar.css";
import React, { Component } from 'react';
import Game from '../components/Game';
import Calendar from 'react-calendar';
import OpenLayersMap from '../components/Map';
import Sidebar from '../components/Sidebar';
import useSpeech from '../components/SpeechPlease';


class JoinGame extends Component {

  constructor(props) {
    super(props);
    //const currentDate = new Date(Date.now());
    //const year = currentDate.getFullYear();
    //const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    //const day = currentDate.getDate().toString().padStart(2, "0");
    //const formattedDate = year + '-' + month + '-' + day;

    this.state = {
      section: document.getElementById("button1"),
      games: [],
      filteredGames: [],
      filters: [],
      //Add the default sort to be by compatibility
      //Here, without this, the default should be alphabetical based upon the session_title attribute of each game listing
      sorts: [{id: "sort", className: "ascending", attribute: "compatibility", text: "Most Compatible",}],
      fontSizeLarge: 40,
      fontSizeMedium: 20,
      fontSize: 16,
      fontSizeSmall: 14,
      currentDate: new Date(Date.now()),
      selectedDate: new Date(Date.now()),
      currentLat: null,//Fix so that this defaults to the location selected by the user upon creating their account
      currentLon: null,
      selectedLat: null,
      selectedLon: null,
      token: null,

      //Accessibility features
      isEnabled: false,
      click: false,
      darkMode: false,
    };
    this.handleWordHover = this.handleWordHover.bind(this);
    this.handleToggleSwitch = this.handleToggleSwitch.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.toggleDarkMode = this.toggleDarkMode.bind(this);

  }

  handleWordHover() {
    // your code here
    //useSpeech();
  }

  handleToggleSwitch() {
    // your code here
    //useSpeech();
  }

  handleClick() {
    this.setState({ click: !this.state.click });
  }

  toggleDarkMode() {
    const html = document.querySelector('html');
    html.classList.toggle('dark');
    this.setState({ darkMode: !this.state.darkMode });
  }


/*Fetch all games as the default when the page is first loaded, since the all-games button is selected as default*/
componentDidMount() {
  //Fetch all games, since this is the default button selected

  //Authorise user with their token
  this.state.token = localStorage.getItem("token"); // Get the token from localStorage
  this.setState({token: this.state.token});
  console.log("token", this.state.token);

  /*
    const response = await fetch(`http://127.0.0.1:8000/api/friends/`, {
      headers: {
        Authorization: `Token ${token}` // Add the token to the Authorization header
      }
    });
    const data = await response.json();
    console.log("DATA", data);
    this.setState({ friends: data });
  };
  */

  this.fetchGames("games/");

  //Fetch the current user info, then make the default values of the currentLat and currentLon
  //Equal to the user's entered location_latitude and location_longitude
  
  /*
  fetch('https://matchpoint.games/api/predictions/', {
    method: 'POST',
    headers: {
      Authorization: `Token ${this.state.token}`
  },
  })
  .then(response => response.json())
  .then(data => {
    console.log("AI DATA: " + data);
    console.log(data)
    const formattedGames = data.map((listing, index) => ({
      //Attributes that will be displayed by each game listing or used to display an element of the game listing in the map or calendar components
      game_id: listing.game_id,
      session_title: listing.session_title,
      image: listing.image,
      organisation: listing.organisation,
      game_description: listing.game_description,
      location: listing.location,
      location_latitude: listing.location_latitude,
      location_longitude: listing.location_longitude,
      date: listing.date,
      start_time: listing.start_time,
      end_time: listing.end_time,
      status: listing.status,

      //Other attributes to calculate the compatability score for each game listing
      sport: listing.sport,
      age_range: listing.age_range,
      confirmed_players: listing.confirmed_players,
      frequency: listing.frequency,
      skill_rating: listing.skill_rating,
      host_id: listing.user_id,

      compatibility: index + 1
    }));
    console.log("AI GAMES!!!");
    console.log(formattedGames);
    //this.state.games = formattedGames;
    //this.setState({games: this.state.games});
  })
  */


}

/*Fetch the specific subset of games depending on the result of the handleClick function below*/
fetchGames(query) {

  //Validate the fetch request to ensure no possibility for an injection attack
  if (query === 'games/' || query === 'my-games/' || query === 'favourite-games/') {
    console.log("Fetching url with query: " + query + "and token: " + this.state.token);
    fetch('https://matchpoint.games/api/' + query, {
      method: 'POST',
      headers: {
        Authorization: `Token ${this.state.token}`
    },
    })
    .then(response => response.json())
    .then(data => {
      console.log("AI DATA: " + data);
      console.log(data)
      const formattedGames = data.map((listing, index) => ({
        //Attributes that will be displayed by each game listing or used to display an element of the game listing in the map or calendar components
        game_id: listing.game_id,
        session_title: listing.session_title,
        image: listing.image,
        organisation: listing.organisation,
        game_description: listing.game_description,
        location: listing.location,
        location_latitude: listing.location_latitude,
        location_longitude: listing.location_longitude,
        date: listing.date,
        start_time: listing.start_time,
        end_time: listing.end_time,
        status: listing.status,
  
        //Other attributes to calculate the compatability score for each game listing
        sport: listing.sport,
        age_range: listing.age_range,
        confirmed_players: listing.confirmed_players,
        frequency: listing.frequency,
        skill_rating: listing.skill_rating,
        host_id: listing.user_id,
  
        compatibility: index + 1
      }));
      console.log("AI GAMES!!!");
      console.log(formattedGames);
      this.state.games = formattedGames;
      this.setState({games: this.state.games});


      //Filter the games based upon the information currently entered into the searchbars and filters,
      //then sort the filtered games list
      this.setQuery();
      //console.log(formattedGames);
      //console.log(this.state.games);
      //console.log(this.state.filteredGames);
 
    })
    .catch(error => {
      console.log(error);
    });
  }

  else {
    console.log("Invalid query string: " + query);
  }

}


//Functionality to change the appearance of the searchbar when clicked on
handleSearchClick(e) {
    e.target.className = "SearchBar-Selected";

    if (e.target.id =="Search-Keywords") {
        document.getElementById("Search-Location").className = "SearchBar"
    }

    else if (e.target.id == "Search-Location") {
        document.getElementById("Search-Keywords").className = "SearchBar"
    }

}

//Functionality to filter and sort the list of games
//This is based upon the contents of the search bars,
//As well as all filters and sorts
setQuery() {
  //Filter using the keywords and locations search bars
  const keywords = document.getElementById("Search-Keywords").value;
  const location = document.getElementById("Search-Location").value;

  //Validate the filters
  var elementValues = [];//Used to split the elementValue from each filter


  var nextMeetingFlag = false;//Used to determine whether or not the filter should be applied to all games
  var nextMeetingFilterFlag = true;//Used to filter each game
  var nextMeetingType = "Current";
  var nextMeetingValue = "Day";

  //Check if the filter is selected
  const nextMeeting = this.state.filters.find(
    (item) => item.id === "NextMeeting"
  );
  if (nextMeeting) {
    console.log("NextMeeting optgroup found!!!");
    nextMeetingFlag = true;
    elementValues = nextMeeting.elementValue.split(" ");
    nextMeetingType = elementValues[0];
    nextMeetingValue = elementValues[1];
  }
  else {
    console.log("NextMeeting optgroup not found!!!");
    //nextMeetingFlag = false;
  }




  var distanceFlag = false;//Used to determine whether or not the filter should be applied to all games
  var distanceFilterFlag = true;//Used to filter each game
  var distanceType = "Current";
  var distanceValue = 1;

  //Check if the filter is selected
  const distance = this.state.filters.find(
    (item) => item.id === "Distance"
  );
  if (distance) {
    console.log("Distance optgroup found!!!");
    distanceFlag = true;
    elementValues = distance.elementValue.split(" ");
    distanceType = elementValues[0];
    distanceValue = Number(elementValues[1]);

    //Alert the user if a location hasn't been selected or the selected location is invalid
    if (distanceType == "Current" && (this.state.currentLat == null || this.state.currentLon == null)) {
      console.log(this.state.currentLat, this.state.currentLon);
      console.log("Invalid location");
      alert("Invalid location selection")
      distanceFlag = false;
      distanceFilterFlag = false;//If an invalid location is selected, then no game should be displayed
    }
    else if (distanceType == "Selected" && (this.state.selectedLat == null || this.state.selectedLon == null)) {
      console.log("Invalid location");
      alert("Invalid location selection")
      distanceFlag = false;
      distanceFilterFlag = false;//If an invalid location is selected, then no game should be displayed
    }

  }
  else {
    console.log("NextMeeting optgroup not found!!!");
    //distanceFlag = false;
  }




  //Filter the list of games
  this.state.filteredGames = this.state.games.filter(game => {
      
      //Perform any selected filters      
      if (nextMeetingFlag) {
        nextMeetingFilterFlag = this.dateFilter(game, nextMeetingType, nextMeetingValue);
      }
      if (distanceFlag) {
        distanceFilterFlag = this.locationFilter(game, distanceType, distanceValue);
      }

      //Return true if all conditions are satisfied
      return(
        game.session_title.toLowerCase().includes(keywords.toLowerCase()) &&
        game.location.toLowerCase().includes(location.toLowerCase()) &&
        //game.status != "Finished" &&
        nextMeetingFilterFlag &&
        distanceFilterFlag
      )
  })
  //console.log(this.state.games);
  //console.log(this.state.filteredGames);
  this.setState({filteredGames: this.state.filteredGames});



  //Sort the filtered list of games, with a default sort based upon alphabetical order of the session title of each game
  if (this.state.sorts.length === 1) {
    this.Sort(this.state.sorts[0].className, this.state.sorts[0].attribute);
  }
  else {
    this.Sort("ascending", "session_title");
  }
  this.setState({filteredGames: this.state.filteredGames});//Required for the game listings to be displayed
  //console.log("FILTERED GAMES WITHIN THE SET QUERY:");
  //console.log(this.state.filteredGames);

}


//Filter the list of games based upon the meetingDate
dateFilter(game, type, value) {
  console.log("DATE FILTER!!!");
  //Validation is performed in the setQuery() method


  //Determine which filter from the optgroup has been selected
  if (type === "Current") {
    if (value == "Day") {
      return game.date === this.state.currentDate.toISOString().slice(0, 10);
    }
    else if (value == "Week") {
      var tempDate = new Date(game.date);
      var week = Math.ceil((tempDate.getDate() + 6 - tempDate.getDay()) / 7);
      return week === Math.ceil((this.state.currentDate.getDate() + 6 - this.state.currentDate.getDay()) / 7);
    }
    else if (value == "Month") {
      var gameMonth = game.date.split("-")[1];
      var calendarMonth = this.state.currentDate.toISOString().slice(0, 10).split("-")[1];
      return gameMonth === calendarMonth;
    }
    else {
      console.log("Invalid value");
      return false;
    }
  }

  else if  (type === "Selected") {
    if (value == "Day") {
      return game.date === this.state.selectedDate.toISOString().slice(0, 10);
    }
    else if (value == "Week") {
      var tempDate = new Date(game.date);
      var week = Math.ceil((tempDate.getDate() + 6 - tempDate.getDay()) / 7);
      return week === Math.ceil((this.state.selectedDate.getDate() + 6 - this.state.selectedDate.getDay()) / 7);
    }
    else if (value == "Month") {
      var gameMonth = game.date.split("-")[1];
      var calendarMonth = this.state.selectedDate.toISOString().slice(0, 10).split("-")[1];
      //console.log("GAME MONTH: " + gameMonth);
      //console.log("CURRENT MONTH: " + calendarMonth);
      return gameMonth === calendarMonth;
    }
    else {
      console.log("Invalid value");
      return false;
    }
  }

  else {
    console.log("Invalid value");
    return false;
  }

}

locationFilter(game, type, value) {
  console.log("LOCATION FILTER!!!");
  //Validation occurs inside the setQuery() function so that it isn't repeated for each game to be filtered

  if (type === "Current") {
    //Calculate the distance from the game's location
    var calculatedDistance = this.calculateDistance(game.location_latitude, game.location_longitude, this.state.currentLat, this.state.currentLon, "miles");
    //Then return true if this is less than the value provided
    return calculatedDistance < value;
  }

  else if (type === "Selected") {
    //Calculate the distance from the game's location
    var calculatedDistance = this.calculateDistance(game.location_latitude, game.location_longitude, this.state.selectedLat, this.state.selectedLon, "miles");
    //Then return true if this is less than the value provided
    return calculatedDistance < value;
  }
  else {
    console.log("Invalid value");
    return false;
  }
}

//Calculates the distance between two locations on a sphere using the Haversine formula
calculateDistance(lat1, lon1, lat2, lon2, format) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat1 - lat2) * Math.PI) / 180;
  const dLon = ((lon1 - lon2) * Math.PI) / 180;
  const lat3 = (lat2 * Math.PI) / 180;
  const lat4 = (lat1 * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat3) * Math.cos(lat4) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;//Value in km

  //Return the correct format for the distance
  console.log("VALUES: ");
  console.log(lat1, lon1, lat2, lon2);
  console.log("DISTANCE IN KM: " + distance);
  console.log("DISTANCE IN MILES: " + distance * 0.62137119);
  console.log("FORMAT SELECTED: " + format);

  if (format == "kilometers") {
    return distance;
  }
  else if (format == "miles") {
    return distance * 0.62137119;
  }
  else {
    console.log("Invalid format, defaulting to kilometers");
    return distance;
  }
}


Sort(type, attribute){

  //Sort the game listings depending on the sort applied
  //console.log("Value: " + value);
  if (type == "ascending"){
    console.log("Ascending sort!");
    this.state.filteredGames.sort((a, b) => {
      if (typeof a[attribute] === 'number' && typeof b[attribute] === 'number') {
        return a[attribute] - b[attribute];
      } else {
        //console.log("STRING!!!");
        //console.log("A: " + a[value]);
        //console.log("B: " + b[value]);
        return a[attribute].localeCompare(b[attribute]);
      }
    });
  }
  else {
    console.log("Descending sort!");
    this.state.filteredGames.sort((a, b) => {
      //console.log("VALUE: " + a[value]);
      //console.log("DATATYPE: " + typeof a[value]);
      if (typeof a[attribute] === 'number' && typeof b[attribute] === 'number') {
        return b[attribute] - a[attribute];
      } else {
        //console.log("STRING!!!");
        //console.log("A: " + a[value]);
        //console.log(a['compatibility']);
        //console.log("B: " + b[value]);
        return b[attribute].localeCompare(a[attribute]);
      }
    });
  }
  console.log("SORTED GAMES LIST!!!");
  //console.log(this.state.filteredGames);
}


//Functionality to change the appearance of the select buttons when pressed
//Also fetches the corresponding list of games depending on the view selected
handleClick(e) {
    e.target.className = "section-option-selected";
    //this.setState({section: e.target.value});
    this.state.section = e.target.value;

    if (e.target.id == "games-button") {
        console.log("games-button pressed!")
        document.getElementById("mygames-button").className = "section-option";
        document.getElementById("favourites-button").className = "section-option";
        document.getElementById("list-container").className = "main-list-games";
        this.fetchGames('games/');
    }

    else if (e.target.id == "mygames-button") {
        console.log("mygames-button pressed!")
        document.getElementById("games-button").className = "section-option";
        document.getElementById("favourites-button").className = "section-option";
        document.getElementById("list-container").className = "main-list-mygames";
        this.fetchGames('my-games/');
    }

    else if (e.target.id == "favourites-button") {
        console.log("favourites-button pressed!")
        document.getElementById("games-button").className = "section-option";
        document.getElementById("mygames-button").className = "section-option";
        document.getElementById("list-container").className = "main-list-favourites";
        this.fetchGames('favourite-games/');
      }
    console.log(e.target.className);
}

//Functionality to add a filter to the filter list
//Here, the setQuery function is used to perform all filtering of the games
//This includes both the search bars and the filters (Yet to be implemented)
//Therefore, te setQuery function needs to be called when adding a filter to the filters list
handleFilterSelection(e) {
    //Find the text content, value and optgroup of the selected filter
    const {
        selectedIndex,
        options
    } = e.currentTarget;
    const selectedOption = options[selectedIndex];
    const value = selectedOption.value;
    const optgroupLabel = selectedOption.closest('optgroup')?.label;
    
    console.log({
      value,
      optgroupLabel,
    });

    //console.log(selectedOption.textContent);
    
    //Create the li element to append to the ul list of filters
    const filterToAdd = {
        id: optgroupLabel,
        elementValue: value,
        text: selectedOption.textContent,
    };
    console.log("Filter to add: " + filterToAdd);

    
    //Remove all filters with the matching optgroup to the selected filter
    const oldFilter = this.state.filters.find(
      (item) => item.id === optgroupLabel
    );
    if (oldFilter) {
      const index = this.state.filters.indexOf(oldFilter);
      this.state.filters.splice(index, 1);
    }
    else {
      console.log("ERROR!!!");
    }

    this.state.filters.push(filterToAdd);
    this.setState({filters: this.state.filters});

    

    //Reset the selected value to the default so that the visible text on the dropdown doesn't change
    e.target.value = "0";
    //console.log(e.target.value);

    //Finally, filter the list of games with both the current values in the search bars
    //As well as the additional filter that has been added to the list
    this.setQuery();
}

removeFilter(id) {
    //Remove all filters with the matching optgroup to the selected filter
    const oldFilter = this.state.filters.find(
      (item) => item.id === id
    );
    if (oldFilter) {
      const index = this.state.filters.indexOf(oldFilter);
      this.state.filters.splice(index, 1);
    }
    else {
      console.log("ERROR!!!");
    }

    //Filter the list of games after the removal of the filter
    this.setQuery();
}

//Functionality to add a sort
//Here, the setQuery function is not required at the end
//This is because the addition or removal of sorts
//has no effect on the number of games that are displayed,
//Only the order in which they are displayed
handleSortSelection(e) {
  //Find the text content, value and optgroup of the selected filter
  const {
      selectedIndex,
      options
  } = e.currentTarget;
  const selectedOption = options[selectedIndex];
  const value = selectedOption.value;
  const className = selectedOption.className;
  //const optgroupLabel = selectedOption.closest('optgroup')?.label;
  
  console.log({
    value,
    className,
    //optgroupLabel,
  });

  //console.log(selectedOption.textContent);
  
  //Create the li element to append to the ul list of filters
  const sortToAdd = {
      id: "sort",
      className: className,
      attribute: value,
      text: selectedOption.textContent,
  };
  console.log(sortToAdd);


  //Remove all sorts and replace the sorts list with the new sort
  this.state.sorts = [sortToAdd];
  this.setState({sorts: this.state.sorts});

  //Sort the list of games
  this.Sort(className, value);

  //Reset the selected value to the default so that the visible text on the dropdown doesn't change
  e.target.value = "0";

  console.log(e.target.value);
}  

removeSort(id) {
  console.log("Removing sort: " + id);
  this.setState((state) => ({
      sorts: state.sorts.filter((sort) => sort.id != id),
  }));

  //Revert to the default sort (Sort by Compatibility from highest to lowest)
  this.Sort("ascending", "session_title");

}

handleCalendarChange(date) {
  //Add a few hours onto the date to avoid errors with boundary time values
  date.setHours(date.getHours() + 12);
  //console.log("CALENDAR DATE: " + date.toLocaleString());

  //Get the formatted date
  //console.log(date.toISOString().slice(0, 10));

  
  //const year = date.getFullYear();
  //const month = (date.getMonth() + 1).toString().padStart(2, "0");
  //const day = date.getDate().toString().padStart(2, "0");
  //const formattedDate = year + '-' + month + '-' + day;
  //console.log("CHANGING DATE TO: " + formattedDate);
  
  this.state.selectedDate = date;//un-formattedDate;
  this.setState({ selectedDate: this.state.selectedDate });
  console.log("CALENDAR DATE: " + this.state.selectedDate);


  //Check the filters list to see if the filter optgroup "NextMeeting" is present
  //If so, then the setQuery()
  const nextMeeting = this.state.filters.find(
    (item) => item.id === "NextMeeting" && item.elementValue.split(" ")[0] === "Selected"
  );
  if (nextMeeting) {
    console.log("CALENDAR SETTING QUERY!!!");
    this.setQuery();
  }
}

handleMapChange(type, lat, lon) {
  console.log("MAP CHANGE!!!");

  //Retreive the calculated latitude and longitude from the map component
  //console.log(lat, lon);

  if (type == "Selected") {
    //Set the state
    this.state.selectedLat = lat;
    this.state.selectedLon = lon;
    this.setState({selectedLat: this.state.selectedLat,
                  selectedLon: this.state.selectedLon});
    
    console.log(this.state.selectedLat, this.state.selectedLon);

    //Check the filters list to see if the filter optgroup "Distance" is present
    //If so, then the setQuery()
    const distance = this.state.filters.find(
      (item) => item.id === "Distance" && item.elementValue.split(" ")[0] === "Selected"
    );
    if (distance) {
      console.log("MAP SETTING QUERY!!!");
      this.setQuery();
    }
  }

  else if (type == "Current") {
        //Set the state
        this.state.currentLat = lat;
        this.state.currentLon = lon;
        this.setState({currentLat: this.state.currentLat,
                      currentLon: this.state.currentLon});
        
        console.log("CURRENT LOCATION: " + this.state.currentLat + this.state.currentLon);
  }

}

handleUIChange(e) {
    if (e.target.value == "dark") {
        //Change the fill of the search icons from #ffffff to #000000
        document.getElementsByClassName("Search-Icons").fill = "#000000"
    }
    else if (e.target.value == "light") {
        //Change the fill of the search icons from #000000 to #ffffff
        document.getElementsByClassName("Search-Icons").fill = "#ffffff"
    }
};

increaseFontSize(e) {
  this.setState((prevState) => ({ fontSize: prevState.fontSize + 2,
                                  fontSizeLarge: prevState.fontSizeLarge + 2,
                                  fontSizeMedium: prevState.fontSizeMedium + 2,
                                  fontSizeSmall: prevState.fontSizeSmall + 2}));
  console.log(this.state.fontSize);
}

decreaseFontSize(e) {
  this.setState((prevState) => ({ fontSize: prevState.fontSize - 2,
                                  fontSizeLarge: prevState.fontSizeLarge - 2,
                                  fontSizeMedium: prevState.fontSizeMedium - 2,
                                  fontSizeSmall: prevState.fontSizeSmall - 2}));
  console.log(this.state.fontSize);
}

  render() { 

    //Create the styles required to dynamically change the font size
    const style = {
      fontSize: this.state.fontSize,
    };

    const li = {
      fontSize: this.state.fontSizeSmall,
    };

    const section = {
      fontSize: this.state.fontSizeMedium,
    };
    const title = {
      fontSize: this.state.fontSizeLarge,
    };

    //This allows the method to be passed down to the Calendar component,
    //whilst also having access to the JoinGame component's state
    this.handleCalendarChange = this.handleCalendarChange.bind(this);
    this.handleMapChange = this.handleMapChange.bind(this);

    //console.log("TEST!");
    //console.log(this.state.games);
    //console.log(this.state.games.length);
    




    
    return (
          
    <div className="JoinGame">
      
      <header>
        <Sidebar />
      </header>

      <main className="joingame-main" style={style}>


        <div className='joingame-main-main-main'>

          <div className='joingame-main-main'>

            <div className='map-calendar'>
              <div className='button-container22'>
                <button className="font-button" id="increase-button" onClick={e => this.increaseFontSize(e)}>+ Font Size</button>
                <button className="font-button" id="derease-button" onClick={e => this.decreaseFontSize(e)}> -  Font Size</button>
              </div>
              
              <div className='map-api'>
                <OpenLayersMap function={this.handleMapChange} filteredGames={this.state.filteredGames}/>
              </div>
              
              <div className='calendar-api'>
                <Calendar onChange={this.handleCalendarChange} value={this.state.selectedDate}/>
              </div>

            </div>

            <div className="joingame-main-container" id="Grid-Column-1">
              <div className='find-game-title'> 
                <h1 className='Find-a-Game' style={title}>Find a Game</h1>  
              </div>


              <div className="searchbar">
                <div className="searchbar-top">
                  <div className="enter-keyword">
                    <input id="Search-Keywords" className="SearchBar-Selected" onClick={e => this.handleSearchClick(e, "id", "className")} onInput={e => this.setQuery(e, "id")} type="input" placeholder="Enter Keywords"/>
                      <svg id="Search-Icon1" className="Search-Icons" fill="#000000" width="20px" height="20px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M27 24.57l-5.647-5.648a8.895 8.895 0 0 0 1.522-4.984C22.875 9.01 18.867 5 13.938 5 9.01 5 5 9.01 5 13.938c0 4.929 4.01 8.938 8.938 8.938a8.887 8.887 0 0 0 4.984-1.522L24.568 27 27 24.57zm-13.062-4.445a6.194 6.194 0 0 1-6.188-6.188 6.195 6.195 0 0 1 6.188-6.188 6.195 6.195 0 0 1 6.188 6.188 6.195 6.195 0 0 1-6.188 6.188z"></path></g></svg>
                  </div>
                  <div className="enter-location">
                    <input id="Search-Location" className="SearchBar" onClick={e => this.handleSearchClick(e, "id", "className")} onInput={e => this.setQuery(e, "id")} type="input" placeholder="Enter Location"/>
                    <svg id="Search-Icon2" className="Search-Icons" fill="#000000" width="20px" height="20px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M27 24.57l-5.647-5.648a8.895 8.895 0 0 0 1.522-4.984C22.875 9.01 18.867 5 13.938 5 9.01 5 5 9.01 5 13.938c0 4.929 4.01 8.938 8.938 8.938a8.887 8.887 0 0 0 4.984-1.522L24.568 27 27 24.57zm-13.062-4.445a6.194 6.194 0 0 1-6.188-6.188 6.195 6.195 0 0 1 6.188-6.188 6.195 6.195 0 0 1 6.188 6.188 6.195 6.195 0 0 1-6.188 6.188z"></path></g></svg>
                  </div>
                </div>

                <div className="searchbar-bottom">
                  <div className="filters-container">
                    <div className='actual-filter'>
                      <select id="FilterOptions" defaultValue={"0"} className="filters-dropdown" onChange={e => this.handleFilterSelection(e, "id", "label")}>
                        <option value="0" disabled hidden>Select a Filter</option>
                                              
                        <optgroup value="Distance" label="Distance">
                          <option className="Distance" value="Current 1">Within 1 mile of current location</option>
                          <option className="Distance" value="Current 3">Within 3 miles of current location</option>
                          <option className="distance" value="Current 5">Within 5 miles of current location</option>
                          <option className="Distance" value="Current 10">Within 10 miles of current location</option>
                          <option className="Distance" value="Selected 1">Within 1 mile of selected location</option>
                          <option className="Distance" value="Selected 3">Within 3 miles of selected location</option>
                          <option className="distance" value="Selected 5">Within 5 miles of selected location</option>
                          <option className="Distance" value="Selected 10">Within 10 miles of selected location</option>
                        </optgroup>

                        <optgroup label="NextMeeting">
                          <option className="NextMeeting" value="Current Day">Meeting Today</option>
                          <option className="NextMeeting" value="Current Week">Meeting This Week</option>
                          <option className="NextMeeting" value="Current Month">Meeting This Month</option>
                          <option className="NextMeeting" value="Selected Day">Selected Date</option>
                          <option className="NextMeeting" value="Selected Week">Selected Week</option>
                          <option className="NextMeeting" value="Selected Month">Selected Month</option>
                        </optgroup>
                                          
                      </select>
                    </div>

                    <div className="selected-dropdown-items">
                      <ul id="FilterList" style={li}>
                        {this.state.filters.map((filter) => (
                          <li key={filter.id}>
                            <span value={filter.elementValue}>{filter.text}</span>
                            <button onClick={e => this.removeFilter(filter.id)}>x</button>
                          </li>))}
                      </ul>
                    </div>

                  </div>

                  <div className="sorts-container">
                    <div className='actual-filter'>
                      <select id="SortOptions" defaultValue={"0"} className="sorts-dropdown" onChange={e => this.handleSortSelection(e, "id")}>
                        <option value="0" disabled hidden>Sort By</option>

                        <option className="ascending" value="session_title" >Alphabetical</option>                 
                        <option className="ascending" value="compatibility" >Most Compatable</option>
                        <option className="descending" value="date">Meeting Date</option>
                      </select>
                      </div>

                      <div className="selected-dropdown-items">
                        <ul id="SortList" style={li}>
                          {this.state.sorts.map((sort) => (
                            <li key={sort.id}>
                              <span value={sort.elementValue}>{sort.text}</span>
                              <button onClick={e => this.removeSort(sort.id)}>x</button>
                            </li>))}
                        </ul>
                      </div>
                    </div>

                </div>     

              </div>

              <div className="list-of-games">
                <div className="section-select">
                  <div className="LIST" style={section}>
                    <ul>
                      <li id="games-button" className="section-option-selected" onClick={e => this.handleClick(e, "games")}> Games</li>
                      <li id="mygames-button" className="section-option" onClick={e => this.handleClick(e, "mygames")}>My Games</li>
                      <li id="favourites-button" className="section-option" onClick={e => this.handleClick(e, "favourites")}>Favourites</li>
                    </ul>
                  </div>
                </div>


                
                <div className="results-list">
                  <div id="list-container" className="main-list-games">
                    {this.state.filteredGames.map(game => <div className="GameListing" id={game.game_id} key={game.game_id}>
                      <Game match_id={game.game_id} titleStyle={section} organisationStyle={style}  
                            sport={game.sport} title={game.session_title} 
                            organisation={game.organisation} 
                            description={game.game_description} 
                            date={game.date} location={game.location} 
                            startTime={game.start_time} endTime={game.end_time} 
                            compatibility={game.compatibility} />
                    </div>)}
                  </div>
                </div>
              </div>
                          
          </div>


        </div>
      </div>
        
    </main>
      
  </div>);
  }
}
 
export default JoinGame;