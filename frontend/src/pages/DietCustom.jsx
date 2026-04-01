import { useState } from "react";

function DietCustom() {
  const [form, setForm] = useState({
    age: "",
    weight: "",
    goal: ""
  });

  const [diet, setDiet] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateDiet = () => {
    if (form.goal === "weight loss") {
      setDiet("Low-carb diet, avoid sugar, eat vegetables");
    } else {
      setDiet("Balanced diet with proteins and carbs");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Custom Diet</h2>

      <input name="age" placeholder="Age" onChange={handleChange} />
      <input name="weight" placeholder="Weight" onChange={handleChange} />
      <input name="goal" placeholder="Goal (weight loss / gain)" onChange={handleChange} />

      <button onClick={generateDiet}>Generate Diet</button>

      <p>{diet}</p>
    </div>
  );
}

export default DietCustom;