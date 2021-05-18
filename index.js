const http=require("http");
const fs=require('fs');

const path=require('path');
var requests=require("requests");
const homefile=fs.readFileSync(path.join(__dirname,"/home.html"),"utf-8");
const replaceval = (tempval,objdata)=>
{
    t=parseFloat(objdata.main.temp_min)-273.15;
    t=t.toPrecision(4);
    let temp=tempval.replace("{%tempmin%}",t.toString());
    t=parseFloat(objdata.main.temp_max)-273.15;
    t=t.toPrecision(4);
    temp=temp.replace("{%tempmax%}",t.toString());
    t=parseFloat(objdata.main.temp)-273.15;
    t=t.toPrecision(4);
    temp=temp.replace("{%temp%}",t.toString());
    temp=temp.replace("{%country%}",objdata.sys.country);
    temp=temp.replace("{%location%}",objdata.name);
    temp=temp.replace("{%tempstatus%}",objdata.weather[0].main);
    return temp;
}

const server=http.createServer((req,res) =>
{
    if(req.url=="/home.html" || req.url=="/"){
       requests("http://api.openweathermap.org/data/2.5/weather?q=DELHI&appid=5afb5d69516b16834373df5f9568805a")
       .on('data', function (chunk) {
           var objdata=JSON.parse(chunk); 
           const realtimedata=replaceval(homefile,objdata);
           res.write(realtimedata);
        })//data close
       .on('end', function (err) {
           if (err) return err;
           res.end();
        });//requestsclose
    }
    else if(req.url=="/WEATHER.CSS"){
        fs.readFile("WEATHER.CSS","utf-8",(err,data)=>
        {
            if(err) console.log(err);
            res.writeHead(200,{'Content-type':'text/css'});
            res.write(data);
            console.log(data);
            res.end();
        });
    }
});

server.listen(2000,"localhost",()=>
{
    console.log("listening to port no 2000")
});