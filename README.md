# Helsinki City Bikes
A web page showing city bike trips in the Helsinki Capital area.
</br></br>
My work is based on Solita's [Dev Academy pre-assignment](https://github.com/solita/dev-academy-2023-exercise).
Browse the site: [HCB - Helsinki City Bikes](https://hsl-ui.netlify.app)

![hsl](https://user-images.githubusercontent.com/89244648/235082404-1aaad47d-dd20-4eeb-a4e8-02183f4103f8.png)
## Main features
### 1. <ins>Front-end</ins>

   * ### Home page
      - Displays stations markers clustered on the map. Clusters show the numbers of markers contained.
   - ### Journeys
      - Lists journeys in a paginated table, with a default of 10 journeys/page. Other options are: 25, 50, 100 journeys/page out of total: 5000.
      - Each journey shows departure and return stations, covered distance in kilometers and duration in minutes.
      - Searching is implemented and it is filtering and displaying journeys by departure station name.
      - Journeys can be ordered alphabetically by departure station name.
   - ### Stations  
      - Lists stations in a paginated table, with a default of 10 stations/page. Other options are: 25, 50, 100 stations/page.
      - Each stations shows station name, address, city and operator (where applicable), capacity and coordinates.
      - Seaching is implemented, filtering and displaying station by station name.
      - Stations can be ordered alphabetically by station name.
   - ### Single station view
      - Displays station
         - name, 
         - address,
         - total number of journeys starting from the station and ending at the station.
      - Station is located on the map.
   - ### Add station
      - Additionally stations can be added and saved to the database.
      

### 2. <ins>Back-end</ins>
  - ### Database
      -  MongoDb is used for this project to import big ammount of data from CSV files. 
          - For journeys:
            - https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv 
            - https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv
            - https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv
          - For stations:
            - https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv 
      -  Mongoose on top of it, it's used to conveniently create and manage data in MongoDB.
  * ### Api - data fetching
    - I limited the import of data to 5000 for journeys and pagination is implemented.
    - Journeys that lasted for less than ten seconds are not imported.
    - Journeys in which the distance covered is less than 10 meters are not imported.
    - Undefined or null stations are not imported.
       
## Technologies
 * UI
   - [React ](https://react.dev/)
   - [MUI- Material UI](https://mui.com/material-ui/getting-started/overview/)
   - [React Leaflet](https://react-leaflet.js.org/)
   - [React Leaflet Cluster](https://akursat.gitbook.io/marker-cluster/)
 * Back-End
   - [Node.js](https://nodejs.org/en)
   - [Express](https://expressjs.com/)
   - [MongoDB](https://www.mongodb.com/)
   - [Mongoose](https://mongoosejs.com/docs/index.html)

## Development environment
- [Node.js 18.14.2](https://nodejs.org/en) is installed.
### Environment setup
1. Install Node.js
2. Clone this repository or download ZIP. 

### Commands
- ### UI
  - ### `npm install`
    - Install the dependencies to the local `node_modules` folder and will install all modules listed as dependencies in `package.json`.
  - ### `npm start`
    - Runs UI locally and opens it in the default browser on: http://localhost:3000.
  - ### `npm run build`
    - Builds development version of the UI to the `./build` folder.
- ### Back-end
  - ### `npm install`
    - Install the dependencies to the local `node_modules` folder and will install all modules listed as dependencies in `package.json`.
  - ### `nodemon app.js`
    -  Runs back-end locally and opens it on: http://localhost:8000. Nodemon will monitor for any changes in the source and automatically restart the server. 
    

