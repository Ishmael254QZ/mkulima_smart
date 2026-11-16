// ========== DATA MANAGEMENT ==========

// Initialize localStorage with demo data if empty
function initializeData() {
  if (!localStorage.getItem('farmtrack_users')) {
    const demoUsers = [
      {
        id: 'farmer1',
        name: 'John Kamau',
        email: 'johnkiarie@example.com',
        phone: '+254 711224455',
        password: 'password123',
        role: 'farmer'
      },
      {
        id: 'farmer2',
        name: 'Mary Wanjiku',
        email: 'mary@example.com',
        phone: '+254 723 456 789',
        password: 'password123',
        role: 'farmer'
      },
      {
        id: 'officer1',
        name: 'Officer Ishmael Munyalo',
        email: 'officer@munyalo.com',
        phone: '+254 114417371',
        password: 'password123',
        role: 'officer'
      }
    ];
    localStorage.setItem('farmtrack_users', JSON.stringify(demoUsers));
  }
  
  if (!localStorage.getItem('farmtrack_inputs')) {
    const demoInputs = [
      {
        id: 'input1',
        farmerId: 'farmer1',
        type: 'Seeds',
        description: 'Maize Hybrid 614',
        quantity: 10,
        unit: 'kg',
        unitCost: 250,
        totalCost: 2500,
        season: '2025 Season A',
        date: '2025-01-15'
      },
      {
        id: 'input2',
        farmerId: 'farmer1',
        type: 'Fertilizer',
        description: 'DAP Fertilizer',
        quantity: 2,
        unit: 'bags',
        unitCost: 3500,
        totalCost: 7000,
        season: '2025 Season A',
        date: '2025-01-20'
      },
      {
        id: 'input3',
        farmerId: 'farmer1',
        type: 'Labor',
        description: 'Planting labor',
        quantity: 5,
        unit: 'days',
        unitCost: 500,
        totalCost: 2500,
        season: '2025 Season A',
        date: '2025-02-01'
      },
      {
        id: 'input4',
        farmerId: 'farmer2',
        type: 'Seeds',
        description: 'Beans',
        quantity: 5,
        unit: 'kg',
        unitCost: 200,
        totalCost: 1000,
        season: '2025 Season A',
        date: '2025-01-18'
      },
      {
        id: 'input5',
        farmerId: 'farmer2',
        type: 'Fertilizer',
        description: 'CAN Fertilizer',
        quantity: 1,
        unit: 'bags',
        unitCost: 2800,
        totalCost: 2800,
        season: '2025 Season A',
        date: '2025-02-10'
      }
    ];
    localStorage.setItem('farmtrack_inputs', JSON.stringify(demoInputs));
  }
  
  if (!localStorage.getItem('farmtrack_yields')) {
    const demoYields = [
      {
        id: 'yield1',
        farmerId: 'farmer1',
        crop: 'Maize',
        variety: 'Hybrid 614',
        quantity: 30,
        unit: 'bags',
        unitPrice: 3200,
        grossIncome: 96000,
        season: '2025 Season A',
        date: '2025-06-15'
      },
      {
        id: 'yield2',
        farmerId: 'farmer2',
        crop: 'Beans',
        variety: 'Rose Coco',
        quantity: 8,
        unit: 'bags',
        unitPrice: 6000,
        grossIncome: 48000,
        season: '2025 Season A',
        date: '2025-05-20'
      }
    ];
    localStorage.setItem('farmtrack_yields', JSON.stringify(demoYields));
  }
}

// Get data from localStorage
function getUsers() {
  return JSON.parse(localStorage.getItem('farmtrack_users')) || [];
}

function getInputs() {
  return JSON.parse(localStorage.getItem('farmtrack_inputs')) || [];
}

function getYields() {
  return JSON.parse(localStorage.getItem('farmtrack_yields')) || [];
}

// Save data to localStorage
function saveUsers(users) {
  localStorage.setItem('farmtrack_users', JSON.stringify(users));
}

function saveInputs(inputs) {
  localStorage.setItem('farmtrack_inputs', JSON.stringify(inputs));
}

function saveYields(yields) {
  localStorage.setItem('farmtrack_yields', JSON.stringify(yields));
}

// Current user session
let currentUser = null;

// Chart instances
let trendChart = null;
let expenseDistChart = null;

// ========== PAGE NAVIGATION ==========

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById('page-' + pageId).classList.add('active');
  
  // Update navigation
  if (pageId === 'landing') {
    document.getElementById('nav-links').classList.remove('hidden');
    document.getElementById('auth-buttons').classList.remove('hidden');
    document.getElementById('user-menu').classList.add('hidden');
    document.getElementById('user-menu').classList.remove('flex');
  } else if (pageId === 'farmer-dashboard' || pageId === 'officer-dashboard') {
    document.getElementById('nav-links').classList.add('hidden');
    document.getElementById('auth-buttons').classList.add('hidden');
    document.getElementById('user-menu').classList.remove('hidden');
    document.getElementById('user-menu').classList.add('flex');
  } else {
    document.getElementById('nav-links').classList.add('hidden');
    document.getElementById('auth-buttons').classList.remove('hidden');
    document.getElementById('user-menu').classList.add('hidden');
  }
  
  // Scroll to top
  window.scrollTo(0, 0);
}

