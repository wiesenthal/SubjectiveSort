button1 = document.getElementById("button1");
button2 = document.getElementById("button2");

// only usable up to 10k elements
const jacobsthal = [2, 2, 6, 10, 22, 42, 86, 170, 342, 682, 1366, 2730, 5462, 10922]; 

let items = [];
let maxSortedList = [];

let numComparisons = 0;

function updatePercentComplete(sortedList) {
    if (sortedList) {
        if (sortedList.length > maxSortedList.length) {
            maxSortedList = sortedList;
        }
        let descendingList = [...maxSortedList].reverse();
        console.log(`sorted list so far:\n${descendingList}`);
    }
    let truePercentage = 100*(maxSortedList.length/items.length);
    let estimatedPercentage = 100*(numComparisons/estimateNumComparisons(items.length));
    estimatedPercentage = Math.min(100, estimatedPercentage);
    let percentage = (truePercentage + estimatedPercentage) / 2;
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

const timeout = async ms => new Promise(res => setTimeout(res, ms));
let next = false; // this is to be changed on user input

async function waitUserInput() {
  next = false;
  while (next === false) await timeout(50); // pauses script
  return next;
}

let fileContent = false;
async function waitFileUpload() {
    fileContent = false;
    while (fileContent === false) await timeout(50);
    return fileContent;
}

function getPastedText() {
    let text = $("#paste").val();
    fileContent = text;
}

function estimateNumComparisons(n) {
    let logBase237N = Math.log(n) / Math.log(2.35);
    return Math.floor(n * logBase237N);
}


$('#dropZone').on(
    'dragover',
    function(e) {
        e.preventDefault();
        e.stopPropagation();
    }
)
$('#dropZone').on(
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
    numComparisons += 1;
    button1.innerHTML = a;
    button2.innerHTML = b;
    pressedButton = await waitUserInput();
    updatePercentComplete();
    if (pressedButton === a) {
        return 1;
    } else if (pressedButton === b) {
        return -1;
    }
}

async function mergeInsertionSort(list)
{
    if (list.length <= 1) {
        return list;
    }
    if (list.length == 2) {
        item1 = list[0];
        item2 = list[1];
        if (await compare(item1, item2) > 0) {
            return [item2, item1];
        }
        else {
            return [item1, item2];
        }
    }
    shuffle(list);
    let isEven = (list.length % 2 == 0);
    // make pairs
    let extra = false;
    if (!isEven) {
        extra = list[list.length - 1];
    }
    let pairs = {};
    let reversePairs = {};
    for (i = 0; i < list.length - 1; i += 2) {
        a = list[i];
        b = list[i + 1];
        if (await compare(a, b) > 0) {
            pairs[a] = b;
            reversePairs[b] = a;
        }
        else {
            pairs[b] = a;
            reversePairs[a] = b;
        }
    }
    let S = [];
    for (a of Object.keys(pairs))
    {
        S.push(a);
    }
    S = await mergeInsertionSort(S);
    first = pairs[S[0]]; // get b to the first a
    S.splice(0, 0, first); // insert at beginning of array
    updatePercentComplete(S);
    let remaining = [];
    for (i = 2; i < S.length; i++) { // skip first two elements of s, they are paired
        remaining.push(pairs[S[i]]);
    }
    if (extra) {
        remaining.push(extra);
    }
    // partition into groups of jacobsthal size
    remainingGroups = []
    jacobsthalIndex = 0
    while (remaining.length > 0) {
        remainingGroups.push([]);
        activeGroup = remainingGroups[remainingGroups.length - 1];
        groupSize = jacobsthal[jacobsthalIndex];
        if (groupSize > remaining.length) {
            groupSize = remaining.length;
        }

        for (i = 0; i < groupSize; i++) {
            activeGroup.splice(0, 0, remaining.shift()); // takes first of remaining and adds it to beginning of group, to create reverse order
        }

        jacobsthalIndex++;
    }
    for (group of remainingGroups) {
        for (b of group) {
            if (b === extra) {
                indexToInsert = await binarySearch(S, b, 0, S.length - 1);
                S.splice(indexToInsert, 0, b);
            }
            else {
                bigSister = reversePairs[b];
                upperBound = S.indexOf(bigSister) - 1;
                indexToInsert = await binarySearch(S, b, 0, upperBound);
                S.splice(indexToInsert, 0, b);
            }
            updatePercentComplete(S);
        }
    }
    return S;
}

async function main() {
    $("#resultsBox").hide();
    $("#downloadResults").hide();
    $("#button1").hide();
    $("#button2").hide();
    $("#progressBar").hide();
    // get file
    $("#submit").click(getPastedText);
    fileText = await waitFileUpload();
    items = fileText.split(/\n|,|\t/);
    // clean items
    for (i in items) {
        items[i] = items[i].trim();
    }
    console.log(`Estimated number of comparisons = ${estimateNumComparisons(items.length)}`)
    $("#inputZone").hide();
    $("#button1").show();
    $("#button2").show();
    $("#progressBar").show();
    sortedList = await mergeInsertionSort(items);
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
    console.log(`You made ${numComparisons} total comparisons.`);
}

$(document).ready(main);