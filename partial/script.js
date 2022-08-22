button1 = document.getElementById("button1");
button2 = document.getElementById("button2");

// only usable up to 10k elements
const jacobsthal = [2, 2, 6, 10, 22, 42, 86, 170, 342, 682, 1366, 2730, 5462, 10922]; 

let maxSortedList = [];

function updatePercentComplete(numComplete, numTotal) {
    percentage = (numComplete / numTotal) * 100;
    console.log(`${Math.floor(percentage)}% complete`);
    $("#bar").css('width', percentage + "%");
}

function downloadAsCSV(array, name) {
    csvText = 'data:text/csv;charset=utf-8,';
    csvText += array.join('\n');
    var encodedUri = encodeURI(csvText);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", name + ".csv");
    document.body.appendChild(link); 
    link.click();
}

let items = [];

const timeout = async ms => new Promise(res => setTimeout(res, ms));
let next = false; // this is to be changed on user input

async function waitUserInput() {
  next = false;
  while (next === false) await timeout(50); // pauses script
  return next;
}

let fileContent = false;
async function waitFileUpload() {
    while (fileContent === false) await timeout(50);
    return fileContent;
}

function getPastedText() {
    let text = $("#paste").val();
    $("#paste").val('SUBMITTED');
    // lock in the text
    $("#paste").prop('disabled', true);
    fileContent = text;
}

let fileContent2 = false;
async function waitFileUpload2() {
    while (fileContent2 === false) await timeout(50);
    return fileContent2;
}

function getPastedText2() {
    let text = $("#paste2").val();
    $("#paste2").val('SUBMITTED');
    // lock in the text
    $("#paste2").prop('disabled', true);
    fileContent2 = text;
}

$('.dropZone').on(
    'dragover',
    function(e) {
        e.preventDefault();
        e.stopPropagation();
    }
)
$('.dropZone').on(
    'dragenter',
    function(e) {
        e.preventDefault();
        e.stopPropagation();
    }
)
$('#dropZone').on(
    'drop',
    function(e){
        e.preventDefault();
        e.stopPropagation();
        console.log("drop");
        if(e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length) {
            e.preventDefault();
            e.stopPropagation();
            /*UPLOAD FILES HERE*/
            if (e.originalEvent.dataTransfer.files.length > 1) {
                alert("Please only upload 1 file.");
                return;
            }
            file = e.originalEvent.dataTransfer.files[0];
            console.log(`file name: ${file.name}`);
            let reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function (event) {
                fileContent = event.target.result;
                // lock in the text and drop zone
                $("#dropZone").prop('disabled', true);
                $("#paste").prop('disabled', true);
                $("#paste").val(fileContent);
                $("#dropZone").children()[0].innerHTML = "FILE UPLOADED";
              };
        }
    }
);
$('#dropZone2').on(
    'drop',
    function(e){
        e.preventDefault();
        e.stopPropagation();
        console.log("drop");
        if(e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length) {
            e.preventDefault();
            e.stopPropagation();
            /*UPLOAD FILES HERE*/
            if (e.originalEvent.dataTransfer.files.length > 1) {
                alert("Please only upload 1 file.");
                return;
            }
            file = e.originalEvent.dataTransfer.files[0];
            console.log(`file name: ${file.name}`);
            let reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function (event) {
                fileContent2 = event.target.result;
                // lock in the text and drop zone
                $("#dropZone2").prop('disabled', true);
                $("#paste2").prop('disabled', true);
                $("#paste2").val(fileContent2);
                $("#dropZone2").children()[0].innerHTML = "FILE UPLOADED";
              };
        }
    }
);

button1.onclick = function() {
  next = button1.innerHTML;
}
button2.onclick = function() {
  next = button2.innerHTML;
}


function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
    
        // Generate random number
        var j = Math.floor(Math.random() * (i + 1));
                    
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
        
    return array;
 }

 async function binarySearch(array, item, lowerBound, upperBound) { 
    if (lowerBound == upperBound) {
        if ((await compare(array[lowerBound], item) > 0)) {
            return lowerBound;
        }
        else {
            return lowerBound + 1;
        }
    }
    if (lowerBound > upperBound) {
        return lowerBound;
    }

    midpoint = Math.floor((lowerBound + upperBound) / 2);
    midItem = array[midpoint];
    isGreater = (await compare(item, midItem) > 0);
    if (isGreater) {
        return await binarySearch(array, item, midpoint + 1, upperBound);
    }
    else {
        return await binarySearch(array, item, lowerBound, midpoint - 1);
    }
 }

async function compare(a, b) {
  button1.innerHTML = a;
  button2.innerHTML = b;
  pressedButton = await waitUserInput();
  //button1.innerHTML = '';
  //button2.innerHTML = '';
  if (pressedButton === a) {
    return 1;
  } else if (pressedButton === b) {
    return -1;
  }
}

async function binaryInsertionSort(sorted, unsorted) {
    let numTotal = unsorted.length;
    shuffle(unsorted);
    for (let i = 0; i < unsorted.length; i++) {
        updatePercentComplete(i, numTotal);
        let item = unsorted[i];
        let index = await binarySearch(sorted, item, 0, sorted.length - 1);
        sorted.splice(index, 0, item);
    }
    return sorted;
}


async function main() {
    $("#resultsBox").hide();
    $("#downloadResults").hide();
    $("#button1").hide();
    $("#button2").hide();
    $("#progressBar").hide();
    // get file
    $("#submit").click(getPastedText);
    $("#submit2").click(getPastedText2);
    let descending = true;
    $("#inputSwitch").change(() => descending = !descending);
    fileText = await waitFileUpload();
    fileText2 = await waitFileUpload2();
    sorted = fileText.split(/\n|,|\t/);
    unsorted = fileText2.split(/\n|,|\t/);
    // clean items
    for (i in sorted) {
        sorted[i] = sorted[i].trim();
        if (sorted[i] === "") {
            sorted.splice(i, 1);
        }
    }
    for (i in unsorted) {
        unsorted[i] = unsorted[i].trim();
        if (unsorted[i] === "") {
            unsorted.splice(i, 1);
        }
    }    
    if (descending) {
        sorted.reverse();
    }
    $("#inputs").hide();
    $("#button1").show();
    $("#button2").show();
    $("#progressBar").show();
    sortedList = await binaryInsertionSort(sorted, unsorted);
    console.log("done");
    $("#progressBar").hide();
    $("#button1").hide();
    $("#button2").hide();
    $("#resultBox").show();
    sortedList.reverse();
    $("#results").html(sortedList.join("<br>"));
    // toggle ascending descending
    $('#switch').change(function() {
        sortedList.reverse();
        $("#results").html(sortedList.join("<br>"));
    });
    $("#downloadResults").click(function() {
        downloadAsCSV(sortedList, "sorted");});
    $("#downloadResults").show();
}

$(document).ready(main);