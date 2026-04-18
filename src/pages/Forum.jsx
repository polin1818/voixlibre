import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../api/client';
import { 
  Search, MessageSquare, Heart, Shield, PlusCircle, 
  Users, Loader2, X, Send, AlertCircle, Smile, Share2
} from 'lucide-react';

// Utilisation de React Icons pour les réseaux sociaux (plus stable pour les logos)
import { FaWhatsapp, FaFacebook, FaTwitter } from 'react-icons/fa';

// Liste d'emojis enrichie avec des options de tristesse/empathie
const QUICK_EMOJIS = ["❤️", "🙏", "🫂", "💪", "✨", "🕯️", "🤝", "😢", "💔", "😪"];

const ForumVoixLibre = () => {
  const [posts, setPosts]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState('Tous les sujets');
  const [search, setSearch]       = useState('');
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postContent, setPostContent]   = useState('');
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const [openPostId, setOpenPostId]     = useState(null);

const categories = [
  { label: 'Tous les sujets',        value: null },
  { label: 'Violence physique',      value: 'violence_physique' },
  { label: 'Violences conjugales',   value: 'violence_conjugale' },
  { label: 'Harcèlement',            value: 'harcelement' },
  { label: 'Abus enfant',            value: 'abus_enfant' },
  { label: 'Corruption',             value: 'corruption' },
  { label: 'kidnapping',             value: 'kidnapping' },
  { label: 'Soutien & Entraide',     value: 'entraide' },
  { label: 'Assistance Juridique',   value: 'autre' },
];

  useEffect(() => { fetchPosts(); }, [activeTab]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const selectedCat   = categories.find(c => c.label === activeTab)?.value;
      const categoryParam = selectedCat ? `&categorie=${selectedCat}` : '';
      const res = await apiClient.get(`/posts?page=1&limit=10${categoryParam}`);
      setPosts(res.data.data || []);
    } catch (err) {
      console.error('Erreur fetchPosts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.target);
      await apiClient.post('/posts', {
        titre: formData.get('titre'),
        categorie: formData.get('categorie'),
        contenu: postContent,
      });
      setIsModalOpen(false);
      setPostContent('');
      fetchPosts();
    } catch (err) {
      alert("Erreur de publication");
    } finally {
      setIsSubmitting(false);
    }
  };

  const postsFiltres = posts.filter(p =>
    p.titre?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 lg:pb-12 font-sans">
      {/* Header Mobile */}
      <div className="lg:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 sticky top-0 z-40 flex justify-between items-center">
        <h1 className="text-xl font-black text-blue-600 italic">VoixLibre</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white p-2 rounded-full shadow-lg">
          <PlusCircle size={20} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Gauche */}
        <aside className="lg:col-span-3 hidden lg:block">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 sticky top-24 shadow-sm">
            <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2 uppercase text-[10px] tracking-widest text-slate-400">
              <Users size={16} /> Catégories
            </h3>
            <nav className="space-y-2">
              {categories.map(cat => (
                <button
                  key={cat.label}
                  onClick={() => setActiveTab(cat.label)}
                  className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                    activeTab === cat.label ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Flux Principal */}
        <main className="col-span-1 lg:col-span-6 space-y-6 sm:space-y-8">
          <header className="space-y-6 px-2 sm:px-0">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-none">
              Briser le <span className="text-blue-600 underline decoration-blue-200 underline-offset-4">silence.</span>
            </h2>
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Rechercher un témoignage..."
                className="w-full bg-white border-2 border-slate-100 pl-14 pr-6 py-4 sm:py-5 rounded-3xl sm:rounded-[2rem] focus:border-blue-600 outline-none shadow-sm transition-all font-medium"
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </header>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
          ) : (
            <div className="space-y-6">
              {postsFiltres.map(post => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  isExpanded={openPostId === post._id}
                  onToggle={() => setOpenPostId(openPostId === post._id ? null : post._id)}
                />
              ))}
            </div>
          )}
        </main>

        {/* Sidebar Droite */}
        <aside className="lg:col-span-3 hidden lg:block space-y-6">
          <button onClick={() => setIsModalOpen(true)} className="w-full bg-blue-600 text-white p-6 rounded-[2rem] font-black shadow-xl hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 text-lg">
            <PlusCircle size={24} /> Témoigner
          </button>
          <div className="bg-[#064E3B] text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <h3 className="text-lg font-black mb-2">Espace Sécurisé</h3>
            <p className="text-emerald-100/70 text-xs font-medium leading-relaxed mb-6">Confidentialité garantie.</p>
            <a href="tel:17" className="block w-full bg-emerald-500 py-3 rounded-xl font-black text-center text-sm">URGENCE : 17</a>
          </div>
        </aside>
      </div>

      {/* Modal Création */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="bg-white w-full max-w-xl rounded-t-[2.5rem] sm:rounded-[3rem] p-8 shadow-2xl relative animate-in slide-in-from-bottom-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black">Nouveau récit</h3>
              <button onClick={() => setIsModalOpen(false)}><X /></button>
            </div>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <input name="titre" required placeholder="Titre" className="w-full bg-slate-50 border-none p-4 rounded-2xl outline-none font-bold" />
             <select name="categorie" className="w-full bg-slate-50 border-none p-4 rounded-2xl outline-none font-bold">
  <option value="violence_physique">Violence physique</option>
  <option value="violence_conjugale">Violences conjugales</option>
  <option value="harcelement">Harcèlement</option>
  <option value="abus_enfant">Abus enfant</option>
  <option value="corruption">Corruption</option>
  <option value="kidnapping">Kidnapping</option>
  <option value="entraide">Soutien & Entraide</option>
  <option value="autre">Assistance Juridique</option>
</select>
              <div className="relative">
                <textarea 
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  required rows="5" placeholder="Votre histoire..." 
                  className="w-full bg-slate-50 border-none p-5 rounded-3xl outline-none font-medium resize-none" 
                />
                <button type="button" onClick={() => setShowEmojiModal(!showEmojiModal)} className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-sm">
                  <Smile size={20} className="text-blue-600" />
                </button>
                {showEmojiModal && (
                  <div className="absolute bottom-16 right-0 bg-white shadow-2xl border border-slate-100 p-2 rounded-2xl flex gap-2 overflow-x-auto max-w-[250px] z-50">
                    {QUICK_EMOJIS.map(e => (
                      <button key={e} type="button" onClick={() => {setPostContent(prev => prev + e); setShowEmojiModal(false);}} className="text-xl hover:scale-125 transition-transform">{e}</button>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black shadow-lg">
                {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Publier"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* COMPOSANT POSTCARD */
const PostCard = ({ post, isExpanded, onToggle }) => {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingAction, setSubmittingAction] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [soutiens, setSoutiens] = useState(post.soutiens || 0);
  const [aSoutenu, setASoutenu] = useState(post.aSoutenu || false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      const fetchComments = async () => {
        setLoadingComments(true);
        try {
          const res = await apiClient.get(`/posts/${post._id}/commentaires`);
          setComments(res.data.data || []);
        } catch (err) { console.error(err); }
        finally { setLoadingComments(false); }
      };
      fetchComments();
    }
  }, [isExpanded, post._id]);

  const handleSoutien = async (e) => {
    e.stopPropagation();
    setSubmittingAction(true);
    try {
      const res = await apiClient.post(`/posts/${post._id}/soutien`);
      setSoutiens(res.data.data.soutiens);
      setASoutenu(res.data.data.aSoutenu);
    } catch (err) { console.error(err); }
    finally { setSubmittingAction(false); }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Découvrez ce témoignage sur VoixLibre : "${post.titre}"`;
    const links = {
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    };
    window.open(links[platform], '_blank');
    setShowShareMenu(false);
  };

  return (
    <div className={`relative bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] transition-all ${isExpanded ? 'shadow-2xl ring-2 ring-blue-50' : 'hover:shadow-md'}`}>
      <div className="p-6 sm:p-10">
        <div className="flex justify-between items-start mb-4">
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
            {post.categorie?.replace('_', ' ')}
          </span>
          <div className="relative">
            <button onClick={() => setShowShareMenu(!showShareMenu)} className="text-slate-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-all">
              <Share2 size={18} />
            </button>
            {showShareMenu && (
              <div className="absolute right-0 mt-2 bg-white shadow-2xl rounded-2xl border border-slate-100 p-2 z-30 w-44 flex flex-col gap-1 animate-in fade-in zoom-in-95">
                <button onClick={() => handleShare('whatsapp')} className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-green-50 rounded-xl transition-colors">
                  <FaWhatsapp className="text-green-500" size={16}/> WhatsApp
                </button>
                <button onClick={() => handleShare('facebook')} className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-blue-50 rounded-xl transition-colors">
                  <FaFacebook className="text-blue-600" size={16}/> Facebook
                </button>
                <button onClick={() => handleShare('twitter')} className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                  <FaTwitter className="text-slate-900" size={16}/> Twitter (X)
                </button>
              </div>
            )}
          </div>
        </div>

        <h3 className="text-lg sm:text-2xl font-black text-slate-900 mb-4">{post.titre}</h3>
        <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8 italic">"{post.contenu}"</p>
        
        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-slate-400 text-[10px] uppercase">
              {post.auteurid?.pseudo?.[0] || 'A'}
            </div>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-wide">{post.auteurid?.pseudo || 'Anonyme'}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={handleSoutien}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-2xl text-[10px] sm:text-xs font-black transition-all ${aSoutenu ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-slate-50 text-slate-400'}`}
            >
              <Heart size={16} fill={aSoutenu ? 'currentColor' : 'none'} /> {soutiens}
            </button>
            <button onClick={onToggle} className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-2xl text-[10px] sm:text-xs font-black transition-all ${isExpanded ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
              <MessageSquare size={16} /> {post.commentaires_count}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-slate-50/50 p-6 sm:p-10 border-t border-slate-100 animate-in slide-in-from-top-4">
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (commentText.trim().length < 5) return;
            setSubmittingAction(true);
            try {
              const res = await apiClient.post(`/posts/${post._id}/commentaires`, { contenu: commentText });
              setComments([res.data.data, ...comments]);
              setCommentText('');
            } catch (err) { alert("Erreur d'envoi"); }
            finally { setSubmittingAction(false); }
          }} className="mb-8 space-y-4">
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
              {QUICK_EMOJIS.map(emoji => (
                <button key={emoji} type="button" onClick={() => setCommentText(prev => prev + emoji)} className="flex-shrink-0 text-xl hover:scale-125 transition-transform">{emoji}</button>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200">
              <input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Soutenir..." className="flex-1 bg-transparent border-none outline-none text-sm px-2" />
              <button type="submit" disabled={commentText.trim().length < 5 || submittingAction} className="p-3 bg-blue-600 text-white rounded-xl">
                {submittingAction ? <Loader2 size={18} className="animate-spin" /> : <Send size={18}/>}
              </button>
            </div>
          </form>
          <div className="space-y-4">
            {loadingComments ? <Loader2 className="animate-spin mx-auto text-blue-400" /> : 
              comments.map(c => (
                <div key={c._id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{c.auteurid?.pseudo || 'Anonyme'}</p>
                  <p className="text-slate-600 text-sm font-medium">{c.contenu}</p>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumVoixLibre;