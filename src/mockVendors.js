// Mock vendor data: 3 vendors per category, per location
const locations = ['Manila', 'Clark', 'Cebu', 'Davao', 'Bacolod', 'GenSan', 'Subic'];

const categoryVendors = {
  'IT & Computers': [
    'PhilTech Solutions', 'CyberNode Systems', 'DataPeak IT',
    'CloudBridge PH', 'NetVault Technologies', 'ByteForce Inc.',
    'InfoCore Systems', 'DigiServ Tech', 'MegaByte Solutions',
    'PrimeStack IT', 'TechWave Corp', 'SilverLink Systems',
    'CodePath Solutions', 'ZenithCore IT', 'PixelForge Tech',
    'ApexNet Computing', 'NovaTech PH', 'GridPoint Systems',
    'CoreSync IT', 'LogicHub Technologies', 'SmartEdge Systems',
  ],
  'Office Supplies': [
    'SupplyHive PH', 'PaperTrail Corp', 'OfficeMate Express',
    'DeskFlow Supplies', 'PrintWorks Manila', 'StockPoint Trading',
    'BulkSource Office', 'WriteLine Supplies', 'ClearDesk Trading',
    'ProStock PH', 'OfficePrime Supplies', 'PageMaster Trading',
    'InkWell Supplies', 'ShelfReady Corp', 'SmartStock Office',
    'PenPoint Trading', 'FileFirst Supplies', 'DeskEdge PH',
    'TopShelf Supplies', 'PaperVault Corp', 'SupplyLine Express',
  ],
  'Facilities & Maintenance': [
    'CleanSweep Services', 'BuildRight Maintenance', 'FacilityPro PH',
    'SparkClean Corp', 'FixIt Solutions', 'GreenKeep Facilities',
    'PrimeClean Services', 'StructureCare PH', 'AllFix Maintenance',
    'ShineBright Corp', 'SafeSpace Facilities', 'MaintainIt Services',
    'EverClean PH', 'FreshStart Maintenance', 'SolidBase Facilities',
    'ClearView Services', 'TopNotch Maintenance', 'UrbanCare Facilities',
    'ProShine Services', 'WellKept Corp', 'FacilityEdge PH',
  ],
  'Security Services': [
    'ShieldForce Security', 'GuardianPro Services', 'SecureZone PH',
    'IronGate Security', 'WatchTower Corp', 'SafeHands Security',
    'EliteGuard Services', 'FortKnox Security PH', 'VanguardShield Corp',
    'TrustLock Security', 'SentryPoint Services', 'ArmorEdge Security',
    'BlueShield Guard', 'PatrolPro PH', 'DefendAll Security',
    'NightWatch Corp', 'AlertForce Services', 'SecureLine PH',
    'ProGuard Security', 'LockDown Services', 'SafeNet Security',
  ],
  'Catering & Food': [
    'FlavorHub Catering', 'FeastLine PH', 'GoldenPlate Services',
    'TasteWorks Catering', 'MealCraft Corp', 'FreshBite PH',
    'BanquetPro Services', 'SavorKitchen Catering', 'PlateFull Corp',
    'SpiceRoute Catering', 'DineRight PH', 'HarvestTable Services',
    'ChefLine Catering', 'EatWell Corp', 'GreenFork PH',
    'PrimePlate Catering', 'FoodFirst Services', 'TableReady Corp',
    'DelishBox Catering', 'CuisinePro PH', 'MealDrop Services',
  ],
  'HR & Recruitment': [
    'TalentBridge PH', 'HireRight Solutions', 'PeoplePrime Corp',
    'StaffLink Recruitment', 'CareerPath PH', 'TeamBuild Solutions',
    'RecruitEdge Corp', 'WorkForce Connect', 'TalentCore PH',
    'HirePro Solutions', 'PeopleFirst Recruitment', 'JobSync Corp',
    'StaffPro PH', 'TalentHive Solutions', 'SmartHire Recruitment',
    'PeopleBridge Corp', 'CareerForge PH', 'TeamSource Solutions',
    'WorkReady Recruitment', 'HireWave Corp', 'TalentNet PH',
  ],
  'Telecommunications': [
    'SignalPeak Telecom', 'ConnectPro PH', 'WaveLink Communications',
    'TeleCore Solutions', 'NetBridge Telecom', 'CallPath PH',
    'FiberEdge Communications', 'LinkUp Telecom', 'VoiceNet PH',
    'DataStream Telecom', 'CommsLine Solutions', 'SkyLink PH',
    'TeleBridge Corp', 'WirePro Communications', 'SignalPath Telecom',
    'ConnectEdge PH', 'NetPulse Telecom', 'FreqLink Solutions',
    'TeleWave Corp', 'GridComm PH', 'PulseLine Telecom',
  ],
  'Transportation & Logistics': [
    'SwiftHaul Logistics', 'CargoLink PH', 'DriveForce Transport',
    'FreightPro Solutions', 'MoveIt Logistics', 'RouteMax PH',
    'TransitEdge Corp', 'LoadStar Logistics', 'QuickShip PH',
    'HaulPro Transport', 'PathWay Logistics', 'CargoNet PH',
    'FleetLine Transport', 'ShipReady Logistics', 'SpeedRoute PH',
    'TransCore Corp', 'LogiTrack Solutions', 'MoveRight PH',
    'CargoEdge Transport', 'DeliverPro Logistics', 'RoadLink PH',
  ],
};

function generateMockVendors() {
  const vendors = [];
  let id = 1;

  for (const [category, names] of Object.entries(categoryVendors)) {
    let nameIndex = 0;
    for (const location of locations) {
      for (let i = 0; i < 3; i++) {
        const level = [1, 2, 3][Math.floor(Math.random() * 3)];
        const score = level > 1 ? parseFloat((Math.random() * 40 + 60).toFixed(1)) : null;
        const projects = level === 3 ? Math.floor(Math.random() * 5) + 3 : 0;
        const vouched = level === 3 ? Math.min(projects, Math.floor(Math.random() * 4) + 1) : 0;

        vendors.push({
          id: `mock-${id}`,
          name: names[nameIndex % names.length],
          level,
          levelName: level === 3 ? 'Certified' : level === 2 ? 'Validating' : 'Qualify',
          category,
          location,
          score,
          projects,
          vouched,
        });

        id++;
        nameIndex++;
      }
    }
  }

  return vendors;
}

export const mockVendors = generateMockVendors();
