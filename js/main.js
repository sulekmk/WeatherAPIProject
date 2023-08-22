var exampleCSV = `latitude,longitude,city,country
52.367,4.904,Amsterdam,Netherlands
39.933,32.859,Ankara,Turkey
56.134,12.945,Åstorp,Sweden
37.983,23.727,Athens,Greece
54.597,-5.930,Belfast,Northern Ireland
41.387,2.168,Barcelona,Spain
52.520,13.405,Berlin,Germany
46.948,7.447,Bern,Switzerland
43.263,-2.935,Bilbao,Spain
50.847,4.357,Brussels,Belgium
47.497,19.040,Bucharest,Romania
59.329,18.068,Budapest,Hungary
51.483,-3.168,Cardiff,Wales
50.937,6.96,Cologne,Germany
55.676,12.568,Copenhagen,Denmark
51.898,-8.475,Cork,Ireland
53.349,-6.260,Dublin,Ireland
55.953,-3.188,Edinburgh,Scotland
43.7696,11.255,Florence,Italy
50.110,8.682,Frankfurt,Germany        
43.254,6.637,French Riviera,France
32.650,-16.908,Funchal,Portugual
36.140,-5.353,Gibraltar
57.708,11.974,Gothenburg,Sweden     
53.548,9.987,Hamburg,Germany
60.169,24.938,Helsinki,Finland
39.020,1.482,Ibiza,Spain
50.450,30.523,Kyiv,Ukraine
61.115,10.466,Lillehammer,Norway
38.722,-9.139,Lisbon,Portugual
51.507,-0.127,London,England      
40.416,-3.703,Madrid,Spain
39.695,3.017,Mallorca,Spain
53.480,-2.242,Manchester,England       
43.296,5.369,Marseille,France
27.760,-15.586,Maspalomas,Spain
45.464,9.190,Milan,Italy
48.135,11.582,Munich,Germany
40.851,14.268,Naples,Italy
43.034,-2.417,Oñati,Spain
59.913,10.752,Oslo,Norway
48.856,2.352,Paris,France
50.075,14.437,Prague,Czech Republic
64.146,-21.942,Reykjavík,Iceland
56.879,24.603,Riga,Latvia
41.902,12.496,Rome,Italy
39.453,-31.127,Santa Cruz das Flores,Portugual
28.463,-16.251,Santa Cruz de Tenerife,Spain
57.273,-6.215,Skye,Scotland
42.697,23.321,Sofia,Bulgaria
59.329,18.068,Stockholm,Sweden
59.437,24.753,Tallinn,Estonia
18.208,16.373,Vienna,Austria
52.229,21.012,Warsaw,Poland
53.961,-1.07,York,England
47.376,8.541,Zurich,Switzerland`;

var CSVToJSON = (csv) => {
  const lines = csv.split("\n");
  //  console.log("lines>>" + lines);
  //key properties
  const keys = lines[0].split(",");
  //console.log("keys>>" + keys);
  //it returns values of properties
  return lines.slice(1).map((line) => {
    return line.split(",").reduce((acc, cur, i) => {
      const toAdd = {};
      toAdd[keys[i]] = cur;
      return { ...acc, ...toAdd };
    }, {});
  });
};

