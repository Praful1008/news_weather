let date = new Date().toDateString();
let time = new Date().toTimeString().substring(0, 17);


document.getElementsByClassName("date_time")[0].innerHTML = `${date} <br/> ${time}`;


function changeBox(e){
    if(e.value=='lat_long')
    {
        document.getElementById('cityName').style.display = 'none';
        document.getElementById('cityName').value = "";
        document.getElementsByClassName('lat_long')[0].style.display = 'inline-block';
    }
    else{
        document.getElementsByClassName('lat_long')[0].style.display = 'none';
        document.getElementById('cityName').style.display = 'inline-block';
        document.getElementById('lat').value = '';
        document.getElementById('long').value = '';
    }
}

function removeError(){
    document.getElementById('errormsg').style.display = "none";
}

document.getElementById('cityName').addEventListener('input',disableButton);
document.getElementById('lat').addEventListener('input',disableButton);
document.getElementById('long').addEventListener('input',disableButton);

function disableButton(){
    let city = document.getElementById('cityName');
    let lat = document.getElementById('lat');
    let long = document.getElementById('long');
    if(city.value==='' && (lat.value === '' || long.value === ''))
    {
        document.getElementById('search-btn').disabled = true;
    }
    else
    {
        document.getElementById('search-btn').disabled = false;
    }
}