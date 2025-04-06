
const input = document.getElementById("country-input");
const results = document.getElementById("results");

const renderResults = (countries)=> {
  results.innerHTML = "";
  if (countries.length === 1) {
    const country = countries[0];
    const languages = country.languages.map((lang) => lang.name).join(", ");
    results.innerHTML = `
      <h2>${country.name}</h2>
      <p><strong>Столиця:</strong> ${country.capital}</p>
      <p><strong>Населення:</strong> ${country.population.toLocaleString()} </p> 
      <p><strong>Мови:</strong> ${languages}</p> 
      <img src="${country.flag}" alt="Прапор ${country.name}" /> 
    `; 
    results.style.background ="rgba(110, 37, 221, 0.67)" 
    results.style.width = "300px" 
    results.style.height = "350px" 
    results.style.borderRadius ="25px" 
    results.style.paddingLeft = "30px" 
    results.style.paddingRight = "30px" 
  } else if (countries.length <= 10) { 
    const list = document.createElement("ul"); 
    countries.forEach((c) => { 
      const li = document.createElement("li"); 
      li.textContent = c.name;
      list.appendChild(li);
    });
    results.appendChild(list);
  }
};

const fetchCountries = _.debounce(async (term) => { 
  if (!term.trim()) { 
    results.innerHTML = ""; 
    return; 
  }

  try {
    const res = await fetch(`https://restcountries.com/v2/name/${term}`); 
    const data = await res.json(); 

    if (data.status === 404) {
      PNotify.notice({ text: "Країну не знайдено.", delay: 1500 });
      results.innerHTML = "";
      return;
    }

    if (data.length > 10) {
      results.innerHTML = "";
      PNotify.info({
        text: "Занадто багато збігів. Уточніть запит.",
        delay: 2000,
      });
      return;
    }


    renderResults(data);
  } catch (error) {
    console.error("Помилка:", error);
    PNotify.error({ text: "Не вдалося завантажити дані.", delay: 2000 });
  }
}, 500);

input.addEventListener("input", (e) => { 
  fetchCountries(e.target.value); 
}); 
