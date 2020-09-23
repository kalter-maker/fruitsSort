const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
{"kind": "Карамбола", "color": "желтый", "weight": 28},
{"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;



// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
    // TODO: очищаем fruitsList от вложенных элементов,
    // чтобы заполнить актуальными данными из fruits
    document.querySelector("ul.fruits__list").innerHTML = '';

    for (let i = 0; i < fruits.length; i++) {
        // TODO: формируем новый элемент <li> при помощи document.createElement,
        let newLi = document.createElement("li"),
            newDiv = document.createElement("div"),
            newIndex = document.createElement("div"),
            newKind = document.createElement("div"),
            newColor = document.createElement("div"),
            newWeight = document.createElement("div"),
            backgroundFrameColor;

        switch ((i + 1) % 5) {
            case 1:
                backgroundFrameColor = "fruit_violet";
                break;
            case 2:
                backgroundFrameColor = "fruit_green";
                break;
            case 3:
                backgroundFrameColor = "fruit_carmazin";
                break;
            case 4:
                backgroundFrameColor = "fruit_yellow";
                break;
            case 0:
                backgroundFrameColor = "fruit_lightbrown";
                break;
            default:
                break;
        }
        newLi.classList.add('fruit__item', backgroundFrameColor);
        newDiv.classList.add('fruit__info');

        newLi.appendChild(newDiv);
        newDiv.appendChild(newIndex);
        newDiv.appendChild(newKind);
        newDiv.appendChild(newColor);
        newDiv.appendChild(newWeight);

        newIndex.appendChild(document.createTextNode("index: " + i));
        newKind.appendChild(document.createTextNode("kind: " + fruits[i]["kind"]));
        newColor.appendChild(document.createTextNode("color: " + fruits[i]["color"]));
        newWeight.appendChild(document.createTextNode("weight (кг): " + fruits[i]["weight"]));

        // и добавляем в конец списка fruitsList при помощи document.appendChild
        document.querySelector("ul.fruits__list").appendChild(newLi);


    }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
    let result = [],
        origFruits = fruits.slice(),
        areEqual = true;
    while (fruits.length > 0) {
        let randomIndex = getRandomInt(0, fruits.length - 1),
            arr = fruits.splice(randomIndex, 1);

        result.unshift(arr[0]);
    }
    fruits = result;
    for (let i = 0; i < fruits.length; i++) {
        if (fruits[i]["kind"] !== origFruits[i]["kind"] || fruits[i]["color"] !== origFruits[i]["color"] || fruits[i]["weight"] !== origFruits[i]["weight"]) areEqual = false;
    }
    if (areEqual) alert("порядок не изменился");
};

shuffleButton.addEventListener('click', () => {
    shuffleFruits();
    display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
    let result = fruits.filter((item) => {
        let min = document.querySelector(".minweight__input").value,
            max = document.querySelector(".maxweight__input").value;

        return item.weight >= min && item.weight <= max;
    });
    fruits = result.slice();
};

filterButton.addEventListener('click', () => {
    filterFruits();
    display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
    // TODO: допишите функцию сравнения двух элементов по цвету
    const priority = ['розово-красный', 'красный', 'оранжевый', 'желтый', 'зеленый', 'синий', 'фиолетовый', 'светло-коричневый'];
    return priority.indexOf(a) > priority.indexOf(b);
};

const sortAPI = {
    bubbleSort(arr, comparation) {
        for (let i = 0; i < arr.length - 1; ++i) {
            for (let j = 0; j < arr.length - 1 - i; ++j) {
                if (comparation(arr[j].color, arr[j + 1].color)) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                }
            }
        }
    },

    quickSort(arr, comparation) {
        function partition(left, right) {
            var pivot = arr[Math.floor((right + left) / 2)],
                i = left,
                j = right;
            while (i <= j) {
                while (comparation(pivot.color, arr[i].color)) {
                    i++;
                }
                while (comparation(arr[j].color, pivot.color)) {
                    j--;
                }
                if (i <= j) {
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    i++;
                    j--;
                }
            }
            return i;
        }

        function startQuickSort(left, right) {
            var index;

            if (arr.length > 1) {
                index = partition(left, right);
                if (left < index - 1) {
                    startQuickSort(left, index - 1);
                }
                if (index < right) {
                    startQuickSort(index, right);
                }
            }
            return arr;
        }

        startQuickSort(0, arr.length - 1);
    },

    // выполняет сортировку и производит замер времени
    startSort(sort, arr, comparation) {
        const start = new Date().getTime();
        sort(arr, comparation);
        const end = new Date().getTime();
        sortTime = `${end - start} ms`;
        sortTimeLabel.innerText = sortTime;
    },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
    // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
    if (sortKind === 'bubbleSort') sortKind = 'quickSort';
    else sortKind = 'bubbleSort';
    sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
    // TODO: вывести в sortTimeLabel значение 'sorting...'
    const sort = sortAPI[sortKind];
    sortAPI.startSort(sort, fruits, comparationColor);
    display();
    // TODO: вывести в sortTimeLabel значение sortTime
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
    // TODO: создание и добавление нового фрукта в массив fruits
    // необходимые значения берем из kindInput, colorInput, weightInput
    if (!kindInput.value || !colorInput.value || !weightInput.value) alert('одно из введенных полей пустое');
    else {
        fruits.push({ "kind": kindInput.value, "color": colorInput.value, "weight": weightInput.value });
        // и добавляем в конец списка fruitsList при помощи document.appendChild
        // document.querySelector("ul.fruits__list").appendChild(newLi);
    }
    display();
});