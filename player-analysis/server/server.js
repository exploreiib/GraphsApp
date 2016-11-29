require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');

app.set('view engine', 'ejs');
//app.set('views', __dirname + '/views');
app.set('views','../views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));

// routes
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/users.controller'));
app.use( express.static( "../app/assets" ) );

var jsonfile = require('jsonfile');	
var XLSX = require('xlsx');
var async = require('async');
var directory = 'customer_model_data/';
var xlFileList = ['days_since_last_activity.csv.xlsx','days_since_reg.csv.xlsx',
'life_cycle.csv.xlsx','micro_seg.csv.xlsx','player_activity.csv.xlsx',
'product_preferences.csv.xlsx','valueseg.csv.xlsx','effective_campaigns.csv.xlsx',
'live_customers_trend.csv.xlsx','custom_kpi_data.csv.xlsx',
'model_based_kpi_data.csv.xlsx','predicted_future_value.csv.xlsx','Revenue_Casino.csv.xlsx',
'Revenue_Sport.csv.xlsx','Net_Cash.csv.xlsx','per_Customer.csv.xlsx','Total_deposits.csv.xlsx',
'New_Depositors.csv.xlsx','who_deposited.csv.xlsx','casino_bet.csv.xlsx','sport_bet.csv.xlsx'];
//var xlFileList = ['days_since_reg.csv.xlsx','life_cycle.csv.xlsx']

for (index=0;index < xlFileList.length; index++){
    console.log("XL File name ==>"+xlFileList[index]);
var workbook = XLSX.readFile(directory + xlFileList[index]);
var sheet_name_list = workbook.SheetNames;
sheet_name_list.forEach(function(y) {
    var worksheet = workbook.Sheets[y];
    var headers = {};
    var data = [];
    for(z in worksheet) {
        if(z[0] === '!') continue;
        //parse out the column, row, and value
        var col = z.substring(0,1);
        var row = parseInt(z.substring(1));
        var value = worksheet[z].v;

        //store header names
        if(row == 1) {
            headers[col] = value;
            continue;
        }

        if(!data[row]) data[row]={};
        data[row][headers[col]] = value;
    }
    //drop those first two rows which are empty
    data.shift();
    data.shift();
	var finalData = {[xlFileList[index].slice(0,-9)]:data};
    console.log(finalData);
	
	
	var file = directory + xlFileList[index].slice(0,-9) + '.json';
    jsonfile.writeFile(file, finalData, function (err) {
    console.error(err);
})	
});

}

var files = [ directory +'days_since_reg.json', directory +'life_cycle.json',directory+'days_since_last_activity.json',
directory+'micro_seg.json',directory+'player_activity.json',directory+'product_preferences.json',
directory+'valueseg.json',directory+'effective_campaigns.json',directory+'live_customers_trend.json',
directory+'custom_kpi_data.json',directory+'model_based_kpi_data.json',directory+'predicted_future_value.json',
directory+'Revenue_Casino.json',directory+'Revenue_Sport.json',directory+'Net_Cash.json',directory+'per_Customer.json',
directory+'Total_deposits.json',directory+'New_Depositors.json',directory+'who_deposited.json',directory+'casino_bet.json',
directory+'sport_bet.json'];


function readAsync(file, callback) {
    jsonfile.readFile(file,callback);
}

	
	app.get('/getfiles', function(req, res) {
		
		async.map(files, readAsync, function(err, results) {
					console.log(results.length);

		var merged = {};
		for(var resultIndex=0; resultIndex < results.length; resultIndex++){
		 
            for(key in results[resultIndex])
               merged[key] = results[resultIndex][key];
		}
		res.json(merged);
			
});	

	});



// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});

// start server
var server = app.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});