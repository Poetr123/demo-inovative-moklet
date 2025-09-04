import { NextResponse } from 'next/server'

const innovations = [
  {
    id: 1,
    title: 'Smart Campus System',
    department: 'RPL',
    description: 'Sistem manajemen kampus pintar dengan IoT integration untuk monitoring fasilitas, absensi otomatis, dan manajemen sumber daya sekolah',
    author: 'Tim RPL 2024',
    likes: 45,
    technologies: ['React', 'Node.js', 'IoT', 'MongoDB'],
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop'
  },
  {
    id: 2,
    title: 'Network Security Dashboard',
    department: 'TKJ',
    description: 'Dashboard monitoring keamanan jaringan real-time dengan deteksi intrusi dan analisis traffic berbasis AI',
    author: 'Tim TKJ 2024',
    likes: 38,
    technologies: ['Python', 'Flask', 'TensorFlow', 'Wireshark'],
    status: 'in_progress',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop'
  },
  {
    id: 3,
    title: 'Educational VR Game',
    department: 'PG',
    description: 'Game edukasi berbasis Virtual Reality untuk pembelajaran interaktif mata pelajaran sains dan matematika',
    author: 'Tim PG 2024',
    likes: 52,
    technologies: ['Unity', 'C#', 'VR SDK', 'Blender'],
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=400&h=250&fit=crop'
  },
  {
    id: 4,
    title: 'AI Chatbot Assistant',
    department: 'RPL',
    description: 'Asisten virtual dengan Natural Language Processing untuk membantu siswa dalam proses pembelajaran dan administrasi',
    author: 'Siswa RPL Angkatan 2023',
    likes: 41,
    technologies: ['Python', 'TensorFlow', 'NLP', 'FastAPI'],
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=250&fit=crop'
  },
  {
    id: 5,
    title: 'Cloud Infrastructure Monitor',
    department: 'TKJ',
    description: 'Sistem monitoring infrastruktur cloud berbasis web dengan alert system dan predictive maintenance',
    author: 'Siswa TKJ Angkatan 2023',
    likes: 33,
    technologies: ['Docker', 'Kubernetes', 'Prometheus', 'Grafana'],
    status: 'in_progress',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop'
  },
  {
    id: 6,
    title: 'Mobile Learning Game',
    department: 'PG',
    description: 'Game pembelajaran mobile dengan sistem gamifikasi untuk meningkatkan motivasi belajar siswa',
    author: 'Siswa PG Angkatan 2023',
    likes: 47,
    technologies: ['Flutter', 'Firebase', 'Adobe XD', 'Unity'],
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=250&fit=crop'
  }
]

export async function GET() {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return NextResponse.json(innovations)
  } catch (error) {
    console.error('Error fetching innovations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch innovations' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const newInnovation = {
      id: innovations.length + 1,
      ...body,
      likes: 0,
      status: 'in_progress'
    }
    
    innovations.push(newInnovation)
    
    return NextResponse.json(newInnovation, { status: 201 })
  } catch (error) {
    console.error('Error creating innovation:', error)
    return NextResponse.json(
      { error: 'Failed to create innovation' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    const index = innovations.findIndex(innovation => innovation.id === id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Innovation not found' },
        { status: 404 }
      )
    }
    
    innovations[index] = { ...innovations[index], ...updateData }
    
    return NextResponse.json(innovations[index])
  } catch (error) {
    console.error('Error updating innovation:', error)
    return NextResponse.json(
      { error: 'Failed to update innovation' },
      { status: 500 }
    )
  }
}
