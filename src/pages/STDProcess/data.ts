export const INITIAL_CATEGORIES = ['Sausage', 'Meatball', 'Ham', 'Bologna', 'WIP-Emulsion'];
export const STANDARD_BATCH_SIZES = [100, 150];

export const MOCK_STANDARDS = [
    {
        id: 'STD-001', name: 'Standard Smoked Sausage', category: 'Sausage', rawWeightPerBatch: 150, yieldPercent: 88.5, status: 'Active', updateDate: '26/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Standard Pork', batchPerCycle: 1, cycleTimeMin: 15, yieldPercent: 100 }],
        formingStandards: [{ id: 1, batter: 'Standard Pork', size: 'Jumbo', type: 'Twist Linker', casing: 'Cellulose', stuffed: true, capacityKgHr: 2000 }],
        cookingStandards: [{ id: 1, oven: 'Smoke House 6T', program: 'Smoke_Std', cycleTimeMin: 120, capacityBatch: 10 }],
        coolingStandards: [{ id: 1, unit: 'Rapid Chill Tunnel', program: 'Shower_Fast', cycleTimeMin: 60, capacityBatch: 10 }],
        peelingStandards: [{ id: 1, method: 'Machine Only', capacityKgHr: 1500 }],
        cuttingStandards: [],
        packingStandards: [{ id: 1, machine: 'Thermoformer', packSize: '1kg', format: 'Bag', sfgSize: 'Jumbo', capacityKgHr: 1000 }],
        packVariants: []
    },
    {
        id: 'STD-002', name: 'Premium Meatball', category: 'Meatball', rawWeightPerBatch: 100, yieldPercent: 95, status: 'Active', updateDate: '25/02/2025',
        mixingStandards: [{ id: 1, machine: 'Bowl Cutter 200L', batter: 'Premium Beef', batchPerCycle: 1, cycleTimeMin: 12, yieldPercent: 100 }],
        formingStandards: [{ id: 1, batter: 'Premium Beef', size: 'M', type: 'Belt Former', casing: '', stuffed: false, capacityKgHr: 1500 }],
        cookingStandards: [{ id: 1, oven: 'Smoke House 4T', program: 'Steam_01', cycleTimeMin: 60, capacityBatch: 8 }],
        coolingStandards: [{ id: 1, unit: 'Shower Tunnel', program: 'Chill_Std', cycleTimeMin: 40, capacityBatch: 8 }],
        peelingStandards: [],
        cuttingStandards: [],
        packingStandards: [{ id: 1, machine: 'Flow Pack', packSize: '500g', format: 'Bag', sfgSize: 'M', capacityKgHr: 800 }],
        packVariants: []
    },
    {
        id: 'BAT-SMC-01', name: 'Batter ไส้กรอกรมควัน (Smoked)', category: 'WIP-Emulsion', rawWeightPerBatch: 150, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Smoked Formula', batchPerCycle: 1, cycleTimeMin: 15, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-MTB-02', name: 'Batter ลูกชิ้นหมู (Pork Meatball)', category: 'WIP-Emulsion', rawWeightPerBatch: 100, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Bowl Cutter 200L', batter: 'Pork Meatball Formula', batchPerCycle: 1, cycleTimeMin: 12, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-BOL-04', name: 'Batter โบโลน่า (Bologna)', category: 'WIP-Emulsion', rawWeightPerBatch: 150, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Bologna Formula', batchPerCycle: 1, cycleTimeMin: 15, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-CHE-09', name: 'Batter ไส้กรอกชีส (Cheese)', category: 'WIP-Emulsion', rawWeightPerBatch: 150, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Cheese Sausage Formula', batchPerCycle: 1, cycleTimeMin: 15, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-SND-20', name: 'Batter แฮมแซนวิช (Sandwich Ham)', category: 'WIP-Emulsion', rawWeightPerBatch: 150, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Sandwich Ham Formula', batchPerCycle: 1, cycleTimeMin: 20, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-001', name: 'Smoked Batter', category: 'WIP-Emulsion', rawWeightPerBatch: 150, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Smoked Formula', batchPerCycle: 1, cycleTimeMin: 15, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-002', name: 'Meatball Batter', category: 'WIP-Emulsion', rawWeightPerBatch: 100, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Bowl Cutter 200L', batter: 'Meatball Formula', batchPerCycle: 1, cycleTimeMin: 12, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-003', name: 'Bologna Batter', category: 'WIP-Emulsion', rawWeightPerBatch: 150, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Bologna Formula', batchPerCycle: 1, cycleTimeMin: 15, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-004', name: 'Cheese Batter', category: 'WIP-Emulsion', rawWeightPerBatch: 150, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Cheese Formula', batchPerCycle: 1, cycleTimeMin: 15, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-005', name: 'Sandwich Ham Batter', category: 'WIP-Emulsion', rawWeightPerBatch: 150, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Sandwich Ham Formula', batchPerCycle: 1, cycleTimeMin: 20, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-006', name: 'Layer Batter Red', category: 'WIP-Emulsion', rawWeightPerBatch: 100, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Bowl Cutter 200L', batter: 'Red Layer Formula', batchPerCycle: 1, cycleTimeMin: 10, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-007', name: 'Layer Batter Green', category: 'WIP-Emulsion', rawWeightPerBatch: 100, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Bowl Cutter 200L', batter: 'Green Layer Formula', batchPerCycle: 1, cycleTimeMin: 10, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'BAT-008', name: 'Filling Cheese', category: 'WIP-Emulsion', rawWeightPerBatch: 50, yieldPercent: 100, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Filling Cheese Formula', batchPerCycle: 1, cycleTimeMin: 10, yieldPercent: 100 }],
        formingStandards: [], cookingStandards: [], coolingStandards: [], peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'SFG-001', name: 'Smoked Sausage SFG', category: 'Sausage', rawWeightPerBatch: 150, yieldPercent: 88.5, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [], 
        formingStandards: [{ id: 1, batter: 'Smoked Batter', size: 'M', type: 'Twist Linker', casing: 'Cellulose', stuffed: true, capacityKgHr: 2000 }],
        cookingStandards: [{ id: 1, oven: 'Smoke House 6T', program: 'Smoke_Std', cycleTimeMin: 120, capacityBatch: 10 }],
        coolingStandards: [{ id: 1, unit: 'Rapid Chill Tunnel', program: 'Shower_Fast', cycleTimeMin: 60, capacityBatch: 10 }],
        peelingStandards: [{ id: 1, method: 'Machine Only', capacityKgHr: 1500 }],
        cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'SFG-002', name: 'Pork Meatball SFG', category: 'Meatball', rawWeightPerBatch: 100, yieldPercent: 95, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [],
        formingStandards: [{ id: 1, batter: 'Meatball Batter', size: 'M', type: 'Belt Former', casing: '', stuffed: false, capacityKgHr: 1500 }],
        cookingStandards: [{ id: 1, oven: 'Smoke House 4T', program: 'Steam_01', cycleTimeMin: 60, capacityBatch: 8 }],
        coolingStandards: [{ id: 1, unit: 'Shower Tunnel', program: 'Chill_Std', cycleTimeMin: 40, capacityBatch: 8 }],
        peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'SFG-003', name: 'Bologna SFG', category: 'Bologna', rawWeightPerBatch: 150, yieldPercent: 92, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [],
        formingStandards: [{ id: 1, batter: 'Bologna Batter', size: 'L', type: 'Clipper Direct', casing: 'Polyamide', stuffed: true, capacityKgHr: 1800 }],
        cookingStandards: [{ id: 1, oven: 'Smoke House 6T', program: 'Steam_01', cycleTimeMin: 150, capacityBatch: 10 }],
        coolingStandards: [{ id: 1, unit: 'Shower Tunnel', program: 'Chill_Std', cycleTimeMin: 90, capacityBatch: 10 }],
        peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'SFG-004', name: 'Cheese Sausage SFG', category: 'Sausage', rawWeightPerBatch: 150, yieldPercent: 89, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [],
        formingStandards: [{ id: 1, batter: 'Cheese Batter', size: 'M', type: 'Twist Linker', casing: 'Cellulose', stuffed: true, capacityKgHr: 1900 }],
        cookingStandards: [{ id: 1, oven: 'Smoke House 6T', program: 'Smoke_Std', cycleTimeMin: 120, capacityBatch: 10 }],
        coolingStandards: [{ id: 1, unit: 'Rapid Chill Tunnel', program: 'Shower_Fast', cycleTimeMin: 60, capacityBatch: 10 }],
        peelingStandards: [{ id: 1, method: 'Machine Only', capacityKgHr: 1500 }],
        cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'SFG-005', name: 'Sandwich Ham SFG', category: 'Ham', rawWeightPerBatch: 150, yieldPercent: 98, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [],
        formingStandards: [{ id: 1, batter: 'Sandwich Ham Batter', size: 'Jumbo', type: 'Clipper Direct', casing: 'Polyamide', stuffed: true, capacityKgHr: 1200 }],
        cookingStandards: [{ id: 1, oven: 'Smoke House 6T', program: 'Steam_01', cycleTimeMin: 180, capacityBatch: 10 }],
        coolingStandards: [{ id: 1, unit: 'Shower Tunnel', program: 'Chill_Std', cycleTimeMin: 120, capacityBatch: 10 }],
        peelingStandards: [], cuttingStandards: [], packingStandards: [], packVariants: []
    },
    {
        id: 'STD-003', name: 'Bologna Chili', category: 'Bologna', rawWeightPerBatch: 150, yieldPercent: 98, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Bologna Chili Formula', batchPerCycle: 1, cycleTimeMin: 20, yieldPercent: 100 }],
        formingStandards: [{ id: 1, batter: 'Bologna Chili', size: 'Large', type: 'Clipper', casing: 'Plastic', stuffed: true, capacityKgHr: 1500 }],
        cookingStandards: [{ id: 1, oven: 'Steam Oven', program: 'Steam_85C', cycleTimeMin: 180, capacityBatch: 12 }],
        coolingStandards: [{ id: 1, unit: 'Chilled Water Tank', program: 'Water_Chill', cycleTimeMin: 90, capacityBatch: 12 }],
        peelingStandards: [{ id: 1, method: 'Manual Peeling', capacityKgHr: 500 }],
        cuttingStandards: [{ id: 1, machine: 'High Speed Slicer', thicknessMm: 2, capacityKgHr: 800 }],
        packingStandards: [{ id: 1, machine: 'Thermoformer', packSize: '200g', format: 'Vacuum Pack', sfgSize: 'Sliced', capacityKgHr: 600 }],
        packVariants: []
    },
    {
        id: 'STD-004', name: 'Cheese Sausage', category: 'Sausage', rawWeightPerBatch: 150, yieldPercent: 92, status: 'Active', updateDate: '27/02/2025',
        mixingStandards: [{ id: 1, machine: 'Vacuum Mixer', batter: 'Cheese Sausage Formula', batchPerCycle: 1, cycleTimeMin: 15, yieldPercent: 100 }],
        formingStandards: [{ id: 1, batter: 'Cheese Formula', size: 'Standard', type: 'Co-Extrusion', casing: 'Collagen', stuffed: true, capacityKgHr: 1800 }],
        cookingStandards: [{ id: 1, oven: 'Smoke House 6T', program: 'Smoke_Cheese', cycleTimeMin: 100, capacityBatch: 10 }],
        coolingStandards: [{ id: 1, unit: 'Rapid Chill Tunnel', program: 'Shower_Std', cycleTimeMin: 60, capacityBatch: 10 }],
        peelingStandards: [],
        cuttingStandards: [],
        packingStandards: [{ id: 1, machine: 'Thermoformer', packSize: '500g', format: 'Bag', sfgSize: 'Standard', capacityKgHr: 900 }],
        packVariants: []
    }
];
