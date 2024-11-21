let dataArray = [];
let numElements = 50;
let selectedAlgo;
let audioCtx = null;
let timeoutId = null;
let isplaying = false;

init();

function init() {
  document.getElementById("numElements").addEventListener("input", (e) => {
    numElements = e.target.value;
    generateData();
    drawBars();
    getSelectedAlgo();
  });
  generateData();
  drawBars();
  getSelectedAlgo();
}

function playPauseToggle() {
  if (isplaying) {
    pause();
  } else {
    play();
  }
}

function play() {
  isplaying = true;
  const copy = [...dataArray]; //paste the copy of the array
  moves = sortingAlgo(copy, selectedAlgo);
  animate(moves);
  isplaying = false;
}

function pause() {
  clearTimeout(timeoutId);
}

function getSelectedAlgo() {
  document.addEventListener("DOMContentLoaded", function () {
    const sortingButtons = document.querySelectorAll(".sorting");
    console.log(sortingButtons);
    selectedAlgo = "bubblesort";

    sortingButtons.forEach((button) => {
      button.addEventListener("click", function () {
        sortingButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");
        selectedAlgo = this.id;
        console.log("Selected Algorithm:", selectedAlgo);
      });
    });
  });
}

function generateData() {
  dataArray = Array.from({ length: numElements }, () => Math.random() * 100);
}

function drawBars(move) {
  container.innerHTML = "";
  for (i = 0; i < dataArray.length; i++) {
    const bar = document.createElement("div");
    bar.style.height = dataArray[i] + "%";
    bar.classList.add("bar");
    container.appendChild(bar);

    if (move && move.indices.includes(i)) {
      bar.style.backgroundColor = move.type == "swap" ? "red" : "blue";
      container.appendChild(bar);
    }
  }
}

function animate(moves) {
  if (moves.length == 0) {
    drawBars(); //show the final sorted array w/o any red bars
    return;
  }
  const move = moves.shift(); //moves.shift() removes the first element from the array and returns it
  const [i, j] = move.indices;
  if (move.type == "swap") {
    [dataArray[i], dataArray[j]] = [dataArray[j], dataArray[i]];
  }

  playNote(200 + dataArray[i] * 500);
  playNote(200 + dataArray[j] * 500);
  drawBars(move);
  let timeoutId = setTimeout(() => {
    animate(moves);
  }, 0.1); //0.1ms delay
}

//chossing one algorithm from the nav-bar
function sortingAlgo(array, selectedAlgo) {
  if (selectedAlgo == null) {
    console.error("No algorithm selected");
  }
  switch (selectedAlgo) {
    case "bubbleSort":
      return bubbleSort(array);
    case "mergeSort":
      return mergeSort(array);
    case "quickSort":
      return quickSort(array);
    case "heapSort":
      return heapSort(array);
    case "insertionSort":
      return insertionSort(array);
    case "selectionSort":
      return selectionSort(array);
  }
}

function bubbleSort(array) {
  console.log("being runned");
  const moves = [];
  do {
    var swapper = false;
    for (let i = 0; i < array.length - 1; i++) {
      //moves.push({ indices: [i, i + 1], type: "comp" });
      if (array[i] > array[i + 1]) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        moves.push({ indices: [i, i + 1], type: "swap" }); //keeps track of all the moves
        swapper = true;
      }
    }
  } while (swapper);
  console.log(moves);
  return moves;
}

function insertionSort(array) {
  const moves = [];
  for (let i = 1; i < array.length; i++) {
    let j = i;
    while (j > 0 && array[j - 1] > array[j]) {
      [array[j], array[j - 1]] = [array[j - 1], array[j]];
      moves.push({ indices: [j, j - 1], type: "swap" });
      j--;
    }
  }
  return moves;
}

function selectionSort(array) {
  const moves = [];
  for (let i = 0; i < array.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    [array[i], array[minIndex]] = [array[minIndex], array[i]];
    moves.push({ indices: [i, minIndex], type: "swap" });
  }
  return moves;
}

function mergeSort(array) {
  if (array.length <= 1) return [];

  const moves = [];
  const auxArray = array.slice();
  mergeSortHelper(array, 0, array.length - 1, auxArray, moves);
  return moves;
}

function mergeSortHelper(mainArray, startIdx, endIdx, auxArray, moves) {
  if (startIdx === endIdx) return;
  const middleIdx = Math.floor((startIdx + endIdx) / 2);
  mergeSortHelper(auxArray, startIdx, middleIdx, mainArray, moves);
  mergeSortHelper(auxArray, middleIdx + 1, endIdx, mainArray, moves);
  doMerge(mainArray, startIdx, middleIdx, endIdx, auxArray, moves);
}

