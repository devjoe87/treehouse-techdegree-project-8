let employees = [];
let dataIndex;
let currentCards = [];
let newDisplay = [];
let arrayIndex;
const urlAPI = 'https://randomuser.me/api/?results=12&nat=us'
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".close");
const search = document.getElementById('filter-search');
const modalPrev = document.querySelector(".previous");
const modalNext = document.querySelector(".next");
const cards = document.getElementsByClassName("card");


// FETCH EMPLOYEE DATA

fetch(urlAPI)
	.then(res => res.json())
	// .then(data => console.log(data))
	.then(res => res.results)
	.then(displayEmployees)
	.catch(err => console.log(err))

function displayEmployees(employeeData) {
	employees = employeeData;
	let employeeHTML = '';
	employees.forEach((employee, index) => {
		let name = employee.name;
		let email = employee.email;
		let city = employee.location.city;
		let picture = employee.picture;

		employeeHTML += `
			<div class="card" data-index="${index}">
				<img class="avatar" src="${picture.large}" />
				<div class="text-container">
					<h2 class="name">${name.first} ${name.last}</h2>
					<a class="email" href="mailto:${email}">${email}</a>
					<p class="address">${city}</p>
				</div>
			</div>
		`
	});
	gridContainer.innerHTML = employeeHTML;
}


function displayModal(index) {
	let { name, dob, phone, email, location: { city, street, state, postcode}, picture } = employees[index];
	let date = new Date(dob.date);
	const modalHTML = `
		<img class="avatar2" src="${picture.large}" />
		<div class="text-container">
			<h2 class="name">${name.first} ${name.last}</h2>
			<a class="email" href="mailto:${email}">${email}</a>
			<p class="address">${city}</p>
			<hr />
			<p class="phone">${phone}</p>
			<p class="address">${street.number } ${street.name}, ${state}, ${postcode}</p>
			<p>Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
		</div>
	`;
	overlay.classList.remove("hidden");
	modalContainer.innerHTML = modalHTML;
};

gridContainer.addEventListener('click', e => {
	if (e.target !== gridContainer) {
		let i = e.target.closest(".card").getAttribute('data-index');
		dataIndex = parseInt(i);
		displayModal(i);
	}
});




//TRAVERSE MODAL WINDOWS

function updateDisplay() {
	newDisplay = [];
		for (let i =0; i < currentCards.length; i++) {
			let currentIndex = currentCards[i].getAttribute('data-index');
			currentIndex = parseInt(currentIndex);
			newDisplay.push(currentIndex);
		}
		arrayIndex = newDisplay.indexOf(dataIndex);
};

//PREVIOUS MODAL

function previousModal() {
    updateDisplay();
    if (currentCards.length === 0 && dataIndex > 0) {
        dataIndex -= 1;
        displayModal(dataIndex);
    } else if (currentCards.length > 0 && arrayIndex <= newDisplay.length - 1 && arrayIndex !== 0) {
        dataIndex = newDisplay[arrayIndex - 1];
        displayModal(dataIndex);
    }
};

modalPrev.addEventListener('click', previousModal);


//NEXT MODAL

function nextModal() {
	updateDisplay();
	if (currentCards.length === 0 && dataIndex < 11) {
		dataIndex += 1;
		displayModal(dataIndex);
	} else if (currentCards.length > 0 && arrayIndex < newDisplay.length -1) {
		dataIndex = newDisplay[arrayIndex + 1];
		displayModal(dataIndex);
	}
};

modalNext.addEventListener('click', nextModal);


//CLOSE MODAL

modalClose.addEventListener('click', () => {
	overlay.classList.add("hidden");
});


//SEARCH FILTER

function filterSearch() {
    let searchVal = search.value;
    let cardsArray = [].slice.call(cards);
    currentCards = [];
    for (let i = 0; i < cardsArray.length; i++) {
        if (cardsArray[i].innerText.search(new RegExp(searchVal, "i")) < 0) {
            cardsArray[i].style.display = "none";
        } else {
            cardsArray[i].style.display = "";
        }
    };
    for (let i = 0; i < cardsArray.length; i++) {
        if (cardsArray[i].style.display === "") {
            currentCards.push(cardsArray[i]);
        }
    };
};

search.addEventListener('keyup', filterSearch);