const fs = require("fs");
const http = require("http");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

// so here we make a replaceval function by this we dont have to call replaceval function by that we dont have to read that data and write and change that data again and again so i declared that function here and it will call one time and do all the jobs in one time.

const replaceval = (tempval, orgVal) => {
    let temperature = tempval.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempStatus%}", orgVal.weather[0].main);
    return temperature;
};

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?lat=26.922070&lon=75.778885&appid=f31f04fdff10606a237a007d58219750")
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk); // Here we converting json data to object data.
                const arrData = [objData];  // Here we converting object data into array data.
                // console.log(arrData[0].main.temp);

                //when there is multiple array f an object then we can handle those object with map method.
                const realTimeData = arrData.map((val) =>
                //now we have to call a function here and we give name of that funciton is "replaceval" and in which we have to give two argument in which first one is htmlfile variable name and second one is variable of data name. and by this we replace data of html data with real time api data. so that we can get real time temperature,location,countryname and min & max temperature.
                    replaceval(homeFile, val)).join("");  // Here .join is used to convert to array data into string data.
                res.write(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    };
});

server.listen(8000, "127.0.0.1", () => {
    console.log("listening on port 8000")
});