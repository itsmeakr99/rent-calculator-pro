window.addEventListener('DOMContentLoaded', () => {
  let utilityCount = 0;
  let roommates = 0;
  let roommateNames = [];

  const utilitiesList = document.getElementById('utilitiesList');

  const defaultUtilities = [
    { name: "Utilities", cost: 0 },
    { name: "Valet Trash Fee", cost: 0 },
    { name: "Amenity Fee", cost: 0 },
    { name: "Pest Control Fee", cost: 0 },
    { name: "Current Bill", cost: 0 },
    { name: "Wifi Bill", cost: 0 },
    { name: "Renters Insurance", cost: 0 }
  ];

  defaultUtilities.forEach(util => addUtility(util.name, util.cost));

  function addUtility(name = '', cost = 0) {
    const div = document.createElement('div');
    div.className = 'utility-item';
    div.innerHTML = \`
      <input type="text" placeholder="Utility Name" id="utility-name-\${utilityCount}" value="\${name}">
      <input type="number" placeholder="Cost ($)" id="utility-cost-\${utilityCount}" value="\${cost}">
      <button class="delete-btn" onclick="this.parentElement.remove()">❌</button>
    \`;
    utilitiesList.appendChild(div);
    utilityCount++;
  }

  function calculateRent() {
    const baseRent = parseFloat(document.getElementById('baseRent').value) || 0;
    roommates = parseInt(document.getElementById('roommates').value) || 1;

    if (roommates <= 0) {
      alert("Roommates must be at least 1.");
      return;
    }

    roommateNames = [];
    for (let i = 0; i < roommates; i++) {
      let name = prompt(\`Enter name of roommate \${i + 1}:\`);
      if (name) {
        roommateNames.push(name.trim());
      } else {
        roommateNames.push(\`Roommate \${i + 1}\`);
      }
    }

    let totalUtilities = 0;
    for (let i = 0; i < utilityCount; i++) {
      const costInput = document.getElementById(\`utility-cost-\${i}\`);
      if (costInput && costInput.value) {
        totalUtilities += parseFloat(costInput.value) || 0;
      }
    }

    const totalCost = baseRent + totalUtilities;
    const costPerPerson = totalCost / roommates;

    document.getElementById('totalCost').textContent = \`$\${totalCost.toFixed(2)}\`;
    document.getElementById('costPerPerson').textContent = \`$\${costPerPerson.toFixed(2)}\`;

    const resultNames = document.getElementById('roommateNames');
    resultNames.innerHTML = '';
    roommateNames.forEach(name => {
      const nameDiv = document.createElement('div');
      nameDiv.textContent = \`\${name}: $\${costPerPerson.toFixed(2)}\`;
      resultNames.appendChild(nameDiv);
    });

    document.getElementById('result').classList.remove('hidden');
    document.getElementById('result').classList.add('show');

    showPopup();
  }

  function showPopup() {
    const popup = document.getElementById('popup');
    popup.classList.remove('hidden');
    setTimeout(() => {
      popup.classList.add('hidden');
    }, 2000);
  }

  document.getElementById('addUtilityBtn').addEventListener('click', () => addUtility());
  document.getElementById('calculateBtn').addEventListener('click', calculateRent);

  document.getElementById('downloadBtn').addEventListener('click', () => {
    const element = document.getElementById('result');
    html2pdf().from(element).save('Rent-Split-Bill.pdf');
  });
});