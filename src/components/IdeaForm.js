import React, { useState } from 'react';
import { supabase } from '../App';

const IdeaForm = ({ onIdeaAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('RPL');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !description) {
      alert('Judul dan deskripsi harus diisi');
      return;
    }

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      alert('Silakan login untuk membagikan ide');
      return;
    }

    let imageUrl = null;

    // Upload image if exists
    if (image) {
      setUploading(true);
      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('idea-images')
        .upload(filePath, image);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        setUploading(false);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('idea-images')
        .getPublicUrl(filePath);

      imageUrl = publicUrl;
      setUploading(false);
    }

    // Insert idea into database
    const { data, error } = await supabase
      .from('ideas')
      .insert([
        { 
          title, 
          description, 
          department, 
          image_url: imageUrl,
          user_id: user.id 
        }
      ])
      .select();

    if (error) {
      console.error('Error adding idea:', error);
    } else {
      onIdeaAdded(data[0]);
      setTitle('');
      setDescription('');
      setDepartment('RPL');
      setImage(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 transition-colors duration-300">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Bagikan Ide Inovatifmu</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="title">
            Judul Ide
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 dark:bg-gray-700 dark:text-white"
            placeholder="Masukkan judul ide inovatifmu"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="description">
            Deskripsi Ide
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 dark:bg-gray-700 dark:text-white"
            placeholder="Jelaskan ide inovatifmu secara detail"
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="department">
            Jurusan
          </label>
          <select
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="RPL">Rekayasa Perangkat Lunak (RPL)</option>
            <option value="TKJ">Teknik Komputer dan Jaringan (TKJ)</option>
            <option value="PG">Pengembangan Gim (PG)</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="image">
            Upload Gambar (Opsional)
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <button
          type="submit"
          disabled={uploading}
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {uploading ? 'Mengupload...' : 'Bagikan Ide'}
        </button>
      </form>
    </div>
  );
};

export default IdeaForm;