// ========== AUTHENTICATION ==========

function handleRegister(event) {
  event.preventDefault();
  
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const phone = document.getElementById('register-phone').value;
  const password = document.getElementById('register-password').value;
  const confirm = document.getElementById('register-confirm').value;
  
  // Validate passwords match
  if (password !== confirm) {
    showToast('Passwords do not match!', 'error');
    return;
  }
  
  const users = getUsers();
  
  // Check if email already exists
  if (users.find(u => u.email === email)) {
    showToast('Email already registered!', 'error');
    return;
  }
  
  // Create new user
  const newUser = {
    id: 'user_' + Date.now(),
    name,
    email,
    phone,
    password, // In production, this would be hashed
    role: 'farmer'
  };
  
  users.push(newUser);
  saveUsers(users);
  
  showToast('Account created successfully! Please login.', 'success');
  
  // Redirect to login
  setTimeout(() => {
    showPage('login');
  }, 1500);
}

function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const role = document.getElementById('login-role').value;
  
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    showToast('Invalid email or password!', 'error');
    return;
  }
  
  // For demo, allow role switching
  if (role === 'officer' && user.role !== 'officer') {
    // Create officer session for demo
    currentUser = {
      ...user,
      role: 'officer'
    };
  } else {
    currentUser = user;
  }
  
  // Update user name in navbar
  document.getElementById('user-name').textContent = currentUser.name;
  
  showToast('Login successful!', 'success');
  
  // Redirect based on role
  setTimeout(() => {
    if (currentUser.role === 'officer') {
      showPage('officer-dashboard');
      loadOfficerDashboard();
    } else {
      showPage('farmer-dashboard');
      loadFarmerDashboard();
    }
  }, 500);
}

function logout() {
  currentUser = null;
  showToast('Logged out successfully!', 'success');
  setTimeout(() => {
    showPage('landing');
  }, 500);
}

// ========== FARMER DASHBOARD ==========

function loadFarmerDashboard() {
  if (!currentUser) return;
  
  document.getElementById('dashboard-name').textContent = currentUser.name;
  
  // Load inputs
  renderInputs();
  
  // Load yields
  renderYields();
  
  // Calculate and display stats
  updateStats();
  
  // Update reports
  updateReports();
  
  // Setup form previews
  setupFormPreviews();
  
  // Render charts
  renderCharts();
  
  // Generate insights
  generateInsights();
}

function renderInputs() {
  const inputs = getInputs().filter(i => i.farmerId === currentUser.id);
  const tbody = document.getElementById('inputs-table-body');
  const emptyDiv = document.getElementById('inputs-empty');
  const countSpan = document.getElementById('inputs-count');
  
  countSpan.textContent = inputs.length + ' record' + (inputs.length !== 1 ? 's' : '');
  
  if (inputs.length === 0) {
    tbody.innerHTML = '';
    emptyDiv.classList.remove('hidden');
    return;
  }
  
  emptyDiv.classList.add('hidden');
  tbody.innerHTML = inputs.map(input => `
    <tr class="table-row border-b border-white/5">
      <td class="px-6 py-4">
        <span class="inline-flex items-center gap-2">
          <iconify-icon icon="${getInputIcon(input.type)}" class="text-emerald-400"></iconify-icon>
          ${input.type}
        </span>
      </td>
      <td class="px-6 py-4 text-slate-300">${input.description || '-'}</td>
      <td class="px-6 py-4">${input.quantity} ${input.unit}</td>
      <td class="px-6 py-4">KES ${input.unitCost.toLocaleString()}</td>
      <td class="px-6 py-4 font-medium text-emerald-400">KES ${input.totalCost.toLocaleString()}</td>
      <td class="px-6 py-4">
        <button onclick="deleteInput('${input.id}')" class="p-2 rounded-lg hover:bg-rose-500/10 text-rose-400 transition-colors">
          <iconify-icon icon="mdi:delete"></iconify-icon>
        </button>
      </td>
    </tr>
  `).join('');
}

function renderYields() {
  const yields = getYields().filter(y => y.farmerId === currentUser.id);
  const tbody = document.getElementById('yields-table-body');
  const emptyDiv = document.getElementById('yields-empty');
  const countSpan = document.getElementById('yields-count');
  
  countSpan.textContent = yields.length + ' record' + (yields.length !== 1 ? 's' : '');
  
  if (yields.length === 0) {
    tbody.innerHTML = '';
    emptyDiv.classList.remove('hidden');
    return;
  }
  
  emptyDiv.classList.add('hidden');
  tbody.innerHTML = yields.map(yield => `
    <tr class="table-row border-b border-white/5">
      <td class="px-6 py-4">
        <span class="inline-flex items-center gap-2">
          <iconify-icon icon="${getCropIcon(yield.crop)}" class="text-emerald-400"></iconify-icon>
          ${yield.crop}
        </span>
      </td>
      <td class="px-6 py-4 text-slate-300">${yield.variety || '-'}</td>
      <td class="px-6 py-4">${yield.quantity} ${yield.unit}</td>
      <td class="px-6 py-4">KES ${yield.unitPrice.toLocaleString()}</td>
      <td class="px-6 py-4 font-medium text-emerald-400">KES ${yield.grossIncome.toLocaleString()}</td>
      <td class="px-6 py-4">
        <button onclick="deleteYield('${yield.id}')" class="p-2 rounded-lg hover:bg-rose-500/10 text-rose-400 transition-colors">
          <iconify-icon icon="mdi:delete"></iconify-icon>
        </button>
      </td>
    </tr>
  `).join('');
}

