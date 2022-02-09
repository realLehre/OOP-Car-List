// preloader
const loader = document.querySelector('.preloader');
window.addEventListener('load', () =>{
    loader.classList.add('hide');
})

// book constructor
function Car(brand, model, year){
    this.Brand = brand.toUpperCase(),
    this.Model = model,
    this.Year = year;
}

// UI constructor
function UI(){}

// global elements
const table = document.querySelector('.car-list-table');
const clearBtn = document.querySelector('.clear-list');

// UI prototypes
UI.prototype.addCar = function(car){
    const row = document.createElement('tr');
    row.classList.add('car-details');
    row.innerHTML = `<td>${car.Brand}</td>
          <td>${car.Model}</td>
          <td>${car.Year}</td>
          <td class = "delete"><i class="fa fa-trash" aria-hidden="true"></i></td>`

    const deleteBtn = row.querySelector('.delete');
    deleteBtn.addEventListener('click', removeCar)
    table.appendChild(row);
   
    clearBtn.addEventListener('click', clearList);


    if(table.childElementCount >= 1){
        clearBtn.classList.add('show');
    } else {
        clearBtn.classList.remove('show');
    }
}

UI.prototype.showAlert = function(message, color){
    const error = document.querySelector('.error');
    error.classList.add(color);
    error.textContent = message

    setTimeout(function(){
        error.classList.remove(color);
        error.textContent = "";
    }, 1000)
}

UI.prototype.clearInput = function(){
    const inputs = document.querySelectorAll('input');
    inputs.forEach(function(input){
        input.value = "";
    })
}

UI.prototype.addToLS = function(car){
    let cars = getLocalStorage();
    cars.push(car);
    localStorage.setItem('Car list', JSON.stringify(cars));
}

UI.prototype.deleteCarsFromLs = function(year){
    const cars = getLocalStorage();

    cars.forEach(function(car, index){
        if(car.Year == year){
            cars.splice(index, 1);
        }
      
    })

    localStorage.setItem('Car list', JSON.stringify(cars));
}

// display UI elements on reload
function displayCars(){
    let cars = getLocalStorage();

    cars.forEach(function(car){
        let ui = new UI;

        ui.addCar(car);
    })
}
window.addEventListener('DOMContentLoaded', displayCars);

// get local storage function
function getLocalStorage(){
     return localStorage.getItem('Car list') ? JSON.parse(localStorage.getItem('Car list')) : [];
}

// add items to UI event plus form validations
const form = document.querySelector('.form');
form.addEventListener('submit', (e) =>{
  
    // declare input fields
    const brand = document.querySelector('#brand').value,
          model = document.querySelector('#model').value,  
          year = document.querySelector('#year').value;

    if (!brand || !model || !year ){
        const ui = new UI;
        ui.showAlert('Fields can not be empty', 'danger');
    } else {
        // instantiate new car
        let car = new Car(brand, model, year);

        // instantiate new UI
        const ui = new UI;
        ui.addCar(car);
        ui.clearInput();
        ui.addToLS(car)
        ui.showAlert('car added to list', 'success');
    }

    e.preventDefault()
})

// remove car from car list
function removeCar(e){
    const target =  e.target.parentElement.parentElement;
    table.removeChild(target);

    if(table.children.length <= 1){
        clearBtn.classList.remove('show');
    }

    console.log(table.children.length);

    const ui = new UI;

    ui.showAlert('car removed', 'danger');

    const Year = e.target.parentElement.previousElementSibling.textContent
    ui.deleteCarsFromLs(Year);
}

// clear car list
function clearList(e){
    const carList = document.querySelectorAll('.car-details');
    while (table.firstElementChild.nextElementSibling){
        table.removeChild(table.firstElementChild.nextElementSibling);  
    }
    
    e.target.classList.remove('show');
    localStorage.clear();
    const ui = new UI
    ui.showAlert('car list cleared', 'danger');
}





