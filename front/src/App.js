import "./App.css";
import React from "react";

function App() {
  const apiUrl = "https://node-s7-validation-and-cors.vercel.app/brand";
  const [brands, setBrands] = React.useState();

  React.useEffect(() => {
    fetch(apiUrl)
      .then((brands) => brands.json())
      .then((brandsParsed) => setBrands(brandsParsed));
  }, []);

  return (
    <div className="App">
      <h2>Marcas:</h2>
      <ul>
        {brands?.data?.map((brand) => (
          <li key={brand._id}>{brand.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