function updateStats() {
  const inputs = getInputs().filter(i => i.farmerId === currentUser.id);
  const yields = getYields().filter(y => y.farmerId === currentUser.id);
  
  const totalCost = inputs.reduce((sum, i) => sum + i.totalCost, 0);
  const grossIncome = yields.reduce((sum, y) => sum + y.grossIncome, 0);
  const netProfit = grossIncome - totalCost;
  const totalYieldQty = yields.reduce((sum, y) => sum + y.quantity, 0);
  const ratio = totalYieldQty > 0 ? (totalCost / totalYieldQty).toFixed(2) : 0;
  
  document.getElementById('stat-total-cost').textContent = 'KES ' + totalCost.toLocaleString();
  document.getElementById('stat-gross-income').textContent = 'KES ' + grossIncome.toLocaleString();
  document.getElementById('stat-net-profit').textContent = 'KES ' + netProfit.toLocaleString();
  document.getElementById('stat-net-profit').className = netProfit >= 0 
    ? 'text-2xl font-semibold text-emerald-400' 
    : 'text-2xl font-semibold text-rose-400';
  document.getElementById('stat-ratio').textContent = ratio;
}

function updateReports() {
  const inputs = getInputs().filter(i => i.farmerId === currentUser.id);
  const yields = getYields().filter(y => y.farmerId === currentUser.id);
  
  const totalCost = inputs.reduce((sum, i) => sum + i.totalCost, 0);
  const grossIncome = yields.reduce((sum, y) => sum + y.grossIncome, 0);
  const netProfit = grossIncome - totalCost;
  const totalYieldQty = yields.reduce((sum, y) => sum + y.quantity, 0);
  const ratio = totalYieldQty > 0 ? (totalCost / totalYieldQty).toFixed(2) : 0;
  
  // Update report values
  document.getElementById('report-total-cost').textContent = 'KES ' + totalCost.toLocaleString();
  document.getElementById('report-gross-income').textContent = 'KES ' + grossIncome.toLocaleString();
  document.getElementById('report-net-profit').textContent = 'KES ' + netProfit.toLocaleString();
  document.getElementById('report-net-profit').className = netProfit >= 0 
    ? 'text-xl font-semibold text-emerald-400' 
    : 'text-xl font-semibold text-rose-400';
  document.getElementById('report-ratio').textContent = ratio;
  
  // Input breakdown
  renderInputBreakdown(inputs, totalCost);
  
  // Seasonal chart
  renderSeasonalChart(inputs, yields);
  
  // Crop performance
  renderCropPerformance(yields);
}

function renderInputBreakdown(inputs, totalCost) {
  const container = document.getElementById('input-breakdown');
  const emptyDiv = document.getElementById('input-breakdown-empty');
  
  if (inputs.length === 0) {
    container.innerHTML = '';
    emptyDiv.classList.remove('hidden');
    return;
  }
  
  emptyDiv.classList.add('hidden');
  
  // Group by type
  const grouped = {};
  inputs.forEach(input => {
    if (!grouped[input.type]) grouped[input.type] = 0;
    grouped[input.type] += input.totalCost;
  });
  
  container.innerHTML = Object.entries(grouped)
    .sort((a, b) => b[1] - a[1])
    .map(([type, cost]) => {
      const percentage = totalCost > 0 ? ((cost / totalCost) * 100).toFixed(1) : 0;
      return `
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="flex items-center gap-2">
              <iconify-icon icon="${getInputIcon(type)}" class="text-emerald-400"></iconify-icon>
              ${type}
            </span>
            <span class="text-slate-400">KES ${cost.toLocaleString()} (${percentage}%)</span>
          </div>
          <div class="h-2 bg-[#0a0b0e] rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
          </div>
        </div>
      `;
    }).join('');
}

