document.addEventListener('DOMContentLoaded', () => {
  const utilitiesList = document.getElementById('utilitiesList');
  const calculateBtn = document.getElementById('calculateBtn');
  const addUtilityBtn = document.getElementById('addUtilityBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const resultSection = document.getElementById('result');
  const roommateNamesDiv = document.getElementById('roommateNames');

  let utilityCount = 0;
  let roommateNames = [];

  // Fixed default utilities
  const defaultUtilities = [
    { name: "Utilities", cost: 0 },
    { name: "Valet Trash Fee", cost: 0 },
    { name: "Amenity Fee", cost: 0 },
    { name: "Pest Control Fee", cost: 0 },
    { name: "Current Bill", cost: 0 },
    { name: "Wifi Bill", cost: 0 },
    { name: "Renters Insurance", cost: 0 }
  ];

  function createUtilityField(name = '', cost = 0) {
    const div = document.createElement('div');
    div.className = 'utility-item';
    div.innerHTML = `
      <input type="text" id="utility-name-${utilityCount}" value="${name}" placeholder="Utility Name">
      <input type="number" id="utility-cost-${utilityCount}" value="${cost}" placeholder="Cost ($)">
      <button class="delete-btn" onclick="this.parentElement.remove()">❌</button>
    `;
    utilitiesList.appendChild(div);
    utilityCount++;
  }

  // Load fixed utilities first
  defaultUtilities.forEach(utility => createUtilityField(utility.name, utility.cost));

  function calculateRent() {
    const baseRent = parseFloat(document.getElementById('baseRent').value) || 0;
    const roommates = parseInt(document.getElementById('roommates').value) || 1;

    if (roommates <= 0) {
      alert('Number of roommates must be at least 1.');
      return;
    }

    roommateNames = [];
    for (let i = 0; i < roommates; i++) {
      const name = prompt(`Enter the name of roommate ${i + 1}:`);
      roommateNames.push(name || `Roommate ${i + 1}`);
    }

    let totalUtilitiesCost = 0;
    for (let i = 0; i < utilityCount; i++) {
      const costInput = document.getElementById(`utility-cost-${i}`);
      if (costInput && !isNaN(costInput.value)) {
        totalUtilitiesCost += parseFloat(costInput.value) || 0;
      }
    }

    const totalCost = baseRent + totalUtilitiesCost;
    const costPerPerson = totalCost / roommates;

    document.getElementById('totalCost').textContent = `$${totalCost.toFixed(2)}`;
    document.getElementById('costPerPerson').textContent = `$${costPerPerson.toFixed(2)}`;

    roommateNamesDiv.innerHTML = '';
    roommateNames.forEach(name => {
      const div = document.createElement('div');
      div.textContent = `${name}: $${costPerPerson.toFixed(2)}`;
      roommateNamesDiv.appendChild(div);
    });

    resultSection.classList.remove('hidden');
  }

  function downloadPDF() {
    html2pdf().from(resultSection).save('Rent-Split-Bill.pdf');
  }

  addUtilityBtn.addEventListener('click', () => createUtilityField());
  calculateBtn.addEventListener('click', calculateRent);
  downloadBtn.addEventListener('click', downloadPDF);
});
