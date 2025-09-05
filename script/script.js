 // Supabase configuration
        
        
        // Initialize Supabase
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        function app() {
            return {
                darkMode: false,
                user: null,
                showLoginModal: false,
                showRegisterModal: false,
                isLoggingIn: false,
                isRegistering: false,
                isSubmitting: false,
                newIdea: {
                    name: '',
                    jurusan: '',
                    title: '',
                    description: '',
                    imageFile: null,
                    imagePreview: null
                },
                login: {
                    email: '',
                    password: ''
                },
                register: {
                    name: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                },
                ideas: [],
                quotes: [
                    {
                        text: "Attitude is a little thing that makes a big difference.",
                        author: "Winston Churchill"
                    },
                    {
                        text: "Your attitude, not your aptitude, will determine your altitude.",
                        author: "Zig Ziglar"
                    },
                    {
                        text: "Innovation distinguishes between a leader and a follower.",
                        author: "Steve Jobs"
                    },
                    {
                        text: "The only way to do great work is to love what you do.",
                        author: "Steve Jobs"
                    },
                    {
                        text: "Success is not the key to happiness. Happiness is the key to success.",
                        author: "Albert Schweitzer"
                    }
                ],
                currentQuote: {},
                notification: {
                    show: false,
                    message: '',
                    type: 'success' // 'success' or 'error'
                },
                async init() {
                    this.showRandomQuote();
                    const { data: { session } } = await supabase.auth.getSession();
                    this.user = session?.user ?? null;
                    await this.loadIdeas();
                    supabase.auth.onAuthStateChange((event, session) => {
                        console.log('Auth state changed:', event, session);
                        this.user = session?.user ?? null;
                        if (event === 'SIGNED_IN') {
                            this.showLoginModal = false;
                            this.showRegisterModal = false;
                            this.showNotification('Login berhasil!', 'success');
                            this.loadIdeas();
                        } else if (event === 'SIGNED_OUT') {
                            this.showNotification('Anda telah logout', 'success');
                        }
                    });
                },
                showRandomQuote() {
                    const randomIndex = Math.floor(Math.random() * this.quotes.length);
                    this.currentQuote = this.quotes[randomIndex];
                },
                async loadIdeas() {
                    try {
                        const { data: ideas, error } = await supabase
                            .from('ideas')
                                .select(`
                                    *,
                                    votes(count),
                                 user_votes:votes(user_id)
                                        `)
                                    .order('created_at', { ascending: false });                            
                        if (error) {
                            console.error('Error loading ideas:', error);
                            this.ideas = this.getSampleIdeas();
                            return;
                        }
                        this.ideas = ideas.map(idea => {
                            const hasLiked = this.user ? 
                                idea.user_votes.some(vote => vote.user_id === this.user.id) : 
                                false;
                                
                            return {
                                id: idea.id,
                                user_name: idea.user_name,
                                user_id: idea.user_id,
                                jurusan: idea.jurusan,
                                title: idea.title,
                                description: idea.description,
                                image_url: idea.image_url,
                                votes_count: idea.votes[0]?.count || 0,
                                hasLiked: hasLiked
                            };
                        });
                    } catch (error) {
                        console.error('Error loading ideas:', error);
                        this.ideas = this.getSampleIdeas();
                    }
                },
                getSampleIdeas() {
                    return [
                        {
                            id: 1,
                            user_name: "Ahmad RPL",
                            jurusan: "rpl",
                            title: "Aplikasi Management Tugas Sekolah",
                            description: "Aplikasi mobile untuk membantu siswa mengelola tugas sekolah dengan fitur reminder dan kolaborasi.",
                            image_url: null,
                            votes_count: 15,
                            hasLiked: false
                        },
                        {
                            id: 2,
                            user_name: "Sari TKJ",
                            jurusan: "tkj",
                            title: "Jaringan IoT untuk Smart Classroom",
                            description: "Implementasi jaringan Internet of Things untuk membuat ruang kelas pintar dengan kontrol otomatis.",
                            image_url: null,
                            votes_count: 12,
                            hasLiked: false
                        },
                        {
                            id: 3,
                            user_name: "Budi PG",
                            jurusan: "pg",
                            title: "Game Edukasi Sejarah Indonesia",
                            description: "Game mobile interaktif untuk mempelajari sejarah Indonesia dengan cara yang menyenangkan.",
                            image_url: null,
                            votes_count: 18,
                            hasLiked: false
                        }
                    ];
                },
                handleImageUpload(event) {
                    const file = event.target.files[0];
                    if (file) {
                        if (!file.type.match('image.*')) {
                            this.showNotification('Harus memilih file gambar', 'error');
                            return;
                        }
                        if (file.size > 2 * 1024 * 1024) {
                            this.showNotification('Ukuran gambar maksimal 2MB', 'error');
                            return;
                        }
                        
                        this.newIdea.imageFile = file;
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            this.newIdea.imagePreview = e.target.result;
                        };
                        reader.readAsDataURL(file);
                    }
                },
                removeImage() {
                    this.newIdea.imageFile = null;
                    this.newIdea.imagePreview = null;
                },
               async addIdea() {
                if (!this.user) {
              this.showNotification('Silakan login terlebih dahulu', 'error');
                return;
                }
              if (this.newIdea.title.length < 5 || this.newIdea.title.length > 70) {
             this.showNotification('Judul harus 5-70 karakter', 'error');
                return;
                }    
                if (this.newIdea.description.length < 15 || this.newIdea.description.length > 3000) {
                this.showNotification('Deskripsi harus 15-3000 karakter', 'error');
                    return;
                        }
                this.isSubmitting = true;
                    try {
                let imageUrl = null;
                        if (this.newIdea.imageFile) {
                            const fileExt = this.newIdea.imageFile.name.split('.').pop();
                            const fileName = `${Math.random()}.${fileExt}`;
                            const filePath = `idea-images/${fileName}`;
                            
                            const { error: uploadError } = await supabase.storage
                                .from('ideas')
                                .upload(filePath, this.newIdea.imageFile);
                                
                            if (uploadError) throw uploadError;
                            const { data: { publicUrl } } = supabase.storage
                                .from('ideas')
                                .getPublicUrl(filePath);
                                
                            imageUrl = publicUrl;
                        }
                        const { error } = await supabase
                            .from('ideas')
                            .insert([
                                {
                                    user_id: this.user.id,
                                    user_name: this.newIdea.name || this.user.user_metadata.full_name || this.user.email,
                                    jurusan: this.newIdea.jurusan,
                                    title: this.newIdea.title,
                                    description: this.newIdea.description,
                                    image_url: imageUrl
                                }
                            ]);
                            
                        if (error) throw error;
                        this.newIdea = {
                            name: '',
                            jurusan: '',
                            title: '',
                            description: '',
                            imageFile: null,
                            imagePreview: null
                        };
                        await this.loadIdeas();
                        
                        this.showNotification('Ide berhasil dikirim!', 'success');
                    } catch (error) {
                        console.error('Error adding idea:', error);
                        this.showNotification('Gagal mengirim ide: ' + error.message, 'error');
                    } finally {
                        this.isSubmitting = false;
                    }
                },
             async deleteIdea(ideaId, index) {
                if (!confirm("Apakah kamu yakin ingin menghapus ide ini?")) return;
                    try {
                    const { error } = await supabase
                    .from('ideas')
                     .delete()
                    .eq('id', ideaId)
                    .eq('user_id', this.user.id);
                 if (error) throw error;
                this.ideas.splice(index, 1);
                    this.showNotification("Ide berhasil dihapus", "success");
                    } catch (error) {
                    console.error("Error deleting idea:", error);
                this.showNotification("Gagal menghapus ide: " + error.message, "error");
                    }
            },


                async toggleLike(ideaId, index) {
                    if (!this.user) {
                        this.showNotification('Silakan login terlebih dahulu', 'error');
                        return;
                    }
                    
                    try {
                        const idea = this.ideas[index];
                        
                        if (idea.hasLiked) {
                            // Unlike
                            const { error } = await supabase
                                .from('votes')
                                .delete()
                                .eq('idea_id', ideaId)
                                .eq('user_id', this.user.id);
                                
                            if (error) throw error;
                            
                            this.ideas[index].votes_count--;
                            this.ideas[index].hasLiked = false;
                        } else {
                            // Like
                            const { error } = await supabase
                                .from('votes')
                                .insert([
                                    { idea_id: ideaId, user_id: this.user.id }
                                ]);
                                
                            if (error) throw error;
                            
                            this.ideas[index].votes_count++;
                            this.ideas[index].hasLiked = true;
                        }
                    } catch (error) {
                        console.error('Error toggling like:', error);
                        this.showNotification('Gagal melakukan vote', 'error');
                    }
                },
                async signIn() {
                    this.isLoggingIn = true;
                    
                    try {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(this.login.email)) {
                            throw new Error('Format email tidak valid');
                        }
                        
                        if (this.login.password.length < 6) {
                            throw new Error('Password minimal 6 karakter');
                        }
                        
                        const { data, error } = await supabase.auth.signInWithPassword({
                            email: this.login.email,
                            password: this.login.password,
                        });
                        
                        if (error) throw error;
                        
                        this.login = {
                            email: '',
                            password: ''
                        };
                    } catch (error) {
                        console.error('Error signing in:', error);
                        this.showNotification(error.message, 'error');
                    } finally {
                        this.isLoggingIn = false;
                    }
                },
                async signUp() {
                    if (this.register.password !== this.register.confirmPassword) {
                        this.showNotification('Konfirmasi password tidak sesuai', 'error');
                        return;
                    }
                    
                    if (this.register.password.length < 6) {
                        this.showNotification('Password minimal 6 karakter', 'error');
                        return;
                    }
                    
                    this.isRegistering = true;
                    
                    try {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(this.register.email)) {
                            throw new Error('Format email tidak valid');
                        }
                        
                        const { data, error } = await supabase.auth.signUp({
                            email: this.register.email,
                            password: this.register.password,
                            options: {
                                data: {
                                    full_name: this.register.name
                                }
                            }
                        });
                        
                        if (error) throw error;
                        
                        this.showNotification('Registrasi berhasil! Verifikasi akun mu di Email!', 'success');
                        this.showRegisterModal = false;
                        this.register = {
                            name: '',
                            email: '',
                            password: '',
                            confirmPassword: ''
                        };
                    } catch (error) {
                        console.error('Error signing up:', error);
                        this.showNotification(error.message, 'error');
                    } finally {
                        this.isRegistering = false;
                    }
                },
                async signOut() {
                    try {
                        const { error } = await supabase.auth.signOut();
                        if (error) throw error;
                    } catch (error) {
                        console.error('Error signing out:', error);
                        this.showNotification('Gagal logout', 'error');
                    }
                },
                 showNotification(message, type = 'success') {
                    this.notification = {
                        show: true,
                        message,
                        type
                    };
                    
                    // Auto hide
                    setTimeout(() => {
                        this.notification.show = false;
                    }, 5000);
                },

                getJurusanName(jurusanCode) {
                    const jurusanMap = {
                        'rpl': 'RPL',
                        'tkj': 'TKJ',
                        'pg': 'Pengembangan Gim'
                    };
                    return jurusanMap[jurusanCode] || 'Unknown';
                },
                get topIdeas() {
                    return [...this.ideas]
                        .sort((a, b) => b.votes_count - a.votes_count)
                        .slice(0, 3);
                }
            };
    }
