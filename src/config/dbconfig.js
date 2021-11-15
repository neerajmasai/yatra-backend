
//server host name
const HOST = "localhost";

//remote database name
const DATABASE = "yatra";

//database credentials
const USERNAME = "yatra-clone";
const PASSWORD = "yatraclone123";

//default app port
const PORT = 2345;

//default connection url
const DEFAULT_CONNECTION_STRING = `mongodb+srv://${USERNAME}:${PASSWORD}@yatra-clone.xrxnv.mongodb.net/${DATABASE}`; 

/* 
//default connection url
const DEFAULT_CONNECTION_STRING = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.cindx.mongodb.net/${DATABASE}?retryWrites=true&w=majority`; 
*/
//mongoose options for connection
const MONGOOSE_OPTIONS = {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology:true,
    useNewUrlParser:true
}

//API Key

//Skyscanner
SKYSCANNER_API_HOST = "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com";
SKYSCANNER_API_KEY = "f22b1b7357msh0918fb2bed2daa1p134ab7jsncea97391ca1a";

//Trip Advisor
TRIPADVISOR_API_HOST = "travel-advisor.p.rapidapi.com";
TRIPADVISOR_API_KEY = "f22b1b7357msh0918fb2bed2daa1p134ab7jsncea97391ca1a";

module.exports = {HOST, PORT, DATABASE, USERNAME, PASSWORD, DEFAULT_CONNECTION_STRING, MONGOOSE_OPTIONS, SKYSCANNER_API_HOST, SKYSCANNER_API_KEY, TRIPADVISOR_API_HOST, TRIPADVISOR_API_KEY}