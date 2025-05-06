export const maintenanceItems = [
  {
    id: 'm1',
    title: 'Engine Oil Change',
    description: 'Regular engine oil change to maintain optimal performance and prevent engine damage.',
    dueDate: '2023-11-15',
    priority: 'high',
    status: 'pending',
    estimatedTime: '2 hours',
    category: 'Engine',
    instructions: [
      'Warm up the engine for 5-10 minutes',
      'Turn off the engine and locate the oil drain plug',
      'Place an oil pan under the drain plug and remove it',
      'Allow all oil to drain completely',
      'Replace the drain plug and tighten to specifications',
      'Remove the old oil filter and replace with a new one',
      'Add the recommended amount of new oil',
      'Start the engine and check for leaks',
      'Check oil level and top up if necessary'
    ],
    images: [
      'https://images.unsplash.com/photo-1635764759774-e2d23c6c8d3a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'm2',
    title: 'Hull Inspection',
    description: 'Thorough inspection of the hull for damage, fouling, or other issues that may affect performance.',
    dueDate: '2023-11-20',
    priority: 'medium',
    status: 'pending',
    estimatedTime: '3 hours',
    category: 'Hull',
    instructions: [
      'Remove the vessel from water if possible',
      'Clean the hull surface with fresh water',
      'Inspect the entire hull for cracks, blisters, or damage',
      'Check for signs of marine growth or fouling',
      'Inspect all through-hull fittings and seacocks',
      'Document any findings with photos',
      'Make repairs as necessary or schedule professional service'
    ],
    images: [
      'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540946485063-a40da27545f8?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'm3',
    title: 'Replace Fuel Filters',
    description: 'Replace primary and secondary fuel filters to ensure clean fuel delivery to the engine.',
    dueDate: '2023-11-10',
    priority: 'critical',
    status: 'in-progress',
    estimatedTime: '1 hour',
    category: 'Fuel System',
    instructions: [
      'Turn off the engine and locate the fuel filters',
      'Close the fuel supply valve',
      'Place a container under the filter to catch any spilled fuel',
      'Remove the old primary filter and replace with a new one',
      'Remove the old secondary filter and replace with a new one',
      'Open the fuel supply valve',
      'Bleed the fuel system according to manufacturer instructions',
      'Start the engine and check for leaks',
      'Dispose of old filters properly'
    ],
    images: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'm4',
    title: 'Battery Maintenance',
    description: 'Check battery condition, clean terminals, and ensure proper charging.',
    dueDate: '2023-11-25',
    priority: 'medium',
    status: 'pending',
    estimatedTime: '30 minutes',
    category: 'Electrical',
    instructions: [
      'Turn off all electrical systems',
      'Disconnect the negative terminal first, then the positive',
      'Inspect battery case for damage or leaks',
      'Clean terminals with a wire brush and baking soda solution',
      'Rinse with clean water and dry thoroughly',
      'Apply terminal protector spray',
      'Reconnect the positive terminal first, then the negative',
      'Check battery voltage with a multimeter',
      'Charge if necessary'
    ],
    images: [
      'https://images.unsplash.com/photo-1601987078664-2a2a78f6b0b5?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'm5',
    title: 'Propeller Inspection',
    description: 'Inspect propeller for damage, corrosion, or fouling that may affect performance.',
    dueDate: '2023-12-05',
    priority: 'high',
    status: 'pending',
    estimatedTime: '1 hour',
    category: 'Propulsion',
    instructions: [
      'Remove the vessel from water if possible',
      'Clean the propeller with fresh water',
      'Inspect for bent or damaged blades',
      'Check for signs of corrosion or electrolysis',
      'Inspect the propeller shaft and coupling',
      'Check for fishing line or debris wrapped around the shaft',
      'Apply anti-fouling paint if necessary',
      'Document any findings with photos'
    ],
    images: [
      'https://images.unsplash.com/photo-1588144822286-a6c320c4a0b3?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'm6',
    title: 'Safety Equipment Check',
    description: 'Inspect and test all safety equipment including life jackets, fire extinguishers, and flares.',
    dueDate: '2023-11-12',
    priority: 'critical',
    status: 'completed',
    estimatedTime: '2 hours',
    category: 'Safety',
    instructions: [
      'Check expiration dates on all safety equipment',
      'Inspect life jackets for damage or wear',
      'Test fire extinguishers according to manufacturer instructions',
      'Check flares and other signaling devices',
      'Inspect first aid kit and restock as needed',
      'Test bilge pumps and alarms',
      'Check navigation lights',
      'Verify VHF radio operation',
      'Update emergency contact information'
    ],
    images: [
      'https://images.unsplash.com/photo-1532634922-8fe0b757fb13?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'm7',
    title: 'Winterize Water Systems',
    description: 'Prepare freshwater and sanitation systems for winter storage to prevent freezing damage.',
    dueDate: '2023-12-15',
    priority: 'medium',
    status: 'pending',
    estimatedTime: '3 hours',
    category: 'Plumbing',
    instructions: [
      'Drain all freshwater tanks and lines',
      'Add non-toxic antifreeze to water system',
      'Run antifreeze through all faucets and showers',
      'Drain and flush holding tanks',
      'Add antifreeze to toilet and holding tanks',
      'Disconnect and drain water heater',
      'Remove and clean water filters',
      'Label all systems as winterized'
    ],
    images: [
      'https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=1000&auto=format&fit=crop'
    ]
  },
  {
    id: 'm8',
    title: 'Replace Impeller',
    description: 'Replace the raw water pump impeller to ensure proper engine cooling.',
    dueDate: '2023-11-18',
    priority: 'high',
    status: 'pending',
    estimatedTime: '1 hour',
    category: 'Cooling System',
    instructions: [
      'Turn off the engine and locate the raw water pump',
      'Close the seacock',
      'Remove the pump cover',
      'Remove the old impeller using impeller puller if necessary',
      'Inspect the pump housing for damage or debris',
      'Install the new impeller with lubricant',
      'Replace the pump cover with a new gasket if needed',
      'Open the seacock',
      'Start the engine and verify water flow'
    ],
    images: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1000&auto=format&fit=crop'
    ]
  }
];