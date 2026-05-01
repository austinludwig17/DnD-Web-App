const addAttackBtn = document.getElementById("addAttackBtn"); // button to add attacks
const attackContainer = document.getElementById("attackContainer"); // attack display area
const noteInputs = document.querySelectorAll(".note-input"); // note inputs
const addItemBtn = document.getElementById("addItemBtn"); // add inventory item button
const inventoryContainer = document.getElementById("inventoryContainer"); // inventory display
const statInputs = document.querySelectorAll(".stat-input"); // ability scores
const skillProfs = document.querySelectorAll(".skill-prof"); // skill checkboxes
const skillMods = document.querySelectorAll(".skill-mod"); // skill modifiers
const rollD20Btn = document.getElementById("rollD20Btn");
const d20Result = document.getElementById("d20Result");

// ===============================
// ATTACK DATA (LOAD + SAVE)
// ===============================

// Load saved attacks OR create empty array
let attacks = JSON.parse(localStorage.getItem("attacks")) || [];

// Save attacks to localStorage
function saveAttacks() {
  localStorage.setItem("attacks", JSON.stringify(attacks));
}


// ===============================
// NOTES SECTION
// Each note saves using its name as the key
// ===============================

noteInputs.forEach(function (note) {

  const key = note.name;

  // Load saved note value
  const savedValue = localStorage.getItem(key);
  if (savedValue !== null) {
    note.value = savedValue;
  }

  // Save note on user input
  note.addEventListener("input", function () {
    localStorage.setItem(key, note.value);
  });
});


// ===============================
// STATS SECTION
// Saves ability scores using "stat-"
// ===============================

statInputs.forEach(function (stat) {

  const key = "stat-" + stat.name;

  // Load saved stat value
  const savedValue = localStorage.getItem(key);
  if (savedValue !== null) {
    stat.value = savedValue;
  }

  // Save stat when user edits it
  stat.addEventListener("input", function () {
    localStorage.setItem(key, stat.value);
  });
});


// ===============================
// ATTACK RENDER FUNCTION
// Displays all attacks on the page
// ===============================

function renderAttacks() {

  attackContainer.innerHTML = ""; // clear existing display

  attacks.forEach((attack, index) => {

    const attackCard = document.createElement("div");
    attackCard.className = "attack-card";

    // Create attack UI
    attackCard.innerHTML = `
      <div class="attack-row">
        <div class="attack-field">
          <label>Attack Name</label>
          <input type="text" class="attack-name" value="${attack.name}">
        </div>

        <div class="attack-field">
          <label>Damage Die</label>
          <select class="attack-die">
            <option value="d4" ${attack.die === "d4" ? "selected" : ""}>d4</option>
            <option value="d6" ${attack.die === "d6" ? "selected" : ""}>d6</option>
            <option value="d8" ${attack.die === "d8" ? "selected" : ""}>d8</option>
            <option value="d10" ${attack.die === "d10" ? "selected" : ""}>d10</option>
            <option value="d12" ${attack.die === "d12" ? "selected" : ""}>d12</option>
          </select>
        </div>
      </div>

      <div class="attack-field">
        <label>Description</label>
        <textarea class="attack-description">${attack.description}</textarea>
      </div>

      <button type="button" class="remove-btn">Remove Attack</button>
    `;

    // Grab inputs inside card
    const nameInput = attackCard.querySelector(".attack-name");
    const dieSelect = attackCard.querySelector(".attack-die");
    const descriptionInput = attackCard.querySelector(".attack-description");
    const removeBtn = attackCard.querySelector(".remove-btn");

    // Update attack name
    nameInput.addEventListener("input", function () {
      attacks[index].name = nameInput.value;
      saveAttacks();
    });

    // Update damage dice
    dieSelect.addEventListener("change", function () {
      attacks[index].die = dieSelect.value;
      saveAttacks();
    });

    // Update description
    descriptionInput.addEventListener("input", function () {
      attacks[index].description = descriptionInput.value;
      saveAttacks();
    });

    // Remove attack
    removeBtn.addEventListener("click", function () {
      attacks.splice(index, 1);
      saveAttacks();
      renderAttacks(); // refresh UI
    });

    attackContainer.appendChild(attackCard);
  });
}


