import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function DietCustom() {
  const { currentUser } = useAuth();
  const [form, setForm] = useState({
    age: "",
    weight: "",
    height: "",
    goal: "",
    activity: "",
    restrictions: ""
  });

  const [diet, setDiet] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateDiet = () => {
    const { age, weight, height, goal, activity, restrictions } = form;
    let dietPlan = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
      tips: []
    };

    // Age-based adjustments
    const ageNum = parseInt(age);
    if (ageNum < 25) {
      dietPlan.tips.push("Focus on calcium-rich foods for bone health");
      dietPlan.breakfast.push("Greek yogurt with granola");
    } else if (ageNum > 35) {
      dietPlan.tips.push("Include anti-inflammatory foods to reduce PCOS symptoms");
      dietPlan.breakfast.push("Smoothie with turmeric and ginger");
    }

    // BMI calculation if height provided
    let bmi = null;
    if (height && weight) {
      const heightM = parseFloat(height) / 100;
      bmi = (parseFloat(weight) / (heightM * heightM)).toFixed(1);
    }

    // Goal-based diet
    if (goal.toLowerCase().includes("weight loss")) {
      dietPlan.breakfast = dietPlan.breakfast.concat([
        "Oatmeal with berries and chia seeds",
        "Boiled eggs with spinach",
        "Green smoothie (spinach, banana, almond milk)"
      ]);
      dietPlan.lunch = [
        "Grilled chicken salad with quinoa",
        "Lentil soup with mixed vegetables",
        "Turkey wrap with avocado and veggies"
      ];
      dietPlan.dinner = [
        "Baked fish with steamed broccoli",
        "Stir-fried tofu with mixed greens",
        "Grilled lean meat with salad"
      ];
      dietPlan.snacks = [
        "Apple with almond butter",
        "Carrot sticks with hummus",
        "Handful of walnuts"
      ];
      dietPlan.tips.push("Aim for 500 calorie deficit daily", "Drink 8-10 glasses of water", "Exercise 30 minutes daily");
      if (bmi && bmi > 25) {
        dietPlan.tips.push(`Your BMI is ${bmi} - gradual weight loss recommended`);
      }
    } else if (goal.toLowerCase().includes("weight gain")) {
      dietPlan.breakfast = dietPlan.breakfast.concat([
        "Avocado toast with eggs",
        "Smoothie with banana and peanut butter",
        "Whole grain cereal with full-fat milk"
      ]);
      dietPlan.lunch = [
        "Chicken rice bowl with vegetables",
        "Pasta with tomato sauce and cheese",
        "Sandwich with avocado and turkey"
      ];
      dietPlan.dinner = [
        "Salmon with sweet potato and butter",
        "Beef stir-fry with rice",
        "Pasta with meat sauce and cheese"
      ];
      dietPlan.snacks = [
        "Trail mix with nuts and dried fruits",
        "Cheese and crackers",
        "Fruit with yogurt"
      ];
      dietPlan.tips.push("Focus on nutrient-dense calories", "Include healthy fats", "Strength training 3x per week");
      if (bmi && bmi < 18.5) {
        dietPlan.tips.push(`Your BMI is ${bmi} - healthy weight gain recommended`);
      }
    } else {
      // Balanced maintenance
      dietPlan.breakfast = dietPlan.breakfast.concat([
        "Whole grain toast with avocado",
        "Smoothie bowl with fruits",
        "Eggs with vegetables"
      ]);
      dietPlan.lunch = [
        "Quinoa salad with grilled chicken",
        "Vegetable stir-fry with tofu",
        "Turkey and vegetable wrap"
      ];
      dietPlan.dinner = [
        "Grilled fish with brown rice",
        "Lean meat with roasted vegetables",
        "Vegetable curry with chickpeas"
      ];
      dietPlan.snacks = [
        "Greek yogurt",
        "Fresh fruit",
        "Nuts and seeds"
      ];
      dietPlan.tips.push("Maintain balanced macronutrients", "Include variety of vegetables", "Regular exercise routine");
    }

    // Activity level adjustments
    if (activity.toLowerCase().includes("active") || activity.toLowerCase().includes("very")) {
      dietPlan.tips.push("Higher activity level - ensure adequate protein intake");
      dietPlan.snacks.push("Protein shake or bar");
    } else if (activity.toLowerCase().includes("sedentary")) {
      dietPlan.tips.push("Lower activity level - focus on portion control");
    }

    // Dietary restrictions
    if (restrictions) {
      const restrictions_lower = restrictions.toLowerCase();
      if (restrictions_lower.includes("vegetarian") || restrictions_lower.includes("vegan")) {
        dietPlan.tips.push("Vegetarian/vegan diet - ensure complete protein sources");
        // Replace meat options
        dietPlan.lunch = dietPlan.lunch.map(item => item.replace(/chicken|turkey|beef/gi, "tofu/tempeh"));
        dietPlan.dinner = dietPlan.dinner.map(item => item.replace(/chicken|turkey|beef|salmon/gi, "tofu/tempeh"));
      }
      if (restrictions_lower.includes("gluten")) {
        dietPlan.tips.push("Gluten-free diet - choose certified gluten-free grains");
        dietPlan.breakfast = dietPlan.breakfast.map(item => item.replace(/toast|oatmeal|granola/gi, "gluten-free alternatives"));
      }
      if (restrictions_lower.includes("dairy")) {
        dietPlan.tips.push("Dairy-free diet - use plant-based alternatives");
        dietPlan.breakfast = dietPlan.breakfast.map(item => item.replace(/yogurt|milk|cheese/gi, "dairy-free alternatives"));
      }
    }

    setDiet(dietPlan);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h2>Custom Diet Plan Generator</h2>
      <p>Create a personalized diet plan based on your specific needs and goals.</p>

      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:"15px", marginTop:"20px", marginBottom:"30px"}}>

        <input
          name="age"
          placeholder="Age"
          onChange={handleChange}
          style={{padding:"10px", border:"1px solid #ddd", borderRadius:"6px"}}
          type="number"
        />

        <input
          name="weight"
          placeholder="Weight (kg)"
          onChange={handleChange}
          style={{padding:"10px", border:"1px solid #ddd", borderRadius:"6px"}}
          type="number"
        />

        <input
          name="height"
          placeholder="Height (cm)"
          onChange={handleChange}
          style={{padding:"10px", border:"1px solid #ddd", borderRadius:"6px"}}
          type="number"
        />

        <select
          name="goal"
          onChange={handleChange}
          style={{padding:"10px", border:"1px solid #ddd", borderRadius:"6px"}}
        >
          <option value="">Select Goal</option>
          <option value="weight loss">Weight Loss</option>
          <option value="weight gain">Weight Gain</option>
          <option value="maintenance">Maintenance</option>
        </select>

        <select
          name="activity"
          onChange={handleChange}
          style={{padding:"10px", border:"1px solid #ddd", borderRadius:"6px"}}
        >
          <option value="">Activity Level</option>
          <option value="sedentary">Sedentary</option>
          <option value="moderate">Moderate</option>
          <option value="active">Active</option>
          <option value="very active">Very Active</option>
        </select>

        <input
          name="restrictions"
          placeholder="Dietary restrictions (optional)"
          onChange={handleChange}
          style={{padding:"10px", border:"1px solid #ddd", borderRadius:"6px"}}
        />

      </div>

      <button
        onClick={generateDiet}
        style={{
          padding:"12px 30px",
          background:"#ff4d8d",
          color:"white",
          border:"none",
          borderRadius:"8px",
          cursor:"pointer",
          fontSize:"16px",
          marginBottom:"30px"
        }}
      >
        Generate My Diet Plan
      </button>

      {/* Display structured diet plan */}
      {diet && (
        <div>
          <h3>🍽️ Your Personalized Diet Plan</h3>

          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(250px, 1fr))", gap:"20px", marginTop:"20px"}}>

            <div style={{background:"white", padding:"20px", borderRadius:"10px", boxShadow:"0 4px 15px rgba(0,0,0,0.1)"}}>
              <h4>🌅 Breakfast Options</h4>
              {diet.breakfast.map((item, i) => <p key={i}>• {item}</p>)}
            </div>

            <div style={{background:"white", padding:"20px", borderRadius:"10px", boxShadow:"0 4px 15px rgba(0,0,0,0.1)"}}>
              <h4>☀️ Lunch Options</h4>
              {diet.lunch.map((item, i) => <p key={i}>• {item}</p>)}
            </div>

            <div style={{background:"white", padding:"20px", borderRadius:"10px", boxShadow:"0 4px 15px rgba(0,0,0,0.1)"}}>
              <h4>🌙 Dinner Options</h4>
              {diet.dinner.map((item, i) => <p key={i}>• {item}</p>)}
            </div>

            <div style={{background:"white", padding:"20px", borderRadius:"10px", boxShadow:"0 4px 15px rgba(0,0,0,0.1)"}}>
              <h4>🍎 Snacks</h4>
              {diet.snacks.map((item, i) => <p key={i}>• {item}</p>)}
            </div>

          </div>

          <div style={{background:"#e8f4fd", padding:"20px", borderRadius:"10px", marginTop:"20px"}}>
            <h4>💡 Health Tips & Recommendations</h4>
            {diet.tips.map((tip, i) => <p key={i}>• {tip}</p>)}
          </div>

        </div>
      )}

      <div style={{marginTop:"30px", textAlign:"center"}}>
        <a href="/nutrition" style={{color:"#ff4d8d", textDecoration:"none", fontWeight:"bold"}}>← Back to Nutrition Page</a>
      </div>
    </div>
  );
}

export default DietCustom;