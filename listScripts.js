// Array made for testing stuffs
var receiptArray = [["Frozen Garlic Bread", getDate(), "10/11/2020"],
                    ["Carrots", getDate(), "12/11/2019"],
                    ["Pasta Lunch Meal", getDate(), "11/12/2019"]];

function loadList() {

  // Create a "close" button and append it to each list item
  var myNodelist = document.getElementsByTagName("LI");
  var i;
  for (i = 0; i < myNodelist.length; i++) {
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    myNodelist[i].appendChild(span);
  }

  // Add a "checked" symbol when clicking on a list item
  var list = document.querySelector('div #myListDiv > ul');
  list.addEventListener('click', function(ev) {
    if (ev.target.tagName === 'LI') {
      ev.target.classList.toggle('checked');
    }
  }, false);

  updateList();
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.remove();
  }
} 


// Create a new list item when clicking on the "Add" button
function newElement() {
  var nameValue = document.getElementById("nameInput").value;
  var boughtValue = getDate()
  var expireValue = document.getElementById("expireInput").value;
  if ((nameValue === "") || (expireValue === "")) {
    alert("Fill both Values");
  } else if (!checkDate(expireValue)){ 
    alert("Date must be in the Correct Format");
  } else {
    receiptArray.push([nameValue, boughtValue, expireValue])
  }
  document.getElementById("nameInput").value = "";
  document.getElementById("expireInput").value = "";

  sortReceipt();
  updateList();
}

function updateList() {
  sortReceipt();
  removeAll();
  for (const foodData of receiptArray) {
    var nameValue = foodData[0];
    var boughtValue = foodData[1];
    var expireValue = foodData[2];

    var li = document.createElement("li");
    var t = document.createTextNode(nameValue + " --- Bought On: ");
    var tb = document.createTextNode(boughtValue + " --- Expires On: ");
    var te = document.createTextNode(expireValue);
    li.appendChild(t);
    li.appendChild(tb);
    li.appendChild(te);

    try {
    document.getElementById("myUL").appendChild(li);
    } catch {}

    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);
  }

  try {
  notifyExpires();
  expiredAction();
  } catch {}
  removeOne();
}

function removeOne() {
  var close = document.getElementsByClassName("close");
  for (var i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      console.log(close[i])
      let newArray = JSON.parse(JSON.stringify(receiptArray))
      console.log(receiptArray);
      newArray.splice(i, 1)
      receiptArray = newArray;
      console.log(newArray);

      div.style.display = "none";
    }
  }
}

function removeAll() {
  try {
  children = document.getElementById("myUL").children
  } catch { children = [] }
  while (children.length > 0) {
    //receiptArray.shift();
    children[0].remove();
    children = document.getElementById("myUL").children
  }
}


function getDate() {
  // returns string of todays date
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + '/' + mm + '/' + yyyy;
  return today;
}

function checkDate(str) {
  strArr = str.split("/")
  strAmerican = strArr[1] + '/' + strArr[0] + '/' + strArr[2];
  return moment(strAmerican, 'MM/DD/YYYY',true).isValid()
}

function sortByDate(a, b) {
  // Split the date into array of strings ["dd","mm","yyyy"]
  var aSplit = a.split("/");
  var bSplit = b.split("/");


  // Convert the strings to integers [dd,mm,yyyy]
  var aInt = [];
  var bInt = [];

  for (var i = 0; i < aSplit.length; i++) {
    aInt.push(parseInt(aSplit[i]));
  }
  for (var i = 0; i < bSplit.length; i++) {
    bInt.push(parseInt(bSplit[i]));
  }

  /* Check if the year is the same, if not return comparison of years
    a +ve number returned puts a on the left, 0 keeps it the same, and -1 puts on the right
    if the year is the same do the above for month,
    if the month is the same return the difference in the date */
  if (aInt[2] == bInt[2]) {
    if (aInt[1] == bInt[1]) {
      if (aInt[0] <= bInt[0]) {
        return aInt[0] - bInt[0];
      }
    } else {
      return aInt[1] - bInt[1];
    }
  } else {
    return aInt[2] - bInt[2];
  }
}

function sortReceipt() {
  receiptArray = receiptArray.sort( function(a, b){ return sortByDate(a[2], b[2]) })
}

function checkAllDates() {
  // Thank you Sam from AMEX
  const filteredList = receiptArray.filter((item) => new Date(item[2]).getTime() > new Date().getTime());
  receiptArray = filteredList;
}

function notifyExpires() {
  if (parseInt(receiptArray[0][2].substring(0,2)) -
      parseInt(getDate().substring(0,2)) <= 1) {
    alert(receiptArray[0][0] + " is expiring Soon!" )
    expiredAction(receiptArray[0][0]);
  }
}

function expiredAction(food) {
  if (parseInt(receiptArray[0][2].substring(0,2)) -
      parseInt(getDate().substring(0,2)) <= 1) {
    setExpiredFood(food);
  
  }
}