// ===============================
// INVENTORY SECTION
// ===============================

if (addItemBtn && inventoryContainer) {

  let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

  function saveInventory() {
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }

  function renderInventory() {

    inventoryContainer.innerHTML = "";

    inventory.forEach(function (item, index) {

      const inventoryCard = document.createElement("div");
      inventoryCard.className = "inventory-card";

      // Create inventory item card
      inventoryCard.innerHTML = `
        <div class="inventory-row">
          <div class="inventory-field">
            <label>Item Name</label>
            <input type="text" class="item-name" value="${item.name}">
          </div>

          <div class="inventory-field">
            <label>Gold Value</label>
            <input type="number" class="item-gold" value="${item.gold}">
          </div>

          <div class="inventory-field">
            <label>Equipped</label>
            <select class="item-equipped">
              <option value="Equipped" ${item.equipped === "Equipped" ? "selected" : ""}>Equipped</option>
              <option value="Not Equipped" ${item.equipped === "Not Equipped" ? "selected" : ""}>Not Equipped</option>
            </select>
          </div>
        </div>

        <button type="button" class="remove-btn">Remove Item</button>
      `;

      const nameInput = inventoryCard.querySelector(".item-name");
      const goldInput = inventoryCard.querySelector(".item-gold");
      const equippedSelect = inventoryCard.querySelector(".item-equipped");
      const removeBtn = inventoryCard.querySelector(".remove-btn");

      // Update item name
      nameInput.addEventListener("input", function () {
        inventory[index].name = nameInput.value;
        saveInventory();
      });

      // Update gold value
      goldInput.addEventListener("input", function () {
        inventory[index].gold = goldInput.value;
        saveInventory();
      });

      // Update equip status
      equippedSelect.addEventListener("change", function () {
        inventory[index].equipped = equippedSelect.value;
        saveInventory();
      });

      // Remove item
      removeBtn.addEventListener("click", function () {
        inventory.splice(index, 1);
        saveInventory();
        renderInventory();
      });

      inventoryContainer.appendChild(inventoryCard);
    });
  }

  // Add new item
  addItemBtn.addEventListener("click", function () {
    inventory.push({
      name: "",
      gold: "",
      equipped: "Not Equipped"
    });

    saveInventory();
    renderInventory();
  });

  renderInventory();
}


// ===============================
// ATTACK BUTTON
// ===============================

if (addAttackBtn && attackContainer) {
  addAttackBtn.addEventListener("click", function () {
    attacks.push({
      name: "",
      die: "d6",
      description: ""
    });

    saveAttacks();
    renderAttacks();
  });

  renderAttacks();
}


// ===============================
// SKILLS SECTION
// Saves each skill separately using unique keys
// ===============================


// ---------- SKILL CHECKBOXES ----------
skillProfs.forEach(function (skill) {

  const key = "skill-prof-" + skill.dataset.skill;

  // Load saved checkbox state
  const savedValue = localStorage.getItem(key);
  if (savedValue !== null) {
    skill.checked = savedValue === "true";
  }

  // Save when changed
  skill.addEventListener("change", function () {
    localStorage.setItem(key, skill.checked);
  });
});


// ---------- SKILL MODIFIERS ----------
skillMods.forEach(function (skill) {

  const key = "skill-mod-" + skill.dataset.skill;

  // Load saved modifier
  const savedValue = localStorage.getItem(key);
  if (savedValue !== null) {
    skill.value = savedValue;
  }

  // Save when edited
  skill.addEventListener("input", function () {
    localStorage.setItem(key, skill.value);
  });
});

// ===============================
// D20 DICE ROLLER
// ===============================

if (rollD20Btn && d20Result) {
  rollD20Btn.addEventListener("click", function () {
    const roll = Math.floor(Math.random() * 20) + 1;
    d20Result.textContent = roll;
  });
}