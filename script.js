document.addEventListener('DOMContentLoaded', init);
//add click event listener on button
document.getElementById('more').addEventListener('click', showMoreDetail);
document.getElementById('save').addEventListener('click', saveSetting);
document.getElementById('setting').addEventListener('click', showSetting);

function init() {
    //fetch API to get a data from server
    fetch('https://api.nasa.gov/planetary/apod?api_key=GuhO08EEhjaengh7mFqqYoqGvGwfEPLelz8eXWJ7')
    .then(res => res.json())
    .then(data => {
        document.body.style.backgroundImage = `url(${data.url})`;
        document.body.style.backgroundRepeat = 'no-repeat';
        document.body.style.backgroundSize = 'cover';
       
        //get date, hours, minutes and seconds and store them into variable.
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        hours < 10 ? hours = '0' + date.getHours() : hours = date.getHours();
        minutes < 10 ? minutes = '0' + date.getMinutes() : minutes = date.getMinutes();
        seconds < 10 ? seconds = '0' + date.getSeconds() : seconds = date.getSeconds();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        let status = document.getElementById('status'); 
        if(hours >= 6 && hours < 12) {
            status.innerHTML = "Good Morning";
        } else if(hours >= 12 && hours < 16) {
            status.innerHTML = "Good Afternoon";
        } else if(hours >= 16 && hours < 20) {
            status.innerHTML = "Good Evening";
        } else {
            status.innerHTML = "Good Night";
        }
        //get settings from local storage
        let getItem = JSON.parse(window.localStorage.getItem('setting'));
        let date_format = getItem.date_format;
        let second_value = getItem.second_value;
        //set a value to setting as per local storage
        document.querySelector(`input[type='radio'][name='clock'][value=${date_format}]`).checked = true;
        document.querySelector(`input[type='radio'][name='second'][value=${second_value}]`).checked = true;

        let currentDate = document.getElementById('date');
        let currentTime = document.getElementById('currentTime');
        //display current date and time according to setting
        currentDate.innerHTML = `${data.date}`;
        if(date_format == 'Yes' && second_value == 'Yes') {
            currentTime.innerHTML = `${hours}:${minutes}:${seconds} ${ampm}`;
        } else if(date_format == 'Yes' && second_value == 'No') {
            currentTime.innerHTML = `${hours}:${minutes} ${ampm}`;
        } else if(date_format == 'No' && second_value == 'Yes') {
            currentTime.innerHTML = `${hours % 12}:${minutes}:${seconds} ${ampm}`;
        } else {
            currentTime.innerHTML = `${hours % 12}:${minutes} ${ampm}`;
        }
    })
    .catch(error => {
        console.log(error);
    })
}
//functio to show more details like day of the week, month, year and week of the year
function showMoreDetail() {
    let newDate = new Date();
    let weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let dayOfWeek = weekday[newDate.getDay()];
    let dayOfMonth = newDate.getDate();
    let dayOfYear = Math.floor((newDate - new Date(newDate.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    let numberOfTheDay = Math.floor((newDate - new Date(newDate.getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000));
    let weekOfYear = Math.ceil((newDate.getDay() + 1 + numberOfTheDay) / 7);
    document.getElementById('dayOfWeek').innerHTML = `${dayOfWeek}`;
    document.getElementById('dayOfMonth').innerHTML = `${dayOfMonth}`;
    document.getElementById('dayOfYear').innerHTML = `${dayOfYear}`;
    document.getElementById('weekOfYear').innerHTML = `${weekOfYear}`;
    //button click event toggle to show more or hide details
    if(document.getElementById('more').innerHTML == 'More') {
        document.getElementById('more').innerHTML = 'Less';
        document.getElementById('moreDetail').classList.remove('detail');
        document.getElementById('moreDetail').classList.add('active');
    } else if(document.getElementById('more').innerHTML == 'Less') {
        document.getElementById('more').innerHTML = 'More';
        document.getElementById('moreDetail').classList.remove('active');
        document.getElementById('moreDetail').classList.add('detail');
    }
}
//function to show or hide setting
function showSetting() {
    if(document.getElementById('setting').innerHTML == 'Setting') { 
        document.getElementById('setting').innerHTML = 'Hide';
        document.getElementById('settingDiv').classList.remove('setting');
        document.getElementById('settingDiv').classList.add('active');
    } else if(document.getElementById('setting').innerHTML == 'Hide') {
        document.getElementById('setting').innerHTML = 'Setting';
        document.getElementById('settingDiv').classList.remove('active');
        document.getElementById('settingDiv').classList.add('setting');
    }
}
//function to call on save setting button
function saveSetting() {
    //get date, hours, minutes and seconds
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    hours < 10 ? hours = '0' + date.getHours() : hours = date.getHours();
    minutes < 10 ? minutes = '0' + date.getMinutes() : minutes = date.getMinutes();
    seconds < 10 ? seconds = '0' + date.getSeconds() : seconds = date.getSeconds();
    let ampm = hours >= 12 ? 'pm' : 'am';
    //get a value from setting we saved on setting button
    let date_format = document.querySelector("input[type='radio'][name='clock']:checked").value;
    let second_value = document.querySelector("input[type='radio'][name='second']:checked").value;
    let setItem;

    //display current time according to setting we saved
    let currentTime = document.getElementById('currentTime');
    if(date_format == 'Yes' && second_value == 'Yes') {
        setItem =  {date_format : 'Yes', second_value : 'Yes'}; 
        //set a item to local storage
        window.localStorage.setItem('setting', JSON.stringify(setItem));
        currentTime.innerHTML = `${hours}:${minutes}:${seconds} ${ampm}`;
    } else if(date_format == 'Yes' && second_value == 'No') {
        setItem =  {date_format : 'Yes', second_value : 'No'}; 
        //set a item to local storage
        window.localStorage.setItem('setting', JSON.stringify(setItem));
        currentTime.innerHTML = `${hours}:${minutes} ${ampm}`;
    } else if(date_format == 'No' && second_value == 'Yes') {
        setItem =  {date_format : 'No', second_value : 'Yes'}; 
        //set a item to local storage
        window.localStorage.setItem('setting', JSON.stringify(setItem));
        currentTime.innerHTML = `${hours % 12}:${minutes}:${seconds} ${ampm}`;
    } else {
        setItem =  {date_format : 'No', second_value : 'No'}; 
        //set a item to local storage
        window.localStorage.setItem('setting', JSON.stringify(setItem));
        currentTime.innerHTML = `${hours % 12}:${minutes} ${ampm}`;
    }
}   

