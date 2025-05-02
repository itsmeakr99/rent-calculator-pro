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
  downloadBtn.style.display = 'none';

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const title = 'Rent Split Summary';
  const titleWidth = doc.getTextWidth(title);
  doc.setFontSize(18);
  doc.text(title, (pageWidth - titleWidth) / 2, 20);

  const baseRent = parseFloat(document.getElementById('baseRent').value) || 0;
  const roommates = parseInt(document.getElementById('roommates').value) || 1;

  // Collect utility inputs
  const utilities = [];
  for (let i = 0; i < utilityCount; i++) {
    const nameInput = document.getElementById(`utility-name-${i}`);
    const costInput = document.getElementById(`utility-cost-${i}`);
    if (nameInput && costInput) {
      const name = nameInput.value.trim();
      const cost = parseFloat(costInput.value) || 0;
      if (name) {
        utilities.push({ name, cost });
      }
    }
  }

  // Build input summary table: Base Rent + Utilities
  const itemData = [['Item Name', 'Cost ($)']];
  itemData.push(['Base Rent', baseRent.toFixed(2)]);
  utilities.forEach(u => itemData.push([u.name, u.cost.toFixed(2)]));

  doc.autoTable({
    head: [itemData[0]],
    body: itemData.slice(1),
    startY: 30,
    styles: { fontSize: 12 },
    theme: 'grid'
  });

  const totalCost = baseRent + utilities.reduce((sum, u) => sum + u.cost, 0);
  const costPerPerson = totalCost / roommates;
  const finalY = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(14);
  doc.text(`Total Rent: $${totalCost.toFixed(2)}`, 20, finalY);
  doc.text(`Cost per Person: $${costPerPerson.toFixed(2)}`, 20, finalY + 10);

  // Add roommate cost table (optional — remove if not needed)
  const roommateData = [['Roommate', 'Cost per Person']];
  roommateNames.forEach(name => {
    roommateData.push([name, `$${costPerPerson.toFixed(2)}`]);
  });

  doc.autoTable({
    head: [roommateData[0]],
    body: roommateData.slice(1),
    startY: finalY + 20,
    theme: 'striped',
    styles: { fontSize: 12 }
  });

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text('Generated using Rent Calculator by itsmeakr99.github.io', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });

  doc.save('Rent-Split-Bill.pdf');
  downloadBtn.style.display = 'inline-block';
}

  addUtilityBtn.addEventListener('click', () => createUtilityField());
  calculateBtn.addEventListener('click', calculateRent);
  downloadBtn.addEventListener('click', downloadPDF);
});