function doMerge(mainArray, startIdx, middleIdx, endIdx, auxArray, moves) {
  let k = startIdx,
    i = startIdx,
    j = middleIdx + 1;
  while (i <= middleIdx && j <= endIdx) {
    if (auxArray[i] <= auxArray[j]) {
      moves.push({ indices: [k, i], type: "overwrite" });
      mainArray[k++] = auxArray[i++];
    } else {
      moves.push({ indices: [k, j], type: "overwrite" });
      mainArray[k++] = auxArray[j++];
    }
  }
  while (i <= middleIdx) {
    moves.push({ indices: [k, i], type: "overwrite" });
    mainArray[k++] = auxArray[i++];
  }
  while (j <= endIdx) {
    moves.push({ indices: [k, j], type: "overwrite" });
    mainArray[k++] = auxArray[j++];
  }
}
function quickSort(array) {
  const moves = [];
  quickSortHelper(array, 0, array.length - 1, moves);
  return moves;
}

function quickSortHelper(array, low, high, moves) {
  if (low < high) {
    const pivotIndex = partition(array, low, high, moves);
    quickSortHelper(array, low, pivotIndex - 1, moves);
    quickSortHelper(array, pivotIndex + 1, high, moves);
  }
}

function partition(array, low, high, moves) {
  const pivot = array[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
      moves.push({ indices: [i, j], type: "swap" });
    }
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  moves.push({ indices: [i + 1, high], type: "swap" });
  return i + 1;
}

function playNote(freq) {
  if (audioCtx == null) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  const dur = 0.01; //because of delay of the animation
  const osc = audioCtx.createOscillator(); //oscillator is a sound wave generator
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
  const node = audioCtx.createGain();
  node.gain.value = 0.1;
  node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
  osc.connect(node);
  node.connect(audioCtx.destination);
}

/*

let rangeElem = querySelector("type=range");
const n = rangeElem.max / 2;
const array = [];
let isplaying = false;

init(); //everytime we refresh the page, we get a new array of random numbers

let audioCtx = null;

let navLinks = document.querySelectorAll("header navbar a");
function addActive(id) {
  navLinks.forEach((link) => link.classList.remove("currentAlgorithmButton"));
  document
    .querySelector("header nav a" + id)
    .classList.add("currentAlgorithmButton");
}

const algorithmComplexity = {
  bubbleSort: {
    name: "Bubble sort",
    averageComplexity: "O(n^2)",
    bestCase: "O(n)",
    worstCase: "O(n^2)",
    spaceComplexity: "O(1)",
  },
  insertionSort: {
    name: "Insertion sort",
    averageComplexity: ".",
    bestCase: ".",
    worstCase: ".",
    spaceComplexity: ".",
  },
};

function playNote(freq) {
  if (audioCtx == null) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  const dur = 0.01; //because of delay of the animation
  const osc = audioCtx.createOscillator(); //oscillator is a sound wave generator
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
  const node = audioCtx.createGain();
  node.gain.value = 0.1;
  node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
  osc.connect(node);
  node.connect(audioCtx.destination);
}

function init() {
  for (let i = 0; i < n; i++) {
    array[i] = Math.random();
  }
  showBars();
}

function selectAlgo(algorithm) {
  const selectedAlgo = algorithm;
  document.getElementById("algoName").textContent =
    algorithmComplexity.bubbleSort.name;
  document.getElementById("averageComplexity").textContent =
    algorithmComplexity.bubbleSort.averageComplexity;
}

function sortingAlgo(array, selectedAlgo) {
  switch (selectedAlgo) {
    case "bubbleSort":
      bubbleSort(array);
      break;
    case "mergeSort":
      mergeSort(array);
      break;
    case "quickSort":
      quickSort(array);
      break;
    case "heapSort":
      heapSort(array);
      break;
    case "insertionSort":
      insertionSort(array);
      break;
    case "selectionSort":
      selectionSort(array);
      break;
  }
}

function playPauseToggle() {
  if (isplaying) {
    pause();
  } else {
    play();
    isplaying = true;
  }
}

function play() {
  const copy = [...array]; //creat a new array and paste the copy of the array
  moves = sortingAlgo(copy, selectedAlgo);
  animate(moves);
}

function pause() {
  clearTimeout(timeoutId);
}

function animate(moves) {
  if (moves.length == 0) {
    showBars(); //show the final sorted array w/o any red bars
    return;
  }
  const move = moves.shift(); //moves.shift() removes the first element from the array and returns it
  const [i, j] = move.indices;
  if (move.type == "swap") {
    [array[i], array[j]] = [array[j], array[i]];
  }

  playNote(200 + array[i] * 500);
  playNote(200 + array[j] * 500);
  showBars(move);
  let timeoutId = setTimeout(() => {
    animate(moves);
  }, 10); //10ms delay
}

function bubbleSort(array) {
  const moves = [];
  do {
    var swapper = false;
    for (let i = 0; i < array.length - 1; i++) {
      // moves.push({ indices: [i, i + 1], type: "comp" });
      if (array[i] > array[i + 1]) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        moves.push({ indices: [i, i + 1], type: "swap" }); //keeps track of all the moves
        swapper = true;
      }
    }
  } while (swapper);
  return moves;
}

function showBars(move) {
  container.innerHTML = ""; //empty the container everytime we play
  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement("div");
    bar.style.height = array[i] * 100 + "%";
    bar.classList.add("bar");
    container.appendChild(bar);

    if (move && move.indices.includes(i)) {
      bar.style.backgroundColor = move.type == "swap" ? "red" : "blue";
      container.appendChild(bar);
    }
  }
}
*/
