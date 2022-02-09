// preloader
const loader = document.querySelector('.preloader');
window.addEventListener('load', () =>{
    loader.classList.add('hide');
})


class Car{
    constructor(brand, model, year){
        this.Brand = brand,
        this.Model = model,
        this.Year = year;
    }
}

// global elements
const table = document.querySelector('.car-list-table');
const clearBtn = document.querySelector('.clear-list');

class UI{
    // add car to UI function
    addCar(car){
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

    // clear input fields after car is added to list
    clearInput(){
        const inputs = document.querySelectorAll('input');
        inputs.forEach(function(input){
            input.value = "";
        })
    }

    // display error functions from events and validations
    showAlert(message,color){
        const error = document.querySelector('.error');
        error.classList.add(color);
        error.textContent = message

        // hide error after 1sec
        setTimeout(function(){
            error.classList.remove(color);
            error.textContent = "";
        }, 1000)
    }
}

// local storage functions
class storeToLS {
    // check local storage function
    static getLocalStorage(){
     return localStorage.getItem('Car list') ? JSON.parse(localStorage.getItem('Car list')) : [];
    }

     // add car item to local storage
    static addToLS(car){
        let cars = storeToLS.getLocalStorage();
        cars.push(car);

        localStorage.setItem('Car list', JSON.stringify(cars));
    } 

    // remove car item from local storage
    static deleteCarsFromLS(year){
        const cars = storeToLS.getLocalStorage();

        cars.forEach(function(car, index){
            if(car.Year == year){
                cars.splice(index, 1);
            }
        })
        
        localStorage.setItem('Car list', JSON.stringify(cars));
    }

    // keep car items in UI after reload
    static displayCars(){
        let cars = storeToLS.getLocalStorage();

        cars.forEach(function(car){
            let ui = new UI;

            ui.addCar(car);
        })
    }
}

window.addEventListener('DOMContentLoaded', storeToLS.displayCars);

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

        
        storeToLS.addToLS(car)
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

    const year = e.target.parentElement.previousElementSibling.textContent
    storeToLS.deleteCarsFromLS(year);
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

