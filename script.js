const arrayContainer = document.getElementById("arrayContainer");
let array = [];
let speed = 100; // Default speed
let isPaused = false;
let isSorting = false;
let sortingPromiseResolve;

// Generate random array and display it
function generateRandomArray(size) {
    array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 400) + 1); // Random number between 1 and 400
    }
    displayArray(array);
}

function displayArray(array) {
    arrayContainer.innerHTML = ""; // Clear previous bars
    array.forEach(value => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${value}px`;
        arrayContainer.appendChild(bar);
    });
}

document.getElementById("generateArray").addEventListener("click", () => {
    const size = document.getElementById("size").value;
    generateRandomArray(size);
});

document.getElementById("speed").addEventListener("input", (event) => {
    speed = 100 - event.target.value; // Invert speed control
});

// Helper function for swapping elements in array and UI
function swap(el1, el2) {
    let temp = el1.style.height;
    el1.style.height = el2.style.height;
    el2.style.height = temp;
}

// Delay for visualization
function sleep(ms) {
    return new Promise(resolve => {
        if (isPaused) {
            sortingPromiseResolve = resolve;
            return;
        }
        setTimeout(resolve, ms);
    });
}

// Pause functionality
document.getElementById("pause").addEventListener("click", () => {
    isPaused = true;
    document.getElementById("pause").disabled = true;
    document.getElementById("resume").disabled = false;
});

// Resume functionality
document.getElementById("resume").addEventListener("click", () => {
    isPaused = false;
    document.getElementById("pause").disabled = false;
    document.getElementById("resume").disabled = true;
    if (sortingPromiseResolve) sortingPromiseResolve();
});

// Bubble Sort
async function bubbleSort() {
    const bars = document.getElementsByClassName("bar");
    isSorting = true;
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            bars[j].classList.add("red");
            bars[j + 1].classList.add("red");
            if (array[j] > array[j + 1]) {
                swap(bars[j], bars[j + 1]);
                [array[j], array[j + 1]] = [array[j + 1], array[j]]; // Swap in array
            }
            await sleep(speed);
            bars[j].classList.remove("red");
            bars[j + 1].classList.remove("red");
        }
        bars[array.length - 1 - i].classList.add("green");
    }
    bars[0].classList.add("green");
    isSorting = false;
}

// Selection Sort
async function selectionSort() {
    const bars = document.getElementsByClassName("bar");
    isSorting = true;
    for (let i = 0; i < array.length; i++) {
        let minIndex = i;
        bars[minIndex].classList.add("red");
        for (let j = i + 1; j < array.length; j++) {
            bars[j].classList.add("red");
            if (array[j] < array[minIndex]) {
                bars[minIndex].classList.remove("red");
                minIndex = j;
                bars[minIndex].classList.add("red");
            }
            await sleep(speed);
            bars[j].classList.remove("red");
        }
        swap(bars[i], bars[minIndex]);
        [array[i], array[minIndex]] = [array[minIndex], array[i]];
        bars[i].classList.add("green");
    }
    isSorting = false;
}

// Insertion Sort
async function insertionSort() {
    const bars = document.getElementsByClassName("bar");
    isSorting = true;
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        bars[i].classList.add("red");
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            bars[j + 1].style.height = bars[j].style.height;
            j--;
            await sleep(speed);
        }
        array[j + 1] = key;
        bars[j + 1].style.height = `${key}px`;
        bars[i].classList.remove("red");
        bars[i].classList.add("green");
    }
    isSorting = false;
}

// Merge Sort
async function mergeSort(start = 0, end = array.length - 1) {
    if (start >= end) return;
    const mid = Math.floor((start + end) / 2);
    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);
    await merge(start, mid, end);
}

async function merge(start, mid, end) {
    const bars = document.getElementsByClassName("bar");
    let left = array.slice(start, mid + 1);
    let right = array.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            array[k] = left[i];
            bars[k].style.height = `${left[i]}px`;
            i++;
        } else {
            array[k] = right[j];
            bars[k].style.height = `${right[j]}px`;
            j++;
        }
        k++;
        await sleep(speed);
    }

    while (i < left.length) {
        array[k] = left[i];
        bars[k].style.height = `${left[i]}px`;
        i++;
        k++;
        await sleep(speed);
    }

    while (j < right.length) {
        array[k] = right[j];
        bars[k].style.height = `${right[j]}px`;
        j++;
        k++;
        await sleep(speed);
    }
}

// Quick Sort
async function quickSort(start = 0, end = array.length - 1) {
    if (start >= end) return;
    let index = await partition(start, end);
    await quickSort(start, index - 1);
    await quickSort(index + 1, end);
}

async function partition(start, end) {
    const bars = document.getElementsByClassName("bar");
    let pivot = array[end];
    let i = start - 1;
    bars[end].classList.add("red");

    for (let j = start; j < end; j++) {
        bars[j].classList.add("red");
        if (array[j] < pivot) {
            i++;
            swap(bars[i], bars[j]);
            [array[i], array[j]] = [array[j], array[i]];
        }
        await sleep(speed);
        bars[j].classList.remove("red");
    }

    swap(bars[i + 1], bars[end]);
    [array[i + 1], array[end]] = [array[end], array[i + 1]];
    bars[end].classList.remove("red");
    bars[i + 1].classList.add("green");
    return i + 1;
}

document.getElementById("sort").addEventListener("click", async () => {
    if (isSorting) return; // Prevent sorting if already sorting
    const selectedAlgorithm = document.getElementById("algorithm").value;
    if (selectedAlgorithm === "bubble") {
        await bubbleSort();
    } else if (selectedAlgorithm === "selection") {
        await selectionSort();
    } else if (selectedAlgorithm === "insertion") {
        await insertionSort();
    } else if (selectedAlgorithm === "merge") {
        await mergeSort();
    } else if (selectedAlgorithm === "quick") {
        await quickSort();
    }
});

document.getElementById("resume").addEventListener("click", () => {
    if (!isPaused) return;
    isPaused = false;
    document.getElementById("pause").disabled = false;
    document.getElementById("resume").disabled = true;
    if (sortingPromiseResolve) sortingPromiseResolve();
});

document.getElementById("pause").addEventListener("click", () => {
    isPaused = true;
    document.getElementById("pause").disabled = true;
    document.getElementById("resume").disabled = false;
});

// Initial Array
generateRandomArray(50);
