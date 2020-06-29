const csv = require('csvtojson')
var request = require('request');
const express = require('express')
const router = new express.Router()
const dateFormat = require('dateformat');

router.get('/confirm', async (req, res) => {

  try {

      let select_country = req.query.country;
      let date_array = [];
      let cofirmed_case=[];
      let deaths_case=[];
      let country=[];
      let total_confirmed_case = 0;


      await csv()
      .fromStream(request.get('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv'))
      .subscribe((json)=>{
          return new Promise((resolve,reject)=>{
            resolve(json);
          })
      }).then((json)=>{

        // Fetch Column Date
        var columnsIn = json[0]; 
        for(var key in columnsIn){
          if(!isNaN(Date.parse(key))){
            date_array.push(dateFormat(key,'mmm d, yyyy'));
          }
        } 

        // Fetch Country
        json.forEach((row)=>{
          if (country.includes(row['Country/Region']) === false) country.push(row['Country/Region']);
        });


        // Fetch Confirm Case Overall
        date_array.forEach((datewise)=>{
          let c = 0;
          json.forEach((row)=>{
            if(select_country != ''){
                if(row['Country/Region'] == select_country){
                  c += Number(row[dateFormat(datewise,'shortDate')]);
                }
            } else {
              c += Number(row[dateFormat(datewise,'shortDate')]);
            }
          });
          cofirmed_case.push(c);
        })

      }).catch((error) => console.log('error: '));


      await csv()
      .fromStream(request.get('https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv'))
      .subscribe((death_json)=>{
        return new Promise((resolve,reject)=>{
            resolve(death_json);
          })
      }).then((death_json)=>{
          date_array.forEach((datewise)=>{
            let c = 0;
            death_json.forEach((row)=>{
              if(select_country != ''){
                  if(row['Country/Region'] == select_country){
                    c += Number(row[dateFormat(datewise,'shortDate')]);
                  }
              } else {
                c += Number(row[dateFormat(datewise,'shortDate')]);
              }
            });
            deaths_case.push(c);
          })
      }).catch((error) => console.log('error: '));

      res.status(201).send({date_array,cofirmed_case, deaths_case, country})

  } catch (e) {
      res.status(400).send(e)
  }
})

module.exports = router