function renderSeasonalChart(inputs, yields) {
  const container = document.getElementById('seasonal-chart');
  const emptyDiv = document.getElementById('seasonal-chart-empty');
  
  // Group by season
  const seasons = {};
  
  inputs.forEach(input => {
    if (!seasons[input.season]) {
      seasons[input.season] = { inputs: 0, yields: 0 };
    }
    seasons[input.season].inputs += input.totalCost;
  });
  
  yields.forEach(yield => {
    if (!seasons[yield.season]) {
      seasons[yield.season] = { inputs: 0, yields: 0 };
    }
    seasons[yield.season].yields += yield.grossIncome;
  });
  
  if (Object.keys(seasons).length === 0) {
    container.innerHTML = '';
    emptyDiv.classList.remove('hidden');
    return;
  }
  
  emptyDiv.classList.add('hidden');
  
  const maxValue = Math.max(...Object.values(seasons).map(s => Math.max(s.inputs, s.yields)));
  
  container.innerHTML = Object.entries(seasons).map(([season, data]) => {
    const inputHeight = maxValue > 0 ? (data.inputs / maxValue) * 200 : 0;
    const yieldHeight = maxValue > 0 ? (data.yields / maxValue) * 200 : 0;
    
    return `
      <div class="flex flex-col items-center gap-2">
        <div class="flex items-end gap-2 h-52">
          <div class="w-12 bg-gradient-to-t from-rose-500/60 to-rose-400/40 rounded-t-lg chart-bar flex items-end justify-center pb-2" style="height: ${inputHeight}px">
            <span class="text-xs font-medium">${inputHeight > 30 ? 'Cost' : ''}</span>
          </div>
          <div class="w-12 bg-gradient-to-t from-emerald-500/60 to-emerald-400/40 rounded-t-lg chart-bar flex items-end justify-center pb-2" style="height: ${yieldHeight}px">
            <span class="text-xs font-medium">${yieldHeight > 30 ? 'Income' : ''}</span>
          </div>
        </div>
        <span class="text-xs text-slate-400 text-center">${season}</span>
      </div>
    `;
  }).join('');
}

function renderCropPerformance(yields) {
  const tbody = document.getElementById('crop-performance-body');
  const emptyDiv = document.getElementById('crop-performance-empty');
  
  if (yields.length === 0) {
    tbody.innerHTML = '';
    emptyDiv.classList.remove('hidden');
    return;
  }
  
  emptyDiv.classList.add('hidden');
  
  // Group by crop
  const grouped = {};
  yields.forEach(yield => {
    if (!grouped[yield.crop]) {
      grouped[yield.crop] = { quantity: 0, income: 0, unit: yield.unit };
    }
    grouped[yield.crop].quantity += yield.quantity;
    grouped[yield.crop].income += yield.grossIncome;
  });
  
  const maxIncome = Math.max(...Object.values(grouped).map(c => c.income));
  
  tbody.innerHTML = Object.entries(grouped)
    .sort((a, b) => b[1].income - a[1].income)
    .map(([crop, data]) => {
      const performance = maxIncome > 0 ? (data.income / maxIncome) * 100 : 0;
      return `
        <tr class="table-row border-b border-white/5">
          <td class="px-4 py-3">
            <span class="flex items-center gap-2">
              <iconify-icon icon="${getCropIcon(crop)}" class="text-emerald-400"></iconify-icon>
              ${crop}
            </span>
          </td>
          <td class="px-4 py-3 text-slate-300">${data.quantity} ${data.unit}</td>
          <td class="px-4 py-3 text-emerald-400 font-medium">KES ${data.income.toLocaleString()}</td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-2">
              <div class="w-24 h-2 bg-[#0a0b0e] rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style="width: ${performance}%"></div>
              </div>
              <span class="text-xs text-slate-400">${performance.toFixed(0)}%</span>
            </div>
          </td>
        </tr>
      `;
    }).join('');
}

