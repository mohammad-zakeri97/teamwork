function getTargetCountryDatas(targetCountry) {
  let officialName;
  let nativeName;
  let capital;
  let region;
  let population;
  let languages;
  let timeZone;
  let callingCode;
  let falgUrl;
  officialName = targetCountry.name.official;
  if (targetCountry.languages) {
    languages = Object.values(targetCountry.languages).join(", ");
    let firstLanguage = Object.keys(targetCountry.languages)[0];
    nativeName = targetCountry.name.nativeName[firstLanguage]["common"];
  } else {
    languages = "No Info";
    nativeName = officialName;
  }
  capital = tryGetData(targetCountry, "capital");
  region = tryGetData(targetCountry, "region");
  population = tryGetData(targetCountry, "population");
  timeZone = tryGetData(targetCountry, "timezones", 0);
  if (targetCountry.idd.root)
    callingCode =
      targetCountry.idd.root.replace("+", "") + targetCountry.idd.suffixes[0];
  else callingCode = "No Info";
  falgUrl = targetCountry.flags.png;
  return {
    officialName,
    nativeName,
    capital,
    region,
    population,
    languages,
    timeZone,
    callingCode,
    falgUrl,
  };
}






$(() => {
  let countryDatas = [];
  $("#formSelectCountries").on("change", function () {
    let targetCountry = countryDatas.find(
      (country) => country.ccn3 === this.value
    );
    console.log(targetCountry);
    $(".middle").html(renderPage(getTargetCountryDatas(targetCountry)));

  });
  function setFormSelectMenu() {
    for (const country of countryDatas) {
      $("#formSelectCountries").append(
        `<option value="${country.ccn3}">${country.name.common}</option>`
      );
    }
  }
  function getCountriesData() {
    $.ajax({
      url: "https://restcountries.com/v3.1/all",
      type: "GET",
      success: function (response) {
        countryDatas = response;
      },
      error: function (err) {
        console.log(err);
        alert("Please Check you internet connection!");
      },
      async: false,
    });
  }
  getCountriesData();
  countryDatas.sort((a, b) => a.name.common.localeCompare(b.name.common));
  setFormSelectMenu();
});







function renderPage(targetCountryInfoObj) {
  console.log(targetCountryInfoObj);
  const {
    officialName,
    nativeName,
    capital,
    region,
    population,
    languages,
    timeZone,
    callingCode,
    falgUrl,
  } = targetCountryInfoObj;
  return `
		<div class="col-sm-12 col-md-4 mt-2">
        <div class="h-100 bg-secondary text-center text-white pb-1">
          <h4 class="py-2 text-white text-start fw-bold px-3">${officialName}</h4>
          <p class="lh-1 text-start ps-3 pe-0 fw-bold" style="color:yellow">Native Name: <span style="color:white">${nativeName}</span></p>
          <p class="lh-1 text-start ps-3 pe-0 fw-bold" style="color:yellow">Capital: <span style="color:white">${capital}</span></p>
          <p class="lh-1 text-start ps-3 pe-0 fw-bold" style="color:yellow">Region: <span style="color:white">${region}</span></p>
          <p class="lh-1 text-start ps-3 pe-0 fw-bold" style="color:yellow">Population: <span style="color:white">${population.toLocaleString(
    "en"
  )}</span></p>
          <p class="lh-1 text-start ps-3 pe-0 fw-bold" style="color:yellow">Languages: <span style="color:white">${languages}</span></p>
          <p class="lh-1 text-start ps-3 pe-0 fw-bold" style="color:yellow">TimeZone: <span style="color:white">${timeZone}</span></p>
        </div>
      </div>
      <div class="col-sm-12 col-md-4 mt-2">
        <div class="code bg-warning text-white h-100">
    
          <div class="bg-warning d-flex align-items-start justify-content-center">
            <h3 class="bg-dark text-center fw-bold w-100 py-3">Calling Code</h3>
          </div>
          <div class="bg-warning d-flex align-items-start justify-content-center">
            <h1 class="display-2 text-dark fw-bold py-5">${callingCode !== "No Info"
      ? callingCode
      : '<span style="color:red;"></span>'
    }</h1>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-4 mt-2">
        <div class="flag bg-light text-center text-white h-100 d-flex justify-content-center align-content-center">
          <img src=${falgUrl} alt="country flag">
        </div>
      </div>
	`;
}










function tryGetData(targetCountry, key, index = null) {
  try {
    if (index === null) {
      if (targetCountry[key]) return targetCountry[key];
      else return "no Info";
    } else return targetCountry[key][index];
  } catch (error) {
    return "No Info";
  }
}