function onLoadFetchCityNames() {
  const cityCoordinatesDropDown = document.getElementById("cityCoordinates");
  const countriesData = CSVToJSON(exampleCSV);
  console.log("countriesData>>>>>" + JSON.stringify(countriesData));

  const flagIcon = document.getElementById("flag-icon");

  for (let key in countriesData) {
    //console.log("key:::::"+key+"CITY name::::::"+JSON.stringify((countriesData)[key]["city"]));
    let option = document.createElement("option");
    let cityName = JSON.stringify(countriesData[key]["city"]); //.replace(/['"]+/g, '');
    let countryName = JSON.stringify(countriesData[key]["country"]); //.replace(/['"]+/g, '');
    let lon = JSON.stringify(countriesData[key]["longitude"]); //.replace(/['"]+/g, '');
    let lat = JSON.stringify(countriesData[key]["latitude"]); //.replace(/['"]+/g, '');

    let cityNameStr = "";
    let countryNameStr = "";
    if (cityName != undefined && countryName != undefined) {
      cityNameStr = cityName.replace(/['"]+/g, "");
      countryNameStr = countryName.replace(/['"]+/g, "");
    } else {
      cityNameStr = "";
      countryNameStr = "";
    }

    option.setAttribute("value", lon + "," + lat);
    // console.log("selected option value:::"+option.getAttribute("value"));
    let optionText = document.createTextNode(
      cityNameStr + " , " + countryNameStr
    );
    option.appendChild(optionText);
    cityCoordinatesDropDown.appendChild(option);
  }

  cityCoordinatesDropDown.addEventListener("change", (e) => {
    alert("......." + e.target.value);
    var targetData = e.target.value;
    //flagIcon.innerHTML = targetData.replace(/['"]+/g, '') ;
    var separatedArray = [];

    // Index of end of the last string
    let previousIndex = 0;

    for (i = 0; i < targetData.length; i++) {
      // Check the character for a comma
      if (targetData[i] == ",") {
        // Split the string from the last index
        // to the comma
        separated = targetData.slice(previousIndex, i);
        separatedArray.push(separated);

        // Update the index of the last string
        previousIndex = i + 1;
      }
    }

    // Push the last string into the array
    separatedArray.push(targetData.slice(previousIndex, i));
    var lon = separatedArray[0].split(":");
    var lat = separatedArray[1].split(":");
    console.log("separatedArray:::" + "lon...." + lon + "..lat.." + lat);
    fetchAPIInJSONFormat(lon, lat);
  });
}

function fetchAPIInJSONFormat(lon, lat) {
  console.log("latLongValues:::" + "lon>>>>" + lon + "lat>>>>" + lat);
  let timerAPI = "https://www.7timer.info/bin/api.pl";
  let urlParams =
    "?lon=" + lon + "&lat=" + lat + "&product=" + "civil&output=json";
  console.log(timerAPI + urlParams);
  document.getElementById("results").innerHTML = "";
  document.getElementById("resultsHTML").innerHTML = "";
  $.ajax({
    url: timerAPI + urlParams,
    cache: false,
    type: "GET",
    dataType: "json",
    success: function (response) {
      alert("Success");
      //createDynamicTable(response);
      createDynamicHTML(response);
    },
    error: function (xhr, status, error) {
      console.log("Error occured" + error + status);
    },
  });
}
//Create divs html dynamically
function createDynamicHTML(response) {
  var array = [
    "timepoint",
    "cloudcover",
    "lifted_index",
    "prec_type",
    "prec_amount",
    "temp2m",
    "rh2m",
    "weather",
    "Display-Weather",
  ];
  var paginationDiv = document.createElement("div");

  var imagesDisplay,
    weather,
    timepoint,
    cloudcover,
    lifted_index,
    prec_type,
    prec_amount,
    temp2m,
    temp2mData,
    rh2m,
    rh2mData = "";
  for (var j = 0; j < array.length; j++) {
    var para = document.createElement("div"); //column
    para.className =
      "forecast-block row row-cols-7 row-cols-md-7 row-cols-lg-7 g-4";
    var pTag = document.createElement("div");
    pTag.innerText = array[j];

    for (let key = 0; key <= response.dataseries.length; key++) {
      var spanTag1 = document.createElement("span");
      var spanTag2 = document.createElement("span");
      var spanTag3 = document.createElement("span");
      var spanTag4 = document.createElement("span");
      var spanTag5 = document.createElement("span");
      var spanTag6 = document.createElement("span");
      var spanTag7 = document.createElement("span");
      var spanTag8 = document.createElement("span");
      var spanTag9 = document.createElement("span");

      var colTag1 = document.createElement("div");
      var colTag2 = document.createElement("div");
      var colTag3 = document.createElement("div");
      var colTag4 = document.createElement("div");
      var colTag5 = document.createElement("div");
      var colTag6 = document.createElement("div");
      var colTag7 = document.createElement("div");
      var colTag8 = document.createElement("div");
      var colTag9 = document.createElement("div");
      var colTag10 = document.createElement("div");

      var figure = document.createElement("div");
      var image = document.createElement("img");
      image.width = "10%";
      image.id = "iconImage";
      figure.className = "card-body";

      if (response.dataseries[key] != undefined) {
        timepoint = document.createTextNode(
          response.dataseries[key]["timepoint"]
        );
        cloudcover = document.createTextNode(
          response.dataseries[key]["cloudcover"]
        );
        lifted_index = document.createTextNode(
          response.dataseries[key]["lifted_index"]
        );
        if (response.dataseries[key]["prec_type"] != undefined) {
          prec_type = document.createTextNode(
            response.dataseries[key]["prec_type"]
          );
        } else {
          prec_type = document.createTextNode("none");
        }
        if (response.dataseries[key]["prec_amount"] != undefined) {
          prec_amount = document.createTextNode(
            response.dataseries[key]["prec_amount"]
          );
        } else {
          prec_amount = document.createTextNode(0);
        }
        temp2m = response.dataseries[key]["temp2m"];
        if (isObject(temp2m)) {
          console.log(temp2m);
          temp2mData = document.createTextNode(temp2m.min + " - " + temp2m.max);
        } else {
          temp2mData = document.createTextNode(
            response.dataseries[key]["temp2m"]
          );
        }
        rh2mData = document.createTextNode(response.dataseries[key]["rh2m"]);
        var getValuesFromSwitchCase = switchToWeather(
          response.dataseries[key]["weather"]
        );
        image.alt = "It is " + getValuesFromSwitchCase[0] + ".";
      } // if loop to check undefined response end
      spanTag1.appendChild(timepoint);
      spanTag2.appendChild(cloudcover);
      spanTag3.appendChild(lifted_index);
      spanTag4.appendChild(prec_type);
      spanTag5.appendChild(prec_amount);
      var temp = "T:";
      var relHumidity = "R-H:";
      spanTag6.innerText += temp;
      spanTag7.innerText += relHumidity;

      spanTag6.appendChild(temp2mData);
      spanTag7.appendChild(rh2mData);
      spanTag6.innerText += "\xB0C";
      spanTag8.appendChild(getValuesFromSwitchCase[0]);
      image.src = getValuesFromSwitchCase[1];

      figure.appendChild(image);
      colTag1.appendChild(figure);
      colTag1.appendChild(spanTag6);
      colTag1.appendChild(spanTag7);
      colTag1.appendChild(spanTag8);
      colTag1.className = "col bm-2";
      colTag2.className = "card";
      colTag2.appendChild(colTag1);
      para.appendChild(colTag2);
    } //for loop for response data end
    pTag.id = "columnHeader";
  } //array header row for loop end
  document.getElementById("resultsHTML").appendChild(para);
}
//Check if value is an Object
function isObject(objValue) {
  return (
    objValue && typeof objValue === "object" && objValue.constructor === Object
  );
}
function switchToWeather(response) {
  weather = document.createTextNode(response);
  switch (response) {
    case "pcloudyday":
      imagesDisplay = "./images/pcloudy.png";
      break;

    case "mcloudyday":
      imagesDisplay = "./images/mcloudy.png";
      break;

    case "clearnight":
      imagesDisplay = "./images/mcloudy.png";
      break;

    case "cloudynight":
      imagesDisplay = "./images/mcloudy.png";
      break;

    case "lightrainnight":
      imagesDisplay = "./images/rain.png";
      break;

    case "lightrainday":
      imagesDisplay = "./images/rain.png";
      break;

    case "mcloudynight":
      imagesDisplay = "./images/pcloudy.png";
      break;

    case "clearday":
      imagesDisplay = "./images/clear.png";
      break;

    case "pcloudynight":
      imagesDisplay = "./images/pcloudy.png";
      break;

    default:
      imagesDisplay = "./images/cloudy.png";
  }
  var getValues = new Array();
  getValues[0] = weather;
  getValues[1] = imagesDisplay;

  return getValues;
}

function getDateObject(dateString) {
  var dateString = dateString;
  var year = dateString.substring(0, 4);
  var month = dateString.substring(4, 6);
  var day = dateString.substring(6, 8);
  var date = new Date(year, month - 1, day);
  return date;
}