function setupFormPreviews() {
  // Input form preview
  const inputQty = document.getElementById('input-qty');
  const inputCost = document.getElementById('input-cost');
  
  function updateInputPreview() {
    const qty = parseFloat(inputQty.value) || 0;
    const cost = parseFloat(inputCost.value) || 0;
    document.getElementById('input-total-preview').textContent = 'KES ' + (qty * cost).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  
  inputQty.addEventListener('input', updateInputPreview);
  inputCost.addEventListener('input', updateInputPreview);
  
  // Yield form preview
  const yieldQty = document.getElementById('yield-qty');
  const yieldPrice = document.getElementById('yield-price');
  
  function updateYieldPreview() {
    const qty = parseFloat(yieldQty.value) || 0;
    const price = parseFloat(yieldPrice.value) || 0;
    document.getElementById('yield-income-preview').textContent = 'KES ' + (qty * price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  
  yieldQty.addEventListener('input', updateYieldPreview);
  yieldPrice.addEventListener('input', updateYieldPreview);
}

function addInput(event) {
  event.preventDefault();
  
  const type = document.getElementById('input-type').value;
  const description = document.getElementById('input-desc').value;
  const quantity = parseFloat(document.getElementById('input-qty').value);
  const unit = document.getElementById('input-unit').value;
  const unitCost = parseFloat(document.getElementById('input-cost').value);
  const season = document.getElementById('input-season').value;
  
  const newInput = {
    id: 'input_' + Date.now(),
    farmerId: currentUser.id,
    type,
    description,
    quantity,
    unit,
    unitCost,
    totalCost: quantity * unitCost,
    season,
    date: new Date().toISOString().split('T')[0]
  };
  
  const inputs = getInputs();
  inputs.push(newInput);
  saveInputs(inputs);
  
  // Reset form
  document.getElementById('input-form').reset();
  document.getElementById('input-total-preview').textContent = 'KES 0.00';
  
  // Refresh display
  renderInputs();
  updateStats();
  updateReports();
  renderCharts();
  generateInsights();
  
  showToast('Input record added successfully!', 'success');
}

function addYield(event) {
  event.preventDefault();
  
  const crop = document.getElementById('yield-crop').value;
  const variety = document.getElementById('yield-variety').value;
  const quantity = parseFloat(document.getElementById('yield-qty').value);
  const unit = document.getElementById('yield-unit').value;
  const unitPrice = parseFloat(document.getElementById('yield-price').value);
  const season = document.getElementById('yield-season').value;
  
  const newYield = {
    id: 'yield_' + Date.now(),
    farmerId: currentUser.id,
    crop,
    variety,
    quantity,
    unit,
    unitPrice,
    grossIncome: quantity * unitPrice,
    season,
    date: new Date().toISOString().split('T')[0]
  };
  
  const yields = getYields();
  yields.push(newYield);
  saveYields(yields);
  
  // Reset form
  document.getElementById('yield-form').reset();
  document.getElementById('yield-income-preview').textContent = 'KES 0.00';
  
  // Refresh display
  renderYields();
  updateStats();
  updateReports();
  renderCharts();
  generateInsights();
  
  showToast('Yield record added successfully!', 'success');
}

function deleteInput(id) {
  if (!confirm('Are you sure you want to delete this input record?')) return;
  
  const inputs = getInputs().filter(i => i.id !== id);
  saveInputs(inputs);
  
  renderInputs();
  updateStats();
  updateReports();
  renderCharts();
  generateInsights();
  
  showToast('Input record deleted!', 'success');
}

function deleteYield(id) {
  if (!confirm('Are you sure you want to delete this yield record?')) return;
  
  const yields = getYields().filter(y => y.id !== id);
  saveYields(yields);
  
  renderYields();
  updateStats();
  updateReports();
  renderCharts();
  generateInsights();
  
  showToast('Yield record deleted!', 'success');
}

// ========== CHARTING FUNCTIONS ==========

function renderCharts() {
  const inputs = getInputs().filter(i => i.farmerId === currentUser.id);
  const yields = getYields().filter(y => y.farmerId === currentUser.id);
  
  // 1. Expense Distribution (Pie Chart)
  renderExpenseDistributionChart(inputs);
  
  // 2. Trend Chart (Bar Chart)
  renderTrendChart(inputs, yields);
}

function renderExpenseDistributionChart(inputs) {
  const ctx = document.getElementById('expenseDistChart').getContext('2d');
  
  // Destroy existing chart
  if (expenseDistChart) {
    expenseDistChart.destroy();
  }
  
  // Group expenses by type
  const expenseTypes = {};
  inputs.forEach(input => {
    expenseTypes[input.type] = (expenseTypes[input.type] || 0) + input.totalCost;
  });
  
  // Prepare data
  const labels = Object.keys(expenseTypes);
  const data = Object.values(expenseTypes);
  
  if (labels.length === 0) {
    // No data - show empty chart
    expenseDistChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['No Data'],
        datasets: [{
          data: [1],
          backgroundColor: ['#374151'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#9CA3AF',
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return 'KES ' + context.parsed.toLocaleString();
              }
            }
          }
        }
      }
    });
    return;
  }
  
  // Create chart
  expenseDistChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          '#10B981', // emerald
          '#F59E0B', // amber
          '#EF4444', // red
          '#3B82F6', // blue
          '#8B5CF6', // violet
          '#06B6D4', // cyan
          '#84CC16', // lime
          '#F97316'  // orange
        ],
        borderWidth: 2,
        borderColor: '#1F2937'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#9CA3AF',
            font: {
              size: 12
            },
            padding: 20
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return context.label + ': KES ' + context.parsed.toLocaleString() + ' (' + percentage + '%)';
            }
          }
        }
      }
    }
  });
}

function renderTrendChart(inputs, yields) {
  const ctx = document.getElementById('trendChart').getContext('2d');
  
  // Destroy existing chart
  if (trendChart) {
    trendChart.destroy();
  }
  
  // Group data by season
  const seasons = {};
  const allSeasons = new Set();
  
  inputs.forEach(input => {
    allSeasons.add(input.season);
    if (!seasons[input.season]) {
      seasons[input.season] = { expenses: 0, revenue: 0 };
    }
    seasons[input.season].expenses += input.totalCost;
  });
  
  yields.forEach(yield => {
    allSeasons.add(yield.season);
    if (!seasons[yield.season]) {
      seasons[yield.season] = { expenses: 0, revenue: 0 };
    }
    seasons[yield.season].revenue += yield.grossIncome;
  });
  
  // Sort seasons chronologically
  const sortedSeasons = Array.from(allSeasons).sort();
  const expenseData = sortedSeasons.map(season => seasons[season]?.expenses || 0);
  const revenueData = sortedSeasons.map(season => seasons[season]?.revenue || 0);
  
  if (sortedSeasons.length === 0) {
    // No data - show empty chart
    trendChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['No Data'],
        datasets: [{
          label: 'No Data',
          data: [0],
          backgroundColor: '#374151'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: '#9CA3AF',
              callback: function(value) {
                return 'KES ' + value.toLocaleString();
              }
            },
            grid: {
              color: '#374151'
            }
          },
          x: {
            ticks: {
              color: '#9CA3AF'
            },
            grid: {
              color: '#374151'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#9CA3AF'
            }
          }
        }
      }
    });
    return;
  }
  
  // Create chart
  trendChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sortedSeasons,
      datasets: [
        {
          label: 'Expenses',
          data: expenseData,
          backgroundColor: 'rgba(239, 68, 68, 0.6)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 1
        },
        {
          label: 'Revenue',
          data: revenueData,
          backgroundColor: 'rgba(16, 185, 129, 0.6)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#9CA3AF',
            callback: function(value) {
              return 'KES ' + value.toLocaleString();
            }
          },
          grid: {
            color: '#374151'
          }
        },
        x: {
          ticks: {
            color: '#9CA3AF'
          },
          grid: {
            color: '#374151'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#9CA3AF'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': KES ' + context.parsed.y.toLocaleString();
            }
          }
        }
      }
    }
  });
}

