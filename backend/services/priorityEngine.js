/**
 * EcoPulse Transparent Rule-Based Priority Engine
 * 
 * NOTE: This is a deterministic, rule-based expert scoring engine.
 * It does NOT use black-box machine learning or external cloud AI APIs,
 * ensuring complete transparency, zero latency, and explainable civic automation.
 */

function calculatePriority({ category = '', description = '', location = '', urgencyFlag = false }) {
  let score = 0;
  const factors = [];
  const normalizedCat = (category || '').toLowerCase();
  const normalizedDesc = (description || '').toLowerCase();
  const normalizedLoc = (location || '').toLowerCase();

  // 1. Base Score by Category
  if (normalizedCat.includes('hazard') || normalizedCat.includes('e-waste') || normalizedCat.includes('electronic')) {
    score += 40;
    factors.push('Severe Category Hazard: Toxic/E-Waste Contamination Risk (+40 pts)');
  } else if (normalizedCat.includes('water') || normalizedCat.includes('nature') || normalizedCat.includes('river')) {
    score += 35;
    factors.push('Ecological Sensitivity: Direct River/Park Biosphere Threat (+35 pts)');
  } else if (normalizedCat.includes('overflow') || normalizedCat.includes('bin')) {
    score += 30;
    factors.push('Public Receptacle Spill: Sidewalk Obstruction & Health Hazard (+30 pts)');
  } else if (normalizedCat.includes('organic') || normalizedCat.includes('food')) {
    score += 25;
    factors.push('Rapid Degradation Risk: Vector & Odor Propagation (+25 pts)');
  } else if (normalizedCat.includes('construction') || normalizedCat.includes('debris')) {
    score += 20;
    factors.push('Structural Obstruction: Heavy Material Debris (+20 pts)');
  } else {
    // Plastic, paper, general recyclables
    score += 15;
    factors.push('Standard Dry Recyclable / Packaging Accumulation (+15 pts)');
  }

  // 2. Location Sensitivity Multiplier
  if (normalizedLoc.includes('market') || normalizedLoc.includes('main market')) {
    score += 20;
    factors.push('High Foot-Traffic Commercial Zone: Dense Pedestrian Impact (+20 pts)');
  } else if (normalizedLoc.includes('school') || normalizedLoc.includes('hospital') || normalizedLoc.includes('clinic')) {
    score += 25;
    factors.push('Vulnerable Population Zone: School/Medical Perimeter (+25 pts)');
  } else if (normalizedLoc.includes('park') || normalizedLoc.includes('lake') || normalizedLoc.includes('corridor') || normalizedLoc.includes('reserve')) {
    score += 20;
    factors.push('Protected Nature Zone: Green Space Bio-Integrity (+20 pts)');
  } else if (normalizedLoc.includes('metro') || normalizedLoc.includes('station') || normalizedLoc.includes('transit')) {
    score += 18;
    factors.push('Mass Transit Hub: High Commuter Flow Area (+18 pts)');
  } else {
    score += 10;
    factors.push('Standard Municipal District (+10 pts)');
  }

  // 3. Keyword Context Risk Scanner
  if (/\b(fire|chemical|toxic|acid|leak|smoke|burn|hospital|blood|biohazard)\b/i.test(normalizedDesc)) {
    score += 25;
    factors.push('Critical Keyword Detection: Chemical/Combustion/Biohazard Threat (+25 pts)');
  } else if (/\b(stench|smell|rats|flies|maggots|overflow|blocking|spill|spilling)\b/i.test(normalizedDesc)) {
    score += 15;
    factors.push('Urgency Keyword: Bio-Sanitation / Active Overflow (+15 pts)');
  } else if (/\b(urgent|huge|massive|pile|immediate|heavy)\b/i.test(normalizedDesc)) {
    score += 10;
    factors.push('Volume Keyword: High Volume Accumulation (+10 pts)');
  }

  if (urgencyFlag) {
    score += 15;
    factors.push('Citizen Urgency Flag Applied (+15 pts)');
  }

  // Clamp score between 10 and 100
  score = Math.min(100, Math.max(10, score));

  // Determine Priority Level
  let priority = 'Medium';
  if (score >= 75) {
    priority = 'Critical';
  } else if (score >= 50) {
    priority = 'High';
  } else if (score >= 30) {
    priority = 'Medium';
  } else {
    priority = 'Low';
  }

  // Additional Rule-Based Analytics
  let estimatedKg = 35;
  let diversionPotential = 70;
  let recommendedAction = 'Standard Municipal Collection';
  let assignedTeam = 'Subterranean Pod Beta';

  if (priority === 'Critical') {
    estimatedKg = 85;
    diversionPotential = normalizedCat.includes('hazard') ? 25 : 60;
    recommendedAction = 'Immediate Rapid Response: Containment & Hazardous Disposal';
    assignedTeam = 'Eco-Hazard Neutralization Unit Alpha';
  } else if (priority === 'High') {
    estimatedKg = 60;
    diversionPotential = normalizedCat.includes('overflow') ? 80 : 75;
    recommendedAction = 'Priority Automated Collection within 2 hours';
    assignedTeam = 'Subterranean Pod Unit 3 (High-Capacity)';
  } else if (priority === 'Medium') {
    estimatedKg = 40;
    diversionPotential = 85;
    recommendedAction = 'Standard Route Collection within 6 hours';
    assignedTeam = 'Electric Fleet Team Green';
  } else {
    estimatedKg = 20;
    diversionPotential = 95;
    recommendedAction = 'Scheduled Routine Recycling Sweep';
    assignedTeam = 'Autonomous Sidewalk Collector 04';
  }

  return {
    priority,
    score,
    factors,
    estimatedKg,
    diversionPotential,
    recommendedAction,
    assignedTeam
  };
}

module.exports = {
  calculatePriority
};
