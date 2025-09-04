import { NextResponse } from 'next/server'

const students = [
  {
    id: 1,
    name: 'Ahmad Fauzi Rahman',
    department: 'RPL',
    skill: 'Full Stack Developer',
    level: 95,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    achievements: ['Juara 1 Hackathon Nasional 2024', 'Best Frontend Developer Award'],
    projects: ['E-Learning Platform', 'Mobile Banking App', 'IoT Dashboard'],
    skills: {
      frontend: 95,
      backend: 92,
      mobile: 88,
      database: 90
    },
    social: {
      github: 'ahmad-fauzi',
      linkedin: 'ahmad-fauzi-dev',
      portfolio: 'https://ahmadfauzi.dev'
    }
  },
  {
    id: 2,
    name: 'Siti Nurhaliza Putri',
    department: 'TKJ',
    skill: 'Network Security Specialist',
    level: 88,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b278?w=150&h=150&fit=crop&crop=face',
    achievements: ['Cisco Certified Network Associate', 'Ethical Hacker Certification'],
    projects: ['Network Monitoring System', 'Firewall Configuration Tool', 'Penetration Testing Suite'],
    skills: {
      networking: 95,
      security: 90,
      server_admin: 85,
      troubleshooting: 92
    },
    social: {
      github: 'siti-nurhaliza',
      linkedin: 'siti-nurhaliza-network',
      portfolio: 'https://sitinurhaliza.net'
    }
  },
  {
    id: 3,
    name: 'Budi Santoso Wijaya',
    department: 'PG',
    skill: 'Game Designer & Developer',
    level: 92,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    achievements: ['Winner Indonesia Game Developer Summit 2024', 'Unity Certified Developer'],
    projects: ['RPG Adventure Game', 'Educational VR Experience', '2D Platformer Mobile Game'],
    skills: {
      game_design: 94,
      programming: 90,
      art_design: 88,
      project_management: 85
    },
    social: {
      github: 'budi-gamedev',
      linkedin: 'budi-santoso-gamedev',
      portfolio: 'https://budigames.dev'
    }
  },
  {
    id: 4,
    name: 'Dewi Sartika Maharani',
    department: 'RPL',
    skill: 'Mobile App Developer',
    level: 90,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    achievements: ['Google Developer Student Club Lead', 'Flutter Developer Expert'],
    projects: ['Health Tracking App', 'E-Commerce Mobile App', 'Social Media Platform'],
    skills: {
      flutter: 95,
      react_native: 87,
      ui_ux: 93,
      firebase: 89
    },
    social: {
      github: 'dewi-sartika',
      linkedin: 'dewi-sartika-mobile',
      portfolio: 'https://dewisartika.dev'
    }
  },
  {
    id: 5,
    name: 'Rizki Maulana Pratama',
    department: 'TKJ',
    skill: 'Cloud Infrastructure Engineer',
    level: 87,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    achievements: ['AWS Certified Solutions Architect', 'Docker & Kubernetes Expert'],
    projects: ['Auto-scaling Web Service', 'Microservices Architecture', 'CI/CD Pipeline Setup'],
    skills: {
      aws: 90,
      docker: 92,
      kubernetes: 88,
      devops: 85
    },
    social: {
      github: 'rizki-cloud',
      linkedin: 'rizki-maulana-cloud',
      portfolio: 'https://rizkicloud.dev'
    }
  },
  {
    id: 6,
    name: 'Maya Angelina Putri',
    department: 'PG',
    skill: '3D Artist & Animator',
    level: 91,
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    achievements: ['3D Animation Competition Winner 2024', 'Blender Foundation Certified'],
    projects: ['3D Character Modeling', 'Game Environment Design', 'Animation Short Film'],
    skills: {
      modeling: 95,
      animation: 90,
      texturing: 88,
      rendering: 92
    },
    social: {
      github: 'maya-3dart',
      linkedin: 'maya-angelina-3d',
      portfolio: 'https://maya3dart.com'
    }
  }
]

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department')
    const limit = searchParams.get('limit')
    
    await new Promise(resolve => setTimeout(resolve, 100))
    
    let filteredStudents = students
    
    if (department) {
      filteredStudents = students.filter(student => 
        student.department.toLowerCase() === department.toLowerCase()
      )
    }
    
    if (limit) {
      filteredStudents = filteredStudents.slice(0, parseInt(limit))
    }
    
    return NextResponse.json(filteredStudents)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const newStudent = {
      id: students.length + 1,
      ...body,
      level: body.level || 0,
      achievements: body.achievements || [],
      projects: body.projects || [],
      skills: body.skills || {},
      social: body.social || {}
    }
    
    students.push(newStudent)
    
    return NextResponse.json(newStudent, { status: 201 })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    const index = students.findIndex(student => student.id === id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      )
    }
    
    students[index] = { ...students[index], ...updateData }
    
    return NextResponse.json(students[index])
  } catch (error) {
    console.error('Error updating student:', error)
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    )
  }
}