// ========== SMART INSIGHTS ==========

// ========== EXPORT / DOWNLOAD ==========

function exportFarmCSV() {
  if (!currentUser) return;
  const inputs = getInputs().filter(i => i.farmerId === currentUser.id);
  const yields = getYields().filter(y => y.farmerId === currentUser.id);

  let csv = 'Category,Type/Name,Description,Quantity,Unit,Unit Cost,Total Cost,Season,Date\n';

  inputs.forEach(i => {
    csv += `Input,${i.type},${i.description || ''},${i.quantity},${i.unit},${i.unitCost},${i.totalCost},${i.season},${i.date}\n`;
  });

  csv += '\nCategory,Crop,Variety,Quantity,Unit,Unit Price,Gross Income,Season,Date\n';

  yields.forEach(y => {
    csv += `Yield,${y.crop},${y.variety || ''},${y.quantity},${y.unit},${y.unitPrice},${y.grossIncome},${y.season},${y.date}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${currentUser.name.replace(/\s+/g, '_')}_farm_report.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}


function generateInsights() {
  const inputs = getInputs().filter(i => i.farmerId === currentUser.id);
  const yields = getYields().filter(y => y.farmerId === currentUser.id);
  
  const totalExpenses = inputs.reduce((sum, input) => sum + input.totalCost, 0);
  const totalRevenue = yields.reduce((sum, yield) => sum + yield.grossIncome, 0);
  const netProfit = totalRevenue - totalExpenses;
  
  const container = document.getElementById('insight-content');
  let insights = [];
  
  // 1. Break-even Analysis
  if (yields.length > 0 && totalRevenue > 0) {
    const avgPricePerUnit = yields.reduce((sum, y) => sum + y.unitPrice, 0) / yields.length;
    const totalYieldUnits = yields.reduce((sum, y) => sum + y.quantity, 0);
    
    if (avgPricePerUnit > 0 && totalYieldUnits > 0) {
      const breakEvenUnits = Math.ceil(totalExpenses / avgPricePerUnit);
      const breakEvenPercentage = ((breakEvenUnits / totalYieldUnits) * 100).toFixed(1);
      
      insights.push({
        icon: 'mdi:bullseye',
        title: 'Break-Even Point',
        message: `You need to sell ${breakEvenUnits.toLocaleString()} units (${breakEvenPercentage}%) of your produce to cover costs.`,
        type: breakEvenUnits <= totalYieldUnits ? 'success' : 'warning'
      });
    }
  }
  
  // 2. Highest Expense Category
  if (inputs.length > 0) {
    const expenseByType = {};
    inputs.forEach(input => {
      expenseByType[input.type] = (expenseByType[input.type] || 0) + input.totalCost;
    });
    
    const maxExpense = Object.entries(expenseByType).sort((a, b) => b[1] - a[1])[0];
    if (maxExpense) {
      const percentage = ((maxExpense[1] / totalExpenses) * 100).toFixed(1);
      insights.push({
        icon: 'mdi:exclamation-triangle',
        title: 'Highest Cost Category',
        message: `"${maxExpense[0]}" is your biggest expense at KES ${maxExpense[1].toLocaleString()} (${percentage}% of total costs).`,
        type: 'warning'
      });
    }
  }
  
  // 3. Profitability Assessment
  if (totalRevenue > 0) {
    const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);
    
    if (netProfit > 0) {
      insights.push({
        icon: 'mdi:thumbs-up',
        title: 'Profitability Status',
        message: `Great job! You're operating at a ${profitMargin}% profit margin.`,
        type: 'success'
      });
    } else {
      insights.push({
        icon: 'mdi:alert-circle',
        title: 'Profitability Alert',
        message: `You're currently operating at a loss. Consider reviewing your ${Object.entries(expenseByType || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || 'input'} costs.`,
        type: 'danger'
      });
    }
  }
  
  // 4. Yield Efficiency
  if (inputs.length > 0 && yields.length > 0) {
    const costPerYieldUnit = totalExpenses / yields.reduce((sum, y) => sum + y.quantity, 0);
    const avgRevenuePerUnit = totalRevenue / yields.reduce((sum, y) => sum + y.quantity, 0);
    
    if (costPerYieldUnit > 0 && avgRevenuePerUnit > 0) {
      const efficiency = ((avgRevenuePerUnit - costPerYieldUnit) / costPerYieldUnit * 100).toFixed(1);
      
      insights.push({
        icon: 'mdi:chart-line',
        title: 'Yield Efficiency',
        message: `Your cost-to-yield ratio shows ${efficiency > 0 ? 'positive' : 'negative'} efficiency. ${efficiency > 0 ? 'Keep optimizing!' : 'Focus on reducing input costs.'}`,
        type: efficiency > 0 ? 'success' : 'warning'
      });
    }
  }
  
  // 5. Data Completeness
  if (inputs.length === 0 && yields.length === 0) {
    insights.push({
      icon: 'mdi:information',
      title: 'Getting Started',
      message: 'Add some input and yield records to see personalized insights and analytics.',
      type: 'info'
    });
  }
  
  // Render insights
  if (insights.length === 0) {
    container.innerHTML = '<div class="text-slate-400 text-center py-4">Add more data to generate insights.</div>';
  } else {
    container.innerHTML = insights.map(insight => `
      <div class="flex items-start gap-3 p-3 rounded-lg bg-[#0a0b0e] border border-white/5">
        <div class="flex-shrink-0">
          <iconify-icon icon="${insight.icon}" class="text-lg ${
            insight.type === 'success' ? 'text-emerald-400' :
            insight.type === 'warning' ? 'text-amber-400' :
            insight.type === 'danger' ? 'text-rose-400' : 'text-blue-400'
          }"></iconify-icon>
        </div>
        <div class="flex-1">
          <h4 class="font-medium text-sm mb-1 ${
            insight.type === 'success' ? 'text-emerald-400' :
            insight.type === 'warning' ? 'text-amber-400' :
            insight.type === 'danger' ? 'text-rose-400' : 'text-blue-400'
          }">${insight.title}</h4>
          <p class="text-sm text-slate-300">${insight.message}</p>
        </div>
      </div>
    `).join('');
  }
}

