export interface Stadium {
  id: string;
  name: string;
  city: string;
  state: string;
  capacity: number;
  type: 'Cricket' | 'Football' | 'Hockey' | 'Multi-purpose' | 'Athletics';
}

export const stadiums: Stadium[] = [
  // --- GUJARAT ---
  {
    id: 'narendra-modi-ahmedabad',
    name: 'Narendra Modi Stadium',
    city: 'Ahmedabad',
    state: 'Gujarat',
    capacity: 132000,
    type: 'Cricket',
  },
  {
    id: 'sca-stadium-rajkot',
    name: 'Saurashtra Cricket Association Stadium',
    city: 'Rajkot',
    state: 'Gujarat',
    capacity: 28000,
    type: 'Cricket',
  },

  // --- WEST BENGAL ---
  {
    id: 'salt-lake-kolkata',
    name: 'Vivekananda Yuba Bharati Krirangan (Salt Lake Stadium)',
    city: 'Kolkata',
    state: 'West Bengal',
    capacity: 85000,
    type: 'Football',
  },
  {
    id: 'eden-gardens-kolkata',
    name: 'Eden Gardens',
    city: 'Kolkata',
    state: 'West Bengal',
    capacity: 68000,
    type: 'Cricket',
  },

  // --- DELHI ---
  {
    id: 'jln-delhi',
    name: 'Jawaharlal Nehru Stadium',
    city: 'Delhi',
    state: 'Delhi NCR',
    capacity: 60254,
    type: 'Multi-purpose',
  },
  {
    id: 'arun-jaitley-delhi',
    name: 'Arun Jaitley Stadium',
    city: 'Delhi',
    state: 'Delhi NCR',
    capacity: 41000,
    type: 'Cricket',
  },
  {
    id: 'dhyan-chand-delhi',
    name: 'Major Dhyan Chand National Stadium',
    city: 'Delhi',
    state: 'Delhi NCR',
    capacity: 16200,
    type: 'Hockey',
  },

  // --- MAHARASHTRA ---
  {
    id: 'wankhede-mumbai',
    name: 'Wankhede Stadium',
    city: 'Mumbai',
    state: 'Maharashtra',
    capacity: 33108,
    type: 'Cricket',
  },
  {
    id: 'brabourne-mumbai',
    name: 'Brabourne Stadium',
    city: 'Mumbai',
    state: 'Maharashtra',
    capacity: 20000,
    type: 'Cricket',
  },
  {
    id: 'dy-patil-navi-mumbai',
    name: 'DY Patil Stadium',
    city: 'Navi Mumbai',
    state: 'Maharashtra',
    capacity: 55000,
    type: 'Multi-purpose',
  },
  {
    id: 'mca-pune',
    name: 'Maharashtra Cricket Association Stadium',
    city: 'Pune',
    state: 'Maharashtra',
    capacity: 37406,
    type: 'Cricket',
  },

  // --- KARNATAKA ---
  {
    id: 'chinnaswamy-bengaluru',
    name: 'M. Chinnaswamy Stadium',
    city: 'Bengaluru',
    state: 'Karnataka',
    capacity: 40000,
    type: 'Cricket',
  },
  {
    id: 'kanteerava-bengaluru',
    name: 'Sree Kanteerava Stadium',
    city: 'Bengaluru',
    state: 'Karnataka',
    capacity: 25800,
    type: 'Athletics',
  },

  // --- TAMIL NADU ---
  {
    id: 'ma-chidambaram-chennai',
    name: 'M. A. Chidambaram Stadium',
    city: 'Chennai',
    state: 'Tamil Nadu',
    capacity: 50000,
    type: 'Cricket',
  },
  {
    id: 'mayor-radhakrishnan-chennai',
    name: 'Mayor Radhakrishnan Stadium',
    city: 'Chennai',
    state: 'Tamil Nadu',
    capacity: 8600,
    type: 'Hockey',
  },

  // --- KERALA ---
  {
    id: 'greenfield-trivandrum',
    name: 'Greenfield International Stadium',
    city: 'Thiruvananthapuram',
    state: 'Kerala',
    capacity: 50000,
    type: 'Multi-purpose',
  },
  {
    id: 'jln-kochi',
    name: 'Jawaharlal Nehru International Stadium',
    city: 'Kochi',
    state: 'Kerala',
    capacity: 40000,
    type: 'Multi-purpose',
  },

  // --- TELANGANA & ANDHRA PRADESH ---
  {
    id: 'rajiv-gandhi-hyderabad',
    name: 'Rajiv Gandhi International Cricket Stadium',
    city: 'Hyderabad',
    state: 'Telangana',
    capacity: 55000,
    type: 'Cricket',
  },
  {
    id: 'balayogi-hyderabad',
    name: 'G. M. C. Balayogi Athletic Stadium',
    city: 'Hyderabad',
    state: 'Telangana',
    capacity: 30000,
    type: 'Athletics',
  },
  {
    id: 'aca-vdca-vizag',
    name: 'Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium',
    city: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    capacity: 25000,
    type: 'Cricket',
  },

  // --- NORTH INDIA (Punjab, HP, UP) ---
  {
    id: 'is-bindra-mohali',
    name: 'Inderjit Singh Bindra Stadium',
    city: 'Mohali',
    state: 'Punjab',
    capacity: 26000,
    type: 'Cricket',
  },
  {
    id: 'hpca-dharamshala',
    name: 'HPCA Stadium',
    city: 'Dharamshala',
    state: 'Himachal Pradesh',
    capacity: 23000,
    type: 'Cricket',
  },
  {
    id: 'ekana-lucknow',
    name: 'Ekana Cricket Stadium',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    capacity: 50000,
    type: 'Cricket',
  },
  {
    id: 'green-park-kanpur',
    name: 'Green Park Stadium',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    capacity: 32000,
    type: 'Cricket',
  },

  // --- ODISHA ---
  {
    id: 'kalinga-bhubaneswar',
    name: 'Kalinga Stadium',
    city: 'Bhubaneswar',
    state: 'Odisha',
    capacity: 15000,
    type: 'Multi-purpose',
  },
  {
    id: 'birsa-munda-rourkela',
    name: 'Birsa Munda International Hockey Stadium',
    city: 'Rourkela',
    state: 'Odisha',
    capacity: 20000,
    type: 'Hockey',
  },
  {
    id: 'barabati-cuttack',
    name: 'Barabati Stadium',
    city: 'Cuttack',
    state: 'Odisha',
    capacity: 45000,
    type: 'Cricket',
  },

  // --- RAJASTHAN & MP ---
  {
    id: 'sms-jaipur',
    name: 'Sawai Mansingh Stadium',
    city: 'Jaipur',
    state: 'Rajasthan',
    capacity: 30000,
    type: 'Cricket',
  },
  {
    id: 'holkar-indore',
    name: 'Holkar Cricket Stadium',
    city: 'Indore',
    state: 'Madhya Pradesh',
    capacity: 30000,
    type: 'Cricket',
  },

  // --- NORTH EAST ---
  {
    id: 'barsapara-guwahati',
    name: 'Barsapara Cricket Stadium',
    city: 'Guwahati',
    state: 'Assam',
    capacity: 40000,
    type: 'Cricket',
  },
  {
    id: 'ig-guwahati',
    name: 'Indira Gandhi Athletic Stadium',
    city: 'Guwahati',
    state: 'Assam',
    capacity: 25000,
    type: 'Football',
  },
  {
    id: 'khuman-lampak-imphal',
    name: 'Khuman Lampak Main Stadium',
    city: 'Imphal',
    state: 'Manipur',
    capacity: 30000,
    type: 'Football',
  },

  // --- GOA & OTHERS ---
  {
    id: 'fatorda-goa',
    name: 'Fatorda Stadium',
    city: 'Margao',
    state: 'Goa',
    capacity: 19000,
    type: 'Football',
  },
  {
    id: 'jsca-ranchi',
    name: 'JSCA International Stadium Complex',
    city: 'Ranchi',
    state: 'Jharkhand',
    capacity: 50000,
    type: 'Cricket',
  }
];
