const wrapper = document.querySelector(".wrapper"),
inputPart= document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon =weatherPart.querySelector("img"),
arrowBack =wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup",e =>{
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    else{
        alert("Your browser not support geolocation api");
    }
});
const apiKey="565e360e2d69a5839b39a84377ae23ab";
function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onSuccess(position){
    const {latitude, longitude} = position.coords;
    //api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}$lon=${longitude}&units=metric&appid=${apiKey}`;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=565e360e2d69a5839b39a84377ae23ab`;
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData(){
    infoTxt.innerText = "Getting weater details...";
    infoTxt.classList.add("pending");
    fetch(api).then(response => response.json()).then(result => weatherDetails(result)).catch(() =>{
        infoTxt.innerText = "Somthing went wrong";
        infoTxt.classList.replace("pending", "error");
    });
}

function weatherDetails(info){
    infoTxt.classList.replace("pending", "error");
    if(info.cod =="404"){
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;

        if(id == 800){
            wIcon.src="image/clear.svg";
        }else if(id>=200 && id <=232){
            wIcon.src="image/storm.svg";
        }else if(id>=600 && id <=622){
            wIcon.src="image/snow.svg";
        }else if(id>=701 && id <=781){
            wIcon.src="image/haze.svg";
        }else if(id>=801 && id <=804){
            wIcon.src="image/cloud.svg";
        }else if((id>=500 && id <=531) || (id >=300 && id <= 321)){
            wIcon.src="image/rain.svg";
        }
        
        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click",()=>{
    wrapper.classList.remove("active");
});