// ========== TAB SWITCHING ==========

function switchTab(tab) {
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('bg-emerald-500', 'text-white');
    btn.classList.add('text-slate-400');
  });
  document.getElementById('tab-' + tab).classList.add('bg-emerald-500', 'text-white');
  document.getElementById('tab-' + tab).classList.remove('text-slate-400');
  
  // Update tab contents
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.add('hidden');
  });
  document.getElementById('content-' + tab).classList.remove('hidden');
}

// ========== OFFICER DASHBOARD ==========

function loadOfficerDashboard() {
  const users = getUsers().filter(u => u.role === 'farmer');
  const inputs = getInputs();
  const yields = getYields();
  
  // Update stats
  document.getElementById('officer-total-farmers').textContent = users.length;
  document.getElementById('officer-total-inputs').textContent = inputs.length;
  document.getElementById('officer-total-yields').textContent = yields.length;
  
  // Calculate average profit
  let totalProfit = 0;
  users.forEach(user => {
    const userInputs = inputs.filter(i => i.farmerId === user.id);
    const userYields = yields.filter(y => y.farmerId === user.id);
    const totalCost = userInputs.reduce((sum, i) => sum + i.totalCost, 0);
    const grossIncome = userYields.reduce((sum, y) => sum + y.grossIncome, 0);
    totalProfit += (grossIncome - totalCost);
  });
  const avgProfit = users.length > 0 ? Math.round(totalProfit / users.length) : 0;
  document.getElementById('officer-avg-profit').textContent = 'KES ' + avgProfit.toLocaleString();
  
  // Render farmers table
  renderFarmersTable(users, inputs, yields);
}

