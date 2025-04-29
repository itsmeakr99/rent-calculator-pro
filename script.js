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
  const downloadBtn = document.getElementById('downloadBtn');

  // Hide the Download PDF button temporarily
  downloadBtn.style.display = 'none';

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Rent Split Summary', 20, 20);

  const totalCost = document.getElementById('totalCost').textContent || "$0.00";
  const costPerPerson = document.getElementById('costPerPerson').textContent.replace('$', '') || "0.00";

  const tableData = [
    ['Roommate', 'Cost per Person ($)'],
    ...roommateNames.map(name => [name, costPerPerson])
  ];

  doc.autoTable({
    head: [tableData[0]],
    body: tableData.slice(1),
    startY: 40,
    theme: 'striped',
    styles: {
      fontSize: 12,
      cellPadding: 4
    }
  });

  // Show total cost at the bottom
  doc.setFontSize(14);
  doc.text(`Total Rent (Including Utilities): ${totalCost}`, 20, doc.lastAutoTable.finalY + 20);

  doc.save('Rent-Split-Bill.pdf');

  // Show the Download PDF button again
  downloadBtn.style.display = 'inline-block';
}


  addUtilityBtn.addEventListener('click', () => createUtilityField());
  calculateBtn.addEventListener('click', calculateRent);
  downloadBtn.addEventListener('click', downloadPDF);
});
