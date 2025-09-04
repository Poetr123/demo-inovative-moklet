'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [innovations, setInnovations] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInnovations()
    fetchStudents()
  }, [])

  const fetchInnovations = async () => {
    try {
      const response = await fetch('/api/innovations')
      const data = await response.json()
      setInnovations(data)
    } catch (error) {
      console.error('Error fetching innovations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      const data = await response.json()
      setStudents(data)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="floating-shapes"></div>
      
      <nav 
        className="fixed w-full top-0 z-50 glass-morphism"
        x-data="{ isOpen: false, activeSection: 'home' }"
        x-init="
          window.addEventListener('scroll', () => {
            const sections = ['home', 'innovations', 'students', 'about'];
            const current = sections.find(section => {
              const element = document.getElementById(section);
              if (element) {
                const rect = element.getBoundingClientRect();
                return rect.top <= 100 && rect.bottom >= 100;
              }
            });
            if (current) activeSection = current;
          });
        "
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 telkom-gradient rounded-xl flex items-center justify-center">
                <i className="fas fa-graduation-cap text-white text-lg"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">SMK Telkom Malang</h1>
                <p className="text-xs attitude-text font-semibold">Attitude is Everything</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" 
                className="nav-link transition-all duration-300 px-3 py-2 rounded-lg"
                :class="activeSection === 'home' ? 'bg-telkom-red text-white' : 'text-gray-700 hover:text-telkom-red'"
              >
                Home
              </a>
              <a href="#innovations" 
                className="nav-link transition-all duration-300 px-3 py-2 rounded-lg"
                :class="activeSection === 'innovations' ? 'bg-telkom-red text-white' : 'text-gray-700 hover:text-telkom-red'"
              >
                Inovasi
              </a>
              <a href="#students" 
                className="nav-link transition-all duration-300 px-3 py-2 rounded-lg"
                :class="activeSection === 'students' ? 'bg-telkom-red text-white' : 'text-gray-700 hover:text-telkom-red'"
              >
                Siswa
              </a>
              <a href="#about" 
                className="nav-link transition-all duration-300 px-3 py-2 rounded-lg"
                :class="activeSection === 'about' ? 'bg-telkom-red text-white' : 'text-gray-700 hover:text-telkom-red'"
              >
                Tentang
              </a>
            </div>

            <button 
              className="md:hidden p-2"
              @click="isOpen = !isOpen"
            >
              <i :class="isOpen ? 'fas fa-times' : 'fas fa-bars'" className="text-gray-700"></i>
            </button>
          </div>

          <div 
            className="md:hidden overflow-hidden transition-all duration-300"
            x-show="isOpen"
            x-transition:enter="transition ease-out duration-200"
            x-transition:enter-start="opacity-0 transform -translate-y-2"
            x-transition:enter-end="opacity-100 transform translate-y-0"
          >
            <div className="py-4 space-y-2">
              <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-telkom-red">Home</a>
              <a href="#innovations" className="block px-3 py-2 text-gray-700 hover:text-telkom-red">Inovasi</a>
              <a href="#students" className="block px-3 py-2 text-gray-700 hover:text-telkom-red">Siswa</a>
              <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-telkom-red">Tentang</a>
            </div>
          </div>
        </div>
      </nav>

      <section id="home" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div 
              className="inline-block mb-6"
              x-data="{ text: '', fullText: 'Attitude is Everything', index: 0 }"
              x-init="
                setInterval(() => {
                  if (index <= fullText.length) {
                    text = fullText.slice(0, index);
                    index++;
                  } else {
                    setTimeout(() => {
                      index = 0;
                      text = '';
                    }, 2000);
                  }
                }, 150);
              "
            >
              <h2 className="text-4xl md:text-6xl font-bold attitude-text h-16" x-text="text"></h2>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Platform Inovasi Digital untuk mengembangkan kreativitas dan skill siswa SMK Telkom Malang
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <div className="glass-morphism p-6 rounded-2xl attitude-glow transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-telkom-red to-attitude-blue rounded-xl flex items-center justify-center">
                    <i className="fas fa-code text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">RPL</h3>
                    <p className="text-gray-600 text-sm">Rekayasa Perangkat Lunak</p>
                  </div>
                </div>
              </div>
              
              <div className="glass-morphism p-6 rounded-2xl attitude-glow transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-attitude-blue to-telkom-red rounded-xl flex items-center justify-center">
                    <i className="fas fa-network-wired text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">TKJ</h3>
                    <p className="text-gray-600 text-sm">Teknik Komputer Jaringan</p>
                  </div>
                </div>
              </div>
              
              <div className="glass-morphism p-6 rounded-2xl attitude-glow transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-telkom-red to-attitude-blue rounded-xl flex items-center justify-center">
                    <i className="fas fa-gamepad text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">PG</h3>
                    <p className="text-gray-600 text-sm">Pengembangan Gim</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="innovations" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Inovasi <span className="attitude-text">Terdepan</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Karya-karya inovatif dari siswa SMK Telkom Malang yang siap menghadapi tantangan masa depan
            </p>
          </div>

          <div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            x-data="{ 
              innovations: [],
              loading: true,
              async fetchInnovations() {
                this.loading = true;
                try {
                  const response = await fetch('/api/innovations');
                  this.innovations = await response.json();
                } catch (error) {
                  console.error('Error:', error);
                  this.innovations = [
                    { id: 1, title: 'Smart Campus System', department: 'RPL', description: 'Sistem manajemen kampus pintar dengan IoT integration', author: 'Tim RPL 2024', likes: 45 },
                    { id: 2, title: 'Network Security Dashboard', department: 'TKJ', description: 'Dashboard monitoring keamanan jaringan real-time', author: 'Tim TKJ 2024', likes: 38 },
                    { id: 3, title: 'Educational VR Game', department: 'PG', description: 'Game edukasi berbasis Virtual Reality untuk pembelajaran interaktif', author: 'Tim PG 2024', likes: 52 },
                    { id: 4, title: 'AI Chatbot Assistant', department: 'RPL', description: 'Asisten virtual dengan Natural Language Processing', author: 'Siswa RPL', likes: 41 },
                    { id: 5, title: 'Cloud Infrastructure Monitor', department: 'TKJ', description: 'Sistem monitoring infrastruktur cloud berbasis web', author: 'Siswa TKJ', likes: 33 },
                    { id: 6, title: 'Mobile Learning Game', department: 'PG', description: 'Game pembelajaran mobile dengan gamifikasi', author: 'Siswa PG', likes: 47 }
                  ];
                } finally {
                  this.loading = false;
                }
              }
            }"
            x-init="fetchInnovations()"
          >
            <template x-if="loading">
              <div className="col-span-full flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-telkom-red border-t-transparent rounded-full animate-spin"></div>
              </div>
            </template>

            <template x-for="innovation in innovations" :key="innovation.id">
              <div className="innovation-card glass-morphism p-6 rounded-2xl hover:attitude-glow cursor-pointer"
                   x-data="{ liked: false }"
                   @click="liked = !liked">
                <div className="flex justify-between items-start mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    :class="{
                      'bg-blue-500': innovation.department === 'RPL',
                      'bg-green-500': innovation.department === 'TKJ', 
                      'bg-purple-500': innovation.department === 'PG'
                    }"
                    x-text="innovation.department"
                  ></span>
                  <button 
                    className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                    :class="{ 'text-red-500 animate-pulse': liked }"
                  >
                    <i :class="liked ? 'fas fa-heart' : 'far fa-heart'"></i>
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2" x-text="innovation.title"></h3>
                <p className="text-gray-600 mb-4" x-text="innovation.description"></p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500" x-text="innovation.author"></span>
                  <div className="flex items-center space-x-1 text-red-500">
                    <i className="fas fa-heart text-xs"></i>
                    <span className="text-sm" x-text="innovation.likes + (liked ? 1 : 0)"></span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </section>

      <section id="students" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Siswa <span className="attitude-text">Berprestasi</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Profil siswa terbaik yang telah menunjukkan dedikasi dan prestasi luar biasa
            </p>
          </div>

          <div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            x-data="{
              students: [],
              loading: true,
              async fetchStudents() {
                this.loading = true;
                try {
                  const response = await fetch('/api/students');
                  this.students = await response.json();
                } catch (error) {
                  this.students = [
                    { id: 1, name: 'Ahmad Fauzi', department: 'RPL', skill: 'Full Stack Developer', level: 95, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
                    { id: 2, name: 'Siti Nurhaliza', department: 'TKJ', skill: 'Network Security', level: 88, avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b278?w=150&h=150&fit=crop&crop=face' },
                    { id: 3, name: 'Budi Santoso', department: 'PG', skill: 'Game Designer', level: 92, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
                    { id: 4, name: 'Dewi Sartika', department: 'RPL', skill: 'Mobile Developer', level: 90, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' }
                  ];
                } finally {
                  this.loading = false;
                }
              }
            }"
            x-init="fetchStudents()"
          >
            <template x-for="student in students" :key="student.id">
              <div className="glass-morphism p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300 hover:attitude-glow">
                <div className="relative mb-4">
                  <img 
                    :src="student.avatar" 
                    :alt="student.name"
                    className="w-20 h-20 rounded-full mx-auto border-4 border-white shadow-lg object-cover"
                  />
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-semibold text-white shadow-lg"
                      :class="{
                        'bg-blue-500': student.department === 'RPL',
                        'bg-green-500': student.department === 'TKJ',
                        'bg-purple-500': student.department === 'PG'
                      }"
                      x-text="student.department"
                    ></span>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-1" x-text="student.name"></h3>
                <p className="text-gray-600 text-sm mb-3" x-text="student.skill"></p>
                
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Skill Level</span>
                    <span x-text="student.level + '%'"></span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-telkom-red to-attitude-blue transition-all duration-1000"
                      :style="`width: ${student.level}%`"
                    ></div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </section>

      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Tentang <span className="attitude-text">SMK Telkom Malang</span>
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                SMK Telkom Malang adalah sekolah menengah kejuruan yang fokus pada teknologi informasi dan komunikasi. 
                Dengan motto "Attitude is Everything", kami mempersiapkan siswa untuk menjadi profesional yang kompeten 
                dan berkarakter di era digital.
              </p>
              
              <div className="space-y-4">
                <div 
                  className="flex items-center space-x-4"
                  x-data="{ count: 0, target: 500 }"
                  x-init="
                    const interval = setInterval(() => {
                      if (count < target) {
                        count += Math.ceil(target / 50);
                        if (count > target) count = target;
                      } else {
                        clearInterval(interval);
                      }
                    }, 50);
                  "
                >
                  <div className="w-12 h-12 telkom-gradient rounded-xl flex items-center justify-center">
                    <i className="fas fa-users text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800" x-text="count + '+'"></h3>
                    <p className="text-gray-600">Siswa Aktif</p>
                  </div>
                </div>
                
                <div 
                  className="flex items-center space-x-4"
                  x-data="{ count: 0, target: 3 }"
                  x-init="
                    setTimeout(() => {
                      const interval = setInterval(() => {
                        if (count < target) {
                          count++;
                        } else {
                          clearInterval(interval);
                        }
                      }, 200);
                    }, 500);
                  "
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-attitude-blue to-telkom-red rounded-xl flex items-center justify-center">
                    <i className="fas fa-graduation-cap text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800" x-text="count"></h3>
                    <p className="text-gray-600">Jurusan Unggulan</p>
                  </div>
                </div>
                
                <div 
                  className="flex items-center space-x-4"
                  x-data="{ count: 0, target: 15 }"
                  x-init="
                    setTimeout(() => {
                      const interval = setInterval(() => {
                        if (count < target) {
                          count++;
                        } else {
                          clearInterval(interval);
                        }
                      }, 100);
                    }, 1000);
                  "
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-telkom-red to-attitude-blue rounded-xl flex items-center justify-center">
                    <i className="fas fa-trophy text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800" x-text="count + '+'"></h3>
                    <p className="text-gray-600">Tahun Pengalaman</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div 
                className="glass-morphism p-8 rounded-3xl attitude-glow"
                x-data="{ 
                  skills: [
                    { name: 'Programming', level: 95 },
                    { name: 'Networking', level: 88 },
                    { name: 'Game Development', level: 92 },
                    { name: 'Problem Solving', level: 98 }
                  ],
                  animated: false 
                }"
                x-init="
                  setTimeout(() => {
                    animated = true;
                  }, 500);
                "
              >
                <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                  Kompetensi <span className="attitude-text">Utama</span>
                </h3>
                
                <div className="space-y-6">
                  <template x-for="(skill, index) in skills" :key="index">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-gray-700" x-text="skill.name"></span>
                        <span className="text-sm text-gray-600" x-text="skill.level + '%'"></span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full bg-gradient-to-r from-telkom-red to-attitude-blue transition-all duration-2000 ease-out"
                          :style="animated ? `width: ${skill.level}%` : 'width: 0%'"
                        ></div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-telkom-red to-attitude-blue rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-attitude-blue to-telkom-red rounded-full opacity-20 animate-bounce-slow"></div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 telkom-gradient rounded-xl flex items-center justify-center">
                  <i className="fas fa-graduation-cap text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold">SMK Telkom Malang</h3>
                  <p className="text-sm attitude-text font-semibold">Attitude is Everything</p>
                </div>
              </div>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Mempersiapkan generasi digital yang kompeten, kreatif, dan berkarakter 
                untuk menghadapi tantangan masa depan di era industri 4.0.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-telkom-red rounded-lg flex items-center justify-center hover:bg-telkom-dark-red transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-telkom-red rounded-lg flex items-center justify-center hover:bg-telkom-dark-red transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-telkom-red rounded-lg flex items-center justify-center hover:bg-telkom-dark-red transition-colors">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-telkom-red rounded-lg flex items-center justify-center hover:bg-telkom-dark-red transition-colors">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Jurusan</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Rekayasa Perangkat Lunak</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Teknik Komputer Jaringan</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Pengembangan Gim</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <i className="fas fa-map-marker-alt text-telkom-red"></i>
                  <span className="text-gray-300">Malang, Jawa Timur</span>
                </li>
                <li className="flex items-center space-x-2">
                  <i className="fas fa-phone text-telkom-red"></i>
                  <span className="text-gray-300">+62 xxx-xxxx-xxxx</span>
                </li>
                <li className="flex items-center space-x-2">
                  <i className="fas fa-envelope text-telkom-red"></i>
                  <span className="text-gray-300">info@smktelkom-mlg.sch.id</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              &copy; 2024 SMK Telkom Malang. Dibuat dengan ❤️ oleh Siswa RPL.
            </p>
          </div>
        </div>
      </footer>
      
      <button
        className="fixed bottom-6 right-6 w-14 h-14 telkom-gradient rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-all duration-300 attitude-glow"
        x-data="{ show: false }"
        x-init="
          window.addEventListener('scroll', () => {
            show = window.scrollY > 300;
          });
        "
        x-show="show"
        x-transition:enter="transition ease-out duration-200"
        x-transition:enter-start="opacity-0 transform scale-75"
        x-transition:enter-end="opacity-100 transform scale-100"
        @click="window.scrollTo({ top: 0, behavior: 'smooth' })"
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </div>
  )
}