function renderFarmersTable(users, inputs, yields) {
  const tbody = document.getElementById('farmers-table-body');
  const emptyDiv = document.getElementById('farmers-empty');
  
  if (users.length === 0) {
    tbody.innerHTML = '';
    emptyDiv.classList.remove('hidden');
    return;
  }
  
  emptyDiv.classList.add('hidden');
  
  tbody.innerHTML = users.map(user => {
    const userInputs = inputs.filter(i => i.farmerId === user.id);
    const userYields = yields.filter(y => y.farmerId === user.id);
    const totalCost = userInputs.reduce((sum, i) => sum + i.totalCost, 0);
    const grossIncome = userYields.reduce((sum, y) => sum + y.grossIncome, 0);
    const netProfit = grossIncome - totalCost;
    
    return `
      <tr class="table-row border-b border-white/5">
        <td class="px-6 py-4 font-medium">${user.name}</td>
        <td class="px-6 py-4 text-slate-300">${user.email}</td>
        <td class="px-6 py-4 text-slate-300">${user.phone}</td>
        <td class="px-6 py-4">${userInputs.length}</td>
        <td class="px-6 py-4">${userYields.length}</td>
        <td class="px-6 py-4 font-medium ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}">
          KES ${netProfit.toLocaleString()}
        </td>
        <td class="px-6 py-4">
          <button onclick="viewFarmerDetails('${user.id}')" class="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm hover:bg-emerald-500/20 transition-colors">
            View Details
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function viewFarmerDetails(farmerId) {
  const users = getUsers();
  const farmer = users.find(u => u.id === farmerId);
  const inputs = getInputs().filter(i => i.farmerId === farmerId);
  const yields = getYields().filter(y => y.farmerId === farmerId);
  
  const totalCost = inputs.reduce((sum, i) => sum + i.totalCost, 0);
  const grossIncome = yields.reduce((sum, y) => sum + y.grossIncome, 0);
  const netProfit = grossIncome - totalCost;
  
  document.getElementById('modal-farmer-name').textContent = farmer.name;
  
  document.getElementById('modal-farmer-content').innerHTML = `
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="p-4 rounded-xl bg-[#0a0b0e]">
        <p class="text-xs text-slate-400 mb-1">Email</p>
        <p class="font-medium">${farmer.email}</p>
      </div>
      <div class="p-4 rounded-xl bg-[#0a0b0e]">
        <p class="text-xs text-slate-400 mb-1">Phone</p>
        <p class="font-medium">${farmer.phone}</p>
      </div>
      <div class="p-4 rounded-xl bg-[#0a0b0e]">
        <p class="text-xs text-slate-400 mb-1">Total Input Cost</p>
        <p class="font-medium">KES ${totalCost.toLocaleString()}</p>
      </div>
      <div class="p-4 rounded-xl bg-[#0a0b0e]">
        <p class="text-xs text-slate-400 mb-1">Gross Income</p>
        <p class="font-medium text-emerald-400">KES ${grossIncome.toLocaleString()}</p>
      </div>
    </div>
    
    <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
      <p class="text-sm text-emerald-400 mb-1">Net Profit/Loss</p>
      <p class="text-2xl font-semibold ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}">
        KES ${netProfit.toLocaleString()}
      </p>
    </div>
    
    <div class="mb-6">
      <h4 class="font-semibold mb-3">Recent Inputs (${inputs.length})</h4>
      <div class="space-y-2 max-h-40 overflow-y-auto">
        ${inputs.slice(-5).reverse().map(input => `
          <div class="flex justify-between items-center p-3 rounded-lg bg-[#0a0b0e] text-sm">
            <span class="flex items-center gap-2">
              <iconify-icon icon="${getInputIcon(input.type)}" class="text-emerald-400"></iconify-icon>
              ${input.type} - ${input.description || 'N/A'}
            </span>
            <span class="text-slate-400">KES ${input.totalCost.toLocaleString()}</span>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div>
      <h4 class="font-semibold mb-3">Yield Records (${yields.length})</h4>
      <div class="space-y-2 max-h-40 overflow-y-auto">
        ${yields.slice(-5).reverse().map(yield => `
          <div class="flex justify-between items-center p-3 rounded-lg bg-[#0a0b0e] text-sm">
            <span class="flex items-center gap-2">
              <iconify-icon icon="${getCropIcon(yield.crop)}" class="text-emerald-400"></iconify-icon>
              ${yield.crop} - ${yield.quantity} ${yield.unit}
            </span>
            <span class="text-emerald-400">KES ${yield.grossIncome.toLocaleString()}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  document.getElementById('farmer-modal').classList.remove('hidden');
}

function closeFarmerModal() {
  document.getElementById('farmer-modal').classList.add('hidden');
}

// ========== UTILITY FUNCTIONS ==========

function getInputIcon(type) {
  const icons = {
    'Seeds': 'mdi:seed',
    'Fertilizer': 'mdi:sack',
    'Pesticide': 'mdi:bottle-tonic',
    'Labor': 'mdi:account-hard-hat',
    'Irrigation': 'mdi:water-pump',
    'Equipment': 'mdi:tractor',
    'Other': 'mdi:help-circle'
  };
  return icons[type] || 'mdi:circle';
}

function getCropIcon(crop) {
  const icons = {
    'Maize': 'mdi:corn',
    'Beans': 'mdi:seed-outline',
    'Rice': 'mdi:rice',
    'Wheat': 'mdi:barley',
    'Potatoes': 'mdi:food-apple',
    'Tomatoes': 'mdi:food-apple-outline',
    'Cabbage': 'mdi:leaf',
    'Sugarcane': 'mdi:sugar-cane',
    'Coffee': 'mdi:coffee',
    'Tea': 'mdi:tea',
    'Other': 'mdi:plant'
  };
  return icons[crop] || 'mdi:sprout';
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const icon = document.getElementById('toast-icon');
  const msg = document.getElementById('toast-message');
  
  msg.textContent = message;
  icon.setAttribute('icon', type === 'success' ? 'mdi:check-circle' : 'mdi:alert-circle');
  icon.className = type === 'success' ? 'text-emerald-400 text-xl' : 'text-rose-400 text-xl';
  
  toast.classList.remove('hidden');
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// ========== INITIALIZATION ==========

document.addEventListener('DOMContentLoaded', function() {
  initializeData();
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
});
