document.addEventListener("DOMContentLoaded", function() {

   const countryAPI = 'https://www.randyconnolly.com/funwebdev/3rd/api/travel/countries.php';
   const cityAPI = 'https://www.randyconnolly.com/funwebdev/3rd/api/travel/cities.php';
   const continentAPI = 'https://www.randyconnolly.com/funwebdev/3rd/api/travel/continents.php';
   const userAPI = 'https://www.randyconnolly.com/funwebdev/3rd/api/travel/users.php';
   const photoAPI = 'https://www.randyconnolly.com/funwebdev/3rd/api/travel/images.php';
   const imageURL = 'https://www.randyconnolly.com/funwebdev/3rd/images/travel/square150/';   

   let loader1 = document.querySelector("#loader1");
   let loader2 = document.querySelector("#loader2");
   let main = document.querySelector("main");
   let filters = document.querySelector("#filters");
   let selectContinent = document.querySelector("#continents");
   let selectCountries = document.querySelector("#countries");
   let selectCities = document.querySelector("#cities");
   let selectUsers = document.querySelector("#users");
   let results = document.querySelector("#results");
   let button = document.querySelector("#fetchButton")

   // hide loading animations and sections
   loader1.style.display = "none";
   loader2.style.display = "none";
   main.style.display = "none";
   filters.style.display = "none";
   // button event listener
   button.addEventListener("click", displayFilters);


   
   async function displayFilters() {
      loader1.style.display = "block";
      main.style.display = "none";
      button.style.display = "none";



      const countryPromise = fetch(countryAPI).then( resp => resp.json());
      const cityPromise = fetch(cityAPI).then( resp => resp.json());
      const continentPromise = fetch(continentAPI).then( resp => resp.json());
      const userPromise = fetch(userAPI).then( resp => resp.json());

      const [countriesArr, citiesArr, continentsArr, userArr] = await Promise.all( [countryPromise, cityPromise, continentPromise, userPromise] );

      // we have the data now we can turn off loading animation and show the select elements
      loader1.style.display = "none";
      main.style.display = "block";
      filters.style.display = "block";
      // console.log(countriesArr, continentsArr, citiesArr, userArr);
      // console.log(countryPromise);
      // console.log(countriesArr);

      // we need 4 calls to populate the 4 select element lists
      populateSelect(continentsArr, selectContinent, "name", "code", "name");
      populateSelect(countriesArr, selectCountries, "name", "iso", "name")
      populateSelect(citiesArr, selectCities, "name", "id", "name");
      populateSelect(userArr, selectUsers, "lastName", "id", "lastName");
   };

      // this function is going to take the data and select element to create the option list and generate the markup, adding event listener to select
   function populateSelect(array, selectElement, sortField, valueField, textField) {
    const sorted = array.sort( (a, b) => a[sortField] < b[sortField] ? -1 : 1 );
    // console.log(sorted);
    for (let obj of sorted) {
      let opt = document.createElement("option");
      opt.value = obj[valueField];
      opt.textContent = obj[textField];
      selectElement.appendChild(opt);
    };
    selectElement.addEventListener("input", loadPhotos);
  }

      // this function is called once a select element event has been triggered it will fetch the photos json and then create the images markup
    async function loadPhotos(e) {
        loader2.style.display = "block";
        let queryName;

        if (e.target == selectCountries) queryName = "iso";
        if (e.target == selectContinent) queryName = "continent";
        if (e.target == selectCities) queryName = "city";
        if (e.target == selectUsers) queryName = "user";


        let url = photoAPI + "?" + queryName + "=" + e.target.value;
        // wait for data to resolve
        try {
        const response = await fetch(url);
        const photos = await response.json();

        // hide load animation
        loader2.style.display = "none";
        // clear the photos container
        results.innerHTML = "";

        photos.forEach( p => {
          let img = document.createElement("img");
          img.src = imageURL + p.filename;
          img.title = p.title;
          img.alt = p.title;
          results.appendChild(img);
        });

      } catch (error) {
        console.log(error, "oops. something went wrong.");
      }

      // reset all but the current select element back to default value
      resetSelects(e.target);
    }

    function resetSelects(currentSelect) {
      if (currentSelect != selectContinent) selectContinent.value = 0;
      if (currentSelect != selectCountries) selectCountries.value = 0;
      if (currentSelect != selectCities) selectCities.value = 0;
      if (currentSelect != selectUsers) selectUsers.value = 0;
    };
